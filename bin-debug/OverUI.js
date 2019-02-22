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
        this.score.text = '' + this.main.score;
        this.highscore.text = '历史最高分：' + this.main.highScore;
        egret.Tween.get(this.tip, { loop: true })
            .to({ x: 202 }, 300)
            .to({ x: 222 }, 300);
        var platform = window.platform;
        if (platform && platform.openDataContext && platform.openDataContext.postMessage) {
            this.rank_bitmap = platform.openDataContext.createDisplayObject(null, 750, 1344);
            this.addChild(this.rank_bitmap);
            platform.openDataContext.postMessage({
                command: "myscore",
                openid: this.main.openid,
                highscore: this.main.highScore,
            });
        }
        this.replay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartClick, this);
        this.rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRankClick, this);
    };
    OverUI.prototype.onStartClick = function (e) {
        console.log('onStartClick');
        this.main.setPage('game');
    };
    OverUI.prototype.onShareClick = function (e) {
        console.log('onShareClick');
    };
    OverUI.prototype.onRankClick = function (e) {
        console.log('onRankClick');
        var rank = new RankUI(this.main, this);
        rank.onButtonRankClick(e);
    };
    return OverUI;
}(eui.Component));
__reflect(OverUI.prototype, "OverUI", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=OverUI.js.map