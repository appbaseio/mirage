import { global } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ListWrapper } from 'angular2/src/facade/collection';
var _scheduler;
var _microtasks = [];
var _pendingPeriodicTimers = [];
var _pendingTimers = [];
class FakeAsyncZoneSpec {
    constructor() {
        this.name = 'fakeAsync';
        this.properties = { 'inFakeAsyncZone': true };
    }
    static assertInZone() {
        if (!Zone.current.get('inFakeAsyncZone')) {
            throw new Error('The code should be running in the fakeAsync zone to call this function');
        }
    }
    onScheduleTask(delegate, current, target, task) {
        switch (task.type) {
            case 'microTask':
                _microtasks.push(task.invoke);
                break;
            case 'macroTask':
                switch (task.source) {
                    case 'setTimeout':
                        task.data['handleId'] = _setTimeout(task.invoke, task.data['delay'], task.data['args']);
                        break;
                    case 'setInterval':
                        task.data['handleId'] =
                            _setInterval(task.invoke, task.data['delay'], task.data['args']);
                        break;
                    default:
                        task = delegate.scheduleTask(target, task);
                }
                break;
            case 'eventTask':
                task = delegate.scheduleTask(target, task);
                break;
        }
        return task;
    }
    onCancelTask(delegate, current, target, task) {
        switch (task.source) {
            case 'setTimeout':
                return _clearTimeout(task.data['handleId']);
            case 'setInterval':
                return _clearInterval(task.data['handleId']);
            default:
                return delegate.scheduleTask(target, task);
        }
    }
}
/**
 * Wraps a function to be executed in the fakeAsync zone:
 * - microtasks are manually executed by calling `flushMicrotasks()`,
 * - timers are synchronous, `tick()` simulates the asynchronous passage of time.
 *
 * If there are any pending timers at the end of the function, an exception will be thrown.
 *
 * ## Example
 *
 * {@example testing/ts/fake_async.ts region='basic'}
 *
 * @param fn
 * @returns {Function} The function wrapped to be executed in the fakeAsync zone
 */
export function fakeAsync(fn) {
    if (Zone.current.get('inFakeAsyncZone')) {
        throw new Error('fakeAsync() calls can not be nested');
    }
    var fakeAsyncZone = Zone.current.fork(new FakeAsyncZoneSpec());
    return function (...args) {
        // TODO(tbosch): This class should already be part of the jasmine typings but it is not...
        _scheduler = new jasmine.DelayedFunctionScheduler();
        clearPendingTimers();
        let res = fakeAsyncZone.run(() => {
            let res = fn(...args);
            flushMicrotasks();
            return res;
        });
        if (_pendingPeriodicTimers.length > 0) {
            throw new BaseException(`${_pendingPeriodicTimers.length} periodic timer(s) still in the queue.`);
        }
        if (_pendingTimers.length > 0) {
            throw new BaseException(`${_pendingTimers.length} timer(s) still in the queue.`);
        }
        _scheduler = null;
        ListWrapper.clear(_microtasks);
        return res;
    };
}
/**
 * Clear the queue of pending timers and microtasks.
 *
 * Useful for cleaning up after an asynchronous test passes.
 *
 * ## Example
 *
 * {@example testing/ts/fake_async.ts region='pending'}
 */
export function clearPendingTimers() {
    // TODO we should fix tick to dequeue the failed timer instead of relying on clearPendingTimers
    ListWrapper.clear(_microtasks);
    ListWrapper.clear(_pendingPeriodicTimers);
    ListWrapper.clear(_pendingTimers);
}
/**
 * Simulates the asynchronous passage of time for the timers in the fakeAsync zone.
 *
 * The microtasks queue is drained at the very start of this function and after any timer callback
 * has been executed.
 *
 * ## Example
 *
 * {@example testing/ts/fake_async.ts region='basic'}
 *
 * @param {number} millis Number of millisecond, defaults to 0
 */
export function tick(millis = 0) {
    FakeAsyncZoneSpec.assertInZone();
    flushMicrotasks();
    _scheduler.tick(millis);
}
/**
 * Flush any pending microtasks.
 */
export function flushMicrotasks() {
    FakeAsyncZoneSpec.assertInZone();
    while (_microtasks.length > 0) {
        var microtask = ListWrapper.removeAt(_microtasks, 0);
        microtask();
    }
}
function _setTimeout(fn, delay, args) {
    var cb = _fnAndFlush(fn);
    var id = _scheduler.scheduleFunction(cb, delay, args);
    _pendingTimers.push(id);
    _scheduler.scheduleFunction(_dequeueTimer(id), delay);
    return id;
}
function _clearTimeout(id) {
    _dequeueTimer(id);
    return _scheduler.removeFunctionWithId(id);
}
function _setInterval(fn, interval, ...args) {
    var cb = _fnAndFlush(fn);
    var id = _scheduler.scheduleFunction(cb, interval, args, true);
    _pendingPeriodicTimers.push(id);
    return id;
}
function _clearInterval(id) {
    ListWrapper.remove(_pendingPeriodicTimers, id);
    return _scheduler.removeFunctionWithId(id);
}
function _fnAndFlush(fn) {
    return (...args) => {
        fn.apply(global, args);
        flushMicrotasks();
    };
}
function _dequeueTimer(id) {
    return function () { ListWrapper.remove(_pendingTimers, id); };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZV9hc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtb1hETzRwMnYudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL2Zha2VfYXN5bmMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSwwQkFBMEI7T0FDeEMsRUFBQyxhQUFhLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDckQsRUFBQyxXQUFXLEVBQUMsTUFBTSxnQ0FBZ0M7QUFFMUQsSUFBSSxVQUFVLENBQUM7QUFDZixJQUFJLFdBQVcsR0FBZSxFQUFFLENBQUM7QUFDakMsSUFBSSxzQkFBc0IsR0FBYSxFQUFFLENBQUM7QUFDMUMsSUFBSSxjQUFjLEdBQWEsRUFBRSxDQUFDO0FBRWxDO0lBQUE7UUFPRSxTQUFJLEdBQVcsV0FBVyxDQUFDO1FBRTNCLGVBQVUsR0FBeUIsRUFBQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQXFDL0QsQ0FBQztJQTdDQyxPQUFPLFlBQVk7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLElBQUksS0FBSyxDQUFDLHdFQUF3RSxDQUFDLENBQUM7UUFDNUYsQ0FBQztJQUNILENBQUM7SUFNRCxjQUFjLENBQUMsUUFBc0IsRUFBRSxPQUFhLEVBQUUsTUFBWSxFQUFFLElBQVU7UUFDNUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEIsS0FBSyxXQUFXO2dCQUNkLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM5QixLQUFLLENBQUM7WUFDUixLQUFLLFdBQVc7Z0JBQ2QsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JB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QUVELHVCQUF1QixFQUFVO0lBQy9CLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsQixNQUFNLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRCxzQkFBc0IsRUFBWSxFQUFFLFFBQWdCLEVBQUUsR0FBRyxJQUFJO0lBQzNELElBQUksRUFBRSxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QixJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0Qsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDWixDQUFDO0FBRUQsd0JBQXdCLEVBQVU7SUFDaEMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQyxNQUFNLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRCxxQkFBcUIsRUFBWTtJQUMvQixNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUk7UUFDYixFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QixlQUFlLEVBQUUsQ0FBQztJQUNwQixDQUFDLENBQUE7QUFDSCxDQUFDO0FBRUQsdUJBQXVCLEVBQVU7SUFDL0IsTUFBTSxDQUFDLGNBQWEsV0FBVyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDL0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Z2xvYmFsfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxudmFyIF9zY2hlZHVsZXI7XG52YXIgX21pY3JvdGFza3M6IEZ1bmN0aW9uW10gPSBbXTtcbnZhciBfcGVuZGluZ1BlcmlvZGljVGltZXJzOiBudW1iZXJbXSA9IFtdO1xudmFyIF9wZW5kaW5nVGltZXJzOiBudW1iZXJbXSA9IFtdO1xuXG5jbGFzcyBGYWtlQXN5bmNab25lU3BlYyBpbXBsZW1lbnRzIFpvbmVTcGVjIHtcbiAgc3RhdGljIGFzc2VydEluWm9uZSgpOiB2b2lkIHtcbiAgICBpZiAoIVpvbmUuY3VycmVudC5nZXQoJ2luRmFrZUFzeW5jWm9uZScpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb2RlIHNob3VsZCBiZSBydW5uaW5nIGluIHRoZSBmYWtlQXN5bmMgem9uZSB0byBjYWxsIHRoaXMgZnVuY3Rpb24nKTtcbiAgICB9XG4gIH1cblxuICBuYW1lOiBzdHJpbmcgPSAnZmFrZUFzeW5jJztcblxuICBwcm9wZXJ0aWVzOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHsnaW5GYWtlQXN5bmNab25lJzogdHJ1ZX07XG5cbiAgb25TY2hlZHVsZVRhc2soZGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudDogWm9uZSwgdGFyZ2V0OiBab25lLCB0YXNrOiBUYXNrKTogVGFzayB7XG4gICAgc3dpdGNoICh0YXNrLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21pY3JvVGFzayc6XG4gICAgICAgIF9taWNyb3Rhc2tzLnB1c2godGFzay5pbnZva2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21hY3JvVGFzayc6XG4gICAgICAgIHN3aXRjaCAodGFzay5zb3VyY2UpIHtcbiAgICAgICAgICBjYXNlICdzZXRUaW1lb3V0JzpcbiAgICAgICAgICAgIHRhc2suZGF0YVsnaGFuZGxlSWQnXSA9IF9zZXRUaW1lb3V0KHRhc2suaW52b2tlLCB0YXNrLmRhdGFbJ2RlbGF5J10sIHRhc2suZGF0YVsnYXJncyddKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3NldEludGVydmFsJzpcbiAgICAgICAgICAgIHRhc2suZGF0YVsnaGFuZGxlSWQnXSA9XG4gICAgICAgICAgICAgICAgX3NldEludGVydmFsKHRhc2suaW52b2tlLCB0YXNrLmRhdGFbJ2RlbGF5J10sIHRhc2suZGF0YVsnYXJncyddKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0YXNrID0gZGVsZWdhdGUuc2NoZWR1bGVUYXNrKHRhcmdldCwgdGFzayk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdldmVudFRhc2snOlxuICAgICAgICB0YXNrID0gZGVsZWdhdGUuc2NoZWR1bGVUYXNrKHRhcmdldCwgdGFzayk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gdGFzaztcbiAgfVxuXG4gIG9uQ2FuY2VsVGFzayhkZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50OiBab25lLCB0YXJnZXQ6IFpvbmUsIHRhc2s6IFRhc2spOiBhbnkge1xuICAgIHN3aXRjaCAodGFzay5zb3VyY2UpIHtcbiAgICAgIGNhc2UgJ3NldFRpbWVvdXQnOlxuICAgICAgICByZXR1cm4gX2NsZWFyVGltZW91dCh0YXNrLmRhdGFbJ2hhbmRsZUlkJ10pO1xuICAgICAgY2FzZSAnc2V0SW50ZXJ2YWwnOlxuICAgICAgICByZXR1cm4gX2NsZWFySW50ZXJ2YWwodGFzay5kYXRhWydoYW5kbGVJZCddKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5zY2hlZHVsZVRhc2sodGFyZ2V0LCB0YXNrKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBXcmFwcyBhIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGluIHRoZSBmYWtlQXN5bmMgem9uZTpcbiAqIC0gbWljcm90YXNrcyBhcmUgbWFudWFsbHkgZXhlY3V0ZWQgYnkgY2FsbGluZyBgZmx1c2hNaWNyb3Rhc2tzKClgLFxuICogLSB0aW1lcnMgYXJlIHN5bmNocm9ub3VzLCBgdGljaygpYCBzaW11bGF0ZXMgdGhlIGFzeW5jaHJvbm91cyBwYXNzYWdlIG9mIHRpbWUuXG4gKlxuICogSWYgdGhlcmUgYXJlIGFueSBwZW5kaW5nIHRpbWVycyBhdCB0aGUgZW5kIG9mIHRoZSBmdW5jdGlvbiwgYW4gZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgdGVzdGluZy90cy9mYWtlX2FzeW5jLnRzIHJlZ2lvbj0nYmFzaWMnfVxuICpcbiAqIEBwYXJhbSBmblxuICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gd3JhcHBlZCB0byBiZSBleGVjdXRlZCBpbiB0aGUgZmFrZUFzeW5jIHpvbmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZha2VBc3luYyhmbjogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gIGlmIChab25lLmN1cnJlbnQuZ2V0KCdpbkZha2VBc3luY1pvbmUnKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignZmFrZUFzeW5jKCkgY2FsbHMgY2FuIG5vdCBiZSBuZXN0ZWQnKTtcbiAgfVxuXG4gIHZhciBmYWtlQXN5bmNab25lID0gWm9uZS5jdXJyZW50LmZvcmsobmV3IEZha2VBc3luY1pvbmVTcGVjKCkpO1xuXG4gIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgLy8gVE9ETyh0Ym9zY2gpOiBUaGlzIGNsYXNzIHNob3VsZCBhbHJlYWR5IGJlIHBhcnQgb2YgdGhlIGphc21pbmUgdHlwaW5ncyBidXQgaXQgaXMgbm90Li4uXG4gICAgX3NjaGVkdWxlciA9IG5ldyAoPGFueT5qYXNtaW5lKS5EZWxheWVkRnVuY3Rpb25TY2hlZHVsZXIoKTtcbiAgICBjbGVhclBlbmRpbmdUaW1lcnMoKTtcblxuICAgIGxldCByZXMgPSBmYWtlQXN5bmNab25lLnJ1bigoKSA9PiB7XG4gICAgICBsZXQgcmVzID0gZm4oLi4uYXJncyk7XG4gICAgICBmbHVzaE1pY3JvdGFza3MoKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSk7XG5cbiAgICBpZiAoX3BlbmRpbmdQZXJpb2RpY1RpbWVycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcbiAgICAgICAgICBgJHtfcGVuZGluZ1BlcmlvZGljVGltZXJzLmxlbmd0aH0gcGVyaW9kaWMgdGltZXIocykgc3RpbGwgaW4gdGhlIHF1ZXVlLmApO1xuICAgIH1cblxuICAgIGlmIChfcGVuZGluZ1RpbWVycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgJHtfcGVuZGluZ1RpbWVycy5sZW5ndGh9IHRpbWVyKHMpIHN0aWxsIGluIHRoZSBxdWV1ZS5gKTtcbiAgICB9XG5cbiAgICBfc2NoZWR1bGVyID0gbnVsbDtcbiAgICBMaXN0V3JhcHBlci5jbGVhcihfbWljcm90YXNrcyk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbi8qKlxuICogQ2xlYXIgdGhlIHF1ZXVlIG9mIHBlbmRpbmcgdGltZXJzIGFuZCBtaWNyb3Rhc2tzLlxuICpcbiAqIFVzZWZ1bCBmb3IgY2xlYW5pbmcgdXAgYWZ0ZXIgYW4gYXN5bmNocm9ub3VzIHRlc3QgcGFzc2VzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgdGVzdGluZy90cy9mYWtlX2FzeW5jLnRzIHJlZ2lvbj0ncGVuZGluZyd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhclBlbmRpbmdUaW1lcnMoKTogdm9pZCB7XG4gIC8vIFRPRE8gd2Ugc2hvdWxkIGZpeCB0aWNrIHRvIGRlcXVldWUgdGhlIGZhaWxlZCB0aW1lciBpbnN0ZWFkIG9mIHJlbHlpbmcgb24gY2xlYXJQZW5kaW5nVGltZXJzXG4gIExpc3RXcmFwcGVyLmNsZWFyKF9taWNyb3Rhc2tzKTtcbiAgTGlzdFdyYXBwZXIuY2xlYXIoX3BlbmRpbmdQZXJpb2RpY1RpbWVycyk7XG4gIExpc3RXcmFwcGVyLmNsZWFyKF9wZW5kaW5nVGltZXJzKTtcbn1cblxuXG4vKipcbiAqIFNpbXVsYXRlcyB0aGUgYXN5bmNocm9ub3VzIHBhc3NhZ2Ugb2YgdGltZSBmb3IgdGhlIHRpbWVycyBpbiB0aGUgZmFrZUFzeW5jIHpvbmUuXG4gKlxuICogVGhlIG1pY3JvdGFza3MgcXVldWUgaXMgZHJhaW5lZCBhdCB0aGUgdmVyeSBzdGFydCBvZiB0aGlzIGZ1bmN0aW9uIGFuZCBhZnRlciBhbnkgdGltZXIgY2FsbGJhY2tcbiAqIGhhcyBiZWVuIGV4ZWN1dGVkLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgdGVzdGluZy90cy9mYWtlX2FzeW5jLnRzIHJlZ2lvbj0nYmFzaWMnfVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaWxsaXMgTnVtYmVyIG9mIG1pbGxpc2Vjb25kLCBkZWZhdWx0cyB0byAwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aWNrKG1pbGxpczogbnVtYmVyID0gMCk6IHZvaWQge1xuICBGYWtlQXN5bmNab25lU3BlYy5hc3NlcnRJblpvbmUoKTtcbiAgZmx1c2hNaWNyb3Rhc2tzKCk7XG4gIF9zY2hlZHVsZXIudGljayhtaWxsaXMpO1xufVxuXG4vKipcbiAqIEZsdXNoIGFueSBwZW5kaW5nIG1pY3JvdGFza3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbHVzaE1pY3JvdGFza3MoKTogdm9pZCB7XG4gIEZha2VBc3luY1pvbmVTcGVjLmFzc2VydEluWm9uZSgpO1xuICB3aGlsZSAoX21pY3JvdGFza3MubGVuZ3RoID4gMCkge1xuICAgIHZhciBtaWNyb3Rhc2sgPSBMaXN0V3JhcHBlci5yZW1vdmVBdChfbWljcm90YXNrcywgMCk7XG4gICAgbWljcm90YXNrKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3NldFRpbWVvdXQoZm46IEZ1bmN0aW9uLCBkZWxheTogbnVtYmVyLCBhcmdzOiBhbnlbXSk6IG51bWJlciB7XG4gIHZhciBjYiA9IF9mbkFuZEZsdXNoKGZuKTtcbiAgdmFyIGlkID0gX3NjaGVkdWxlci5zY2hlZHVsZUZ1bmN0aW9uKGNiLCBkZWxheSwgYXJncyk7XG4gIF9wZW5kaW5nVGltZXJzLnB1c2goaWQpO1xuICBfc2NoZWR1bGVyLnNjaGVkdWxlRnVuY3Rpb24oX2RlcXVldWVUaW1lcihpZCksIGRlbGF5KTtcbiAgcmV0dXJuIGlkO1xufVxuXG5mdW5jdGlvbiBfY2xlYXJUaW1lb3V0KGlkOiBudW1iZXIpIHtcbiAgX2RlcXVldWVUaW1lcihpZCk7XG4gIHJldHVybiBfc2NoZWR1bGVyLnJlbW92ZUZ1bmN0aW9uV2l0aElkKGlkKTtcbn1cblxuZnVuY3Rpb24gX3NldEludGVydmFsKGZuOiBGdW5jdGlvbiwgaW50ZXJ2YWw6IG51bWJlciwgLi4uYXJncykge1xuICB2YXIgY2IgPSBfZm5BbmRGbHVzaChmbik7XG4gIHZhciBpZCA9IF9zY2hlZHVsZXIuc2NoZWR1bGVGdW5jdGlvbihjYiwgaW50ZXJ2YWwsIGFyZ3MsIHRydWUpO1xuICBfcGVuZGluZ1BlcmlvZGljVGltZXJzLnB1c2goaWQpO1xuICByZXR1cm4gaWQ7XG59XG5cbmZ1bmN0aW9uIF9jbGVhckludGVydmFsKGlkOiBudW1iZXIpIHtcbiAgTGlzdFdyYXBwZXIucmVtb3ZlKF9wZW5kaW5nUGVyaW9kaWNUaW1lcnMsIGlkKTtcbiAgcmV0dXJuIF9zY2hlZHVsZXIucmVtb3ZlRnVuY3Rpb25XaXRoSWQoaWQpO1xufVxuXG5mdW5jdGlvbiBfZm5BbmRGbHVzaChmbjogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgIGZuLmFwcGx5KGdsb2JhbCwgYXJncyk7XG4gICAgZmx1c2hNaWNyb3Rhc2tzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2RlcXVldWVUaW1lcihpZDogbnVtYmVyKTogRnVuY3Rpb24ge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7IExpc3RXcmFwcGVyLnJlbW92ZShfcGVuZGluZ1RpbWVycywgaWQpOyB9XG59XG4iXX0=