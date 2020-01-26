//节流函数 指定间隔时间执行一次
function throttle(fn, interval) {
    var __self = fn,
        timer,
        firstTime = true;
    return function () {
        var args = arguments,
            __me = this;
        if (timer) {
            return false;
        }
        timer = setTimeout(function () {
            clearTimeout(timer);
            timer = null;
            __self.apply(__me, args);
        }, interval || 500);
    };
}
export { throttle };