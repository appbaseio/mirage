import { Pipe, Injectable } from '@angular/core';
import { isDate, isNumber, DateWrapper, isBlank } from '../../src/facade/lang';
import { DateFormatter } from '../../src/facade/intl';
import { StringMapWrapper } from '../../src/facade/collection';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
// TODO: move to a global configurable location along with other i18n components.
var defaultLocale = 'en-US';
export class DatePipe {
    transform(value, pattern = 'mediumDate') {
        if (isBlank(value))
            return null;
        if (!this.supports(value)) {
            throw new InvalidPipeArgumentException(DatePipe, value);
        }
        if (isNumber(value)) {
            value = DateWrapper.fromMillis(value);
        }
        if (StringMapWrapper.contains(DatePipe._ALIASES, pattern)) {
            pattern = StringMapWrapper.get(DatePipe._ALIASES, pattern);
        }
        return DateFormatter.format(value, defaultLocale, pattern);
    }
    supports(obj) { return isDate(obj) || isNumber(obj); }
}
/** @internal */
DatePipe._ALIASES = {
    'medium': 'yMMMdjms',
    'short': 'yMdjm',
    'fullDate': 'yMMMMEEEEd',
    'longDate': 'yMMMMd',
    'mediumDate': 'yMMMd',
    'shortDate': 'yMd',
    'mediumTime': 'jms',
    'shortTime': 'jm'
};
DatePipe.decorators = [
    { type: Pipe, args: [{ name: 'date', pure: true },] },
    { type: Injectable },
];
//# sourceMappingURL=date_pipe.js.map