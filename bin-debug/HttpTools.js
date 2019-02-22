var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var HttpTools = (function () {
    function HttpTools() {
    }
    // 想一个url发送一个data数据，并获取返回结果
    // data是一个json对象，只能有一层结构
    HttpTools.httpPost = function (url, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log(url, data);
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            if (data) {
                var params = Object.keys(data).map(function (key) {
                    // body...
                    return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
                }).join("&");
                request.send(params);
            }
            else {
                request.send();
            }
            request.addEventListener(egret.Event.COMPLETE, function (event) {
                var request = event.currentTarget;
                console.log("get data : ", request.response);
                resolve({
                    errcode: 0,
                    data: request.response
                });
            }, _this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event) {
                console.log("get error : " + event);
                resolve({
                    errcode: 1,
                });
            }, _this);
            request.addEventListener(egret.ProgressEvent.PROGRESS, function (event) {
                console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
            }, _this);
        });
    };
    return HttpTools;
}());
__reflect(HttpTools.prototype, "HttpTools");
//# sourceMappingURL=HttpTools.js.map