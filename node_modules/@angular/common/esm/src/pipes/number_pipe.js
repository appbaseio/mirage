import { Injectable, Pipe } from '@angular/core';
import { isNumber, isPresent, isBlank, NumberWrapper, RegExpWrapper } from '../../src/facade/lang';
import { BaseException } from '../../src/facade/exceptions';
import { NumberFormatter, NumberFormatStyle } from '../../src/facade/intl';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
var defaultLocale = 'en-US';
var _re = RegExpWrapper.create('^(\\d+)?\\.((\\d+)(\\-(\\d+))?)?$');
export class NumberPipe {
    /** @internal */
    static _format(value, style, digits, currency = null, currencyAsSymbol = false) {
        if (isBlank(value))
            return null;
        if (!isNumber(value)) {
            throw new InvalidPipeArgumentException(NumberPipe, value);
        }
        var minInt = 1, minFraction = 0, maxFraction = 3;
        if (isPresent(digits)) {
            var parts = RegExpWrapper.firstMatch(_re, digits);
            if (isBlank(parts)) {
                throw new BaseException(`${digits} is not a valid digit info for number pipes`);
            }
            if (isPresent(parts[1])) {
                minInt = NumberWrapper.parseIntAutoRadix(parts[1]);
            }
            if (isPresent(parts[3])) {
                minFraction = NumberWrapper.parseIntAutoRadix(parts[3]);
            }
            if (isPresent(parts[5])) {
                maxFraction = NumberWrapper.parseIntAutoRadix(parts[5]);
            }
        }
        return NumberFormatter.format(value, defaultLocale, style, {
            minimumIntegerDigits: minInt,
            minimumFractionDigits: minFraction,
            maximumFractionDigits: maxFraction,
            currency: currency,
            currencyAsSymbol: currencyAsSymbol
        });
    }
}
NumberPipe.decorators = [
    { type: Injectable },
];
export class DecimalPipe extends NumberPipe {
    transform(value, digits = null) {
        return NumberPipe._format(value, NumberFormatStyle.Decimal, digits);
    }
}
DecimalPipe.decorators = [
    { type: Pipe, args: [{ name: 'number' },] },
    { type: Injectable },
];
export class PercentPipe extends NumberPipe {
    transform(value, digits = null) {
        return NumberPipe._format(value, NumberFormatStyle.Percent, digits);
    }
}
PercentPipe.decorators = [
    { type: Pipe, args: [{ name: 'percent' },] },
    { type: Injectable },
];
export class CurrencyPipe extends NumberPipe {
    transform(value, currencyCode = 'USD', symbolDisplay = false, digits = null) {
        return NumberPipe._format(value, NumberFormatStyle.Currency, digits, currencyCode, symbolDisplay);
    }
}
CurrencyPipe.decorators = [
    { type: Pipe, args: [{ name: 'currency' },] },
    { type: Injectable },
];
//# sourceMappingURL=number_pipe.js.map