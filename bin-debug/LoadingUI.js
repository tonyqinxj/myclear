var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.bg = ResTools.createBitmapByName("progress_bg_png");
        this.front = ResTools.createBitmapByName("progress_front_png");
        this.bg.x = 54;
        this.bg.y = 1013;
        this.bg.width = 642;
        this.bg.height = 45;
        this.addChild(this.bg);
        this.front.x = 54;
        this.front.y = 1013;
        this.front.height = 45;
        this.front.width = 0;
        this.addChild(this.front);
        // this.textField = new egret.TextField();
        // this.addChild(this.textField);
        // this.textField.x = 54;
        // this.textField.y = 1031;
        // this.textField.width = 642;
        // this.textField.height = 45;
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        //this.textField.text = `Loading...${current}/${total}`;
        this.front.width = 642 * current / total;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
//# sourceMappingURL=LoadingUI.js.map