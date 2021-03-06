var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RankUI = (function () {
    function RankUI(main, myparent) {
        // 排行榜代码
        this.rank_bitmap = null;
        this.rank_isdisplay = false;
        this.rankingListMask = null;
        this.rank_top_panel = null;
        this.rank_close = null;
        this.rank_my_panel = null;
        this.rank_title = null;
        this.main = main;
        this.myparent = myparent;
    }
    // 关闭排行榜数据
    RankUI.prototype.onButtonRankCloseClick = function (e) {
        // 检测是不是phone环境，不是直接返回
        var platform = window.platform;
        var haveOpenData = false;
        if (platform && platform.openDataContext && platform.openDataContext.postMessage) {
            haveOpenData = true;
        }
        if (!haveOpenData)
            return;
        // 关闭排行榜数据
        if (this.rank_isdisplay) {
            this.rank_bitmap.parent && this.rank_bitmap.parent.removeChild(this.rank_bitmap);
            this.rankingListMask.parent && this.rankingListMask.parent.removeChild(this.rankingListMask);
            this.rank_top_panel.parent && this.rank_top_panel.parent.removeChild(this.rank_top_panel);
            this.rank_close.parent && this.rank_close.parent.removeChild(this.rank_close);
            this.rank_my_panel.parent && this.rank_my_panel.parent.removeChild(this.rank_my_panel);
            this.rank_title.parent && this.rank_title.parent.removeChild(this.rank_title);
            this.rank_bitmap = null;
            this.rankingListMask = null;
            this.rank_top_panel = null;
            this.rank_close = null;
            this.rank_my_panel = null;
            this.rank_title = null;
            this.rank_isdisplay = false;
            platform.openDataContext.postMessage({
                isDisplay: this.rank_isdisplay,
                command: 'rank'
            });
        }
    };
    // 开启排行榜数据
    RankUI.prototype.onButtonRankClick = function (e) {
        // 已经开了，直接返回
        if (this.rank_isdisplay)
            return;
        // 检测是不是phone环境，不是直接返回
        var platform = window.platform;
        var haveOpenData = false;
        if (platform && platform.openDataContext && platform.openDataContext.postMessage) {
            haveOpenData = true;
        }
        if (!haveOpenData)
            return;
        // 开始绘制排行榜
        //处理遮罩，避免开放数据域事件影响主域。
        this.rankingListMask = new egret.Shape();
        this.rankingListMask.graphics.beginFill(0x000000, 1);
        this.rankingListMask.graphics.drawRect(0, 0, this.myparent.width, this.myparent.height);
        this.rankingListMask.graphics.endFill();
        this.rankingListMask.alpha = 0.5;
        this.rankingListMask.touchEnabled = true;
        this.myparent.addChild(this.rankingListMask);
        // 绘制排行底板：
        var rank_top_panel = ResTools.createBitmapByName('game_panel_png');
        rank_top_panel.x = 70;
        rank_top_panel.y = 226;
        rank_top_panel.width = 611;
        rank_top_panel.height = 658;
        this.myparent.addChild(rank_top_panel);
        this.rank_top_panel = rank_top_panel;
        var title = new eui.Label();
        title.text = '好友排行';
        title.x = 293;
        title.y = 255;
        title.size = 40;
        title.textColor = 0xFFFFFF;
        title.bold = true;
        this.myparent.addChild(title);
        this.rank_title = title;
        // 绘制关闭按钮：
        var rank_close = ResTools.createBitmapByName('close_png');
        rank_close.x = 628;
        rank_close.y = 241;
        rank_close.width = 36;
        rank_close.height = 36;
        this.myparent.addChild(rank_close);
        rank_close.touchEnabled = true;
        this.rank_close = rank_close;
        rank_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonRankCloseClick, this);
        // 绘制自己的底板
        var rank_my_panel = ResTools.createBitmapByName('game_panel_png');
        rank_my_panel.x = 70;
        rank_my_panel.y = 901;
        rank_my_panel.width = 611;
        rank_my_panel.height = 134;
        this.myparent.addChild(rank_my_panel);
        this.rank_my_panel = rank_my_panel;
        var h = this.myparent.height;
        if (window["canvas"]) {
            var r_w = window["canvas"].width;
            var r_h = window["canvas"].height;
            h = Math.floor(r_h * this.myparent.width / r_w);
        }
        this.rank_bitmap = platform.openDataContext.createDisplayObject(null, this.myparent.width, h);
        this.myparent.addChild(this.rank_bitmap);
        //主域向子域发送自定义消息
        this.rank_isdisplay = true;
        platform.openDataContext.postMessage({
            isDisplay: this.rank_isdisplay,
            command: "rank",
            openid: this.main.openid,
            highscore: this.main.highScore
        });
    };
    return RankUI;
}());
__reflect(RankUI.prototype, "RankUI");
//# sourceMappingURL=RankUI.js.map