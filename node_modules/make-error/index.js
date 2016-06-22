// ISC @ Julien Fontanet

'use strict'

// ===================================================================

var defineProperty = Object.defineProperty

// -------------------------------------------------------------------

var isString = (function (toS) {
  var ref = toS.call('')
  return function isString (val) {
    return toS.call(val) === ref
  }
})(Object.prototype.toString)

// -------------------------------------------------------------------

var captureStackTrace
if (Error.captureStackTrace) {
  captureStackTrace = Error.captureStackTrace
} else {
  captureStackTrace = function captureStackTrace (error) {
    var container = new Error()

    defineProperty(error, 'stack', {
      configurable: true,
      get: function getStack () {
        var stack = container.stack

        // Replace property with value for faster future accesses.
        defineProperty(this, 'stack', {
          value: stack
        })

        return stack
      },
      set: function setStack (stack) {
        defineProperty(error, 'stack', {
          configurable: true,
          value: stack,
          writable: true
        })
      }
    })
  }
}

// -------------------------------------------------------------------

function BaseError (message) {
  if (message) {
    defineProperty(this, 'message', {
      configurable: true,
      value: message,
      writable: true
    })
  }

  var cname = this.constructor.name
  if (
    cname &&
    cname !== this.name
  ) {
    defineProperty(this, 'name', {
      configurable: true,
      value: cname,
      writable: true
    })
  }

  captureStackTrace(this, this.constructor)
}

BaseError.prototype = Object.create(Error.prototype, {
  // See: https://github.com/julien-f/js-make-error/issues/4
  constructor: {
    configurable: true,
    value: BaseError,
    writable: true
  }
})

// -------------------------------------------------------------------

function makeError (constructor, super_) {
  if (!super_ || super_ === Error) {
    super_ = BaseError
  }

  var name
  if (isString(constructor)) {
    name = constructor
    constructor = function () { super_.apply(this, arguments) }
  } else {
    name = constructor.name
  }

  // Also register the super constructor also as `constructor.super_` just
  // like Node's `util.inherits()`.
  constructor.super_ = constructor['super'] = super_

  constructor.prototype = Object.create(super_.prototype, {
    constructor: {
      configurable: true,
      value: constructor,
      writable: true
    },
    name: {
      configurable: true,
      value: name,
      writable: true
    }
  })

  return constructor
}
exports = module.exports = makeError
exports.BaseError = BaseError
