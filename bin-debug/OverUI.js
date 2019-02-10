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
var OverUI = (function (_super) {
    __extends(OverUI, _super);
    function OverUI(main) {
        var _this = _super.call(this) || this;
        _this.main = main;
        return _this;
    }
    OverUI.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    OverUI.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.init();
    };
    OverUI.prototype.init = function () {
        this.restart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartClick, this);
    };
    OverUI.prototype.onStartClick = function (e) {
        console.log('onStartClick');
        this.main.setPage('game');
    };
    return OverUI;
}(eui.Component));
__reflect(OverUI.prototype, "OverUI", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=OverUI.js.map