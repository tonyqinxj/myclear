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
var GameUI = (function (_super) {
    __extends(GameUI, _super);
    function GameUI(main) {
        var _this = _super.call(this) || this;
        // 音效
        _this.sounds = [];
        _this.main = main;
        _this.opdata = [];
        _this.shadow = [];
        _this.shadow_pos = null;
        _this.curdata = null;
        _this.curblockview = null;
        _this.gameData = new myClear.GameData();
        return _this;
    }
    GameUI.prototype.playMusic = function (name, times) {
        console.log('play:', name, times);
        var res_name = 'resource/sounds/' + name.match(/(.+)_mp3/)[1] + '.mp3';
        var platform = window.platform;
        platform.playMusic(res_name, times);
        return;
        // 方法一
        // for (let i = 0; i < this.sounds.length; i++) {
        // 	let sound = this.sounds[i];
        // 	if (sound.name == name) {
        // 		sound.sound.play(0, times);
        // 		return;
        // 	}
        // }
        // var loader: egret.URLLoader = new egret.URLLoader();
        // loader.addEventListener(egret.Event.COMPLETE, function loadOver(event: egret.Event) {
        // 	var sound: egret.Sound = loader.data;
        // 	sound.play(0, times);
        // 	this.sounds.push({
        // 		name: name,
        // 		sound: sound
        // 	})
        // }, this);
        // loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        // loader.load(new egret.URLRequest(res_name));
        // 方法二
        // let sound: egret.Sound = new egret.Sound();
        // sound.addEventListener(egret.Event.COMPLETE, (event: egret.Event) => {
        // 	sound.play(0, times);
        // 	this.sounds.push({
        // 		name: name,
        // 		sound: sound
        // 	})
        // }, this);
        // sound.addEventListener(egret.IOErrorEvent.IO_ERROR, (event: egret.IOErrorEvent) => {
        // 	console.log("loaded error!");
        // }, this);
        // sound.load(res_name);
        // 方法三
        //let sound: egret.Sound = RES.getRes(name);
        //sound.play(0, times);
        // this.sounds.push({
        // 	name: name,
        // 	sound: sound
        // })
    };
    GameUI.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    GameUI.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.init();
    };
    GameUI.prototype.init = function () {
        this.lastcleartime = 0;
        this.cleartimes = 0;
        this.gz_width = this.game.width / 8;
        this.fk_width = this.gz_width - 2;
        this.gameData.init(this.gz_width, this.fk_width);
        this.opdata.push({ op: this.op1 });
        this.opdata.push({ op: this.op2 });
        this.opdata.push({ op: this.op3 });
        this.gameData.initGrid();
        this.initBlock();
        this.music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonMusicClick, this);
        this.replay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonReplayClick, this);
        this.rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonRankClick, this);
        this.bomb.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonBombClick, this);
        this.change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonChangeClick, this);
        this.op1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp1Click, this);
        this.op2.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp2Click, this);
        this.op3.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp3Click, this);
        // 初始化成绩
        this.addscore.visible = false;
        this.score.text = '0';
        this.highScore.text = '' + this.main.highScore;
        // 播放背景音乐	
        this.playMusic('8_mp3', 0);
        // let sound: egret.Sound = RES.getRes('8_mp3');
        // sound.play();
        this.left_bomb_times = 0;
        this.bomb_times = 0;
        this.left_change_times = 0;
        this.change_times = 0;
        this.left_relifes = 0;
        this.relifes = 0;
        this.hammerview = null;
        this.bombview = null;
        this.bomb_area = {
            find: false
        };
    };
    GameUI.prototype.initBlock = function () {
        // 对block的数据进行初始化
        this.gameData.initBlock();
        // 初始化op视图
        for (var i = 0; i < 3; i++) {
            if (this.opdata[i].blockView && this.opdata[i].blockView.parent)
                this.opdata[i].blockView.parent.removeChild(this.opdata[i].blockView);
            this.opdata[i].blockView = new BlockView(this.opdata[i].op, this.gz_width, this.fk_width, this.gameData.blocks[i]);
            this.opdata[i].op.addChild(this.opdata[i].blockView);
        }
        this.checkOver();
    };
    GameUI.prototype.onButtonOpClick = function (e, id) {
        for (var i = 0; i < 3; i++) {
            var opdata = this.opdata[i];
            if (i == id && opdata.blockView.getState() == myClear.Block_state.INIT) {
                this.curdata = null;
                this.curblockview = null;
                if (this.gameData.blocks[i].canPut == false) {
                    // let sound: egret.Sound = RES.getRes("1_mp3");
                    // sound.play(0, 1);
                    this.playMusic('1_mp3', 1);
                    break;
                }
                this.curdata = opdata;
                // let sound: egret.Sound = RES.getRes('putup_mp3');
                // sound.play(0, 1);
                this.playMusic('putup_mp3', 1);
                this.curblockview = opdata.blockView;
                opdata.op.removeChild(opdata.blockView);
                opdata.blockView.setState(myClear.Block_state.MOVING);
                this.addChild(this.curblockview);
                this.op1.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp1Click, this);
                this.op2.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp2Click, this);
                this.op3.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp3Click, this);
                this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
                this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
                this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
                this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchReleaeOutside, this);
                break;
            }
        }
    };
    GameUI.prototype.onTouchBegin = function (e) {
        if (this.curdata == null)
            return;
        this.curblockview.y = e.stageY - this.y - 350 - this.curblockview.height / 2;
        this.curblockview.x = e.stageX - this.x - this.curblockview.width / 2;
        console.log('onBlockTouchBegin:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
    };
    GameUI.prototype.onTouchMove = function (e) {
        if (this.curdata == null)
            return;
        this.curblockview.x = e.stageX - this.x - this.curblockview.width / 2;
        this.curblockview.y = e.stageY - this.y - 350 - this.curblockview.height / 2;
        //console.log('onTouchMove:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
        var pos = this.gameData.getPos(this.curblockview.x + this.gz_width / 2 - this.game.x, this.curblockview.y + this.gz_width / 2 - this.game.y);
        var canPutDown = false;
        var r = 0;
        var c = 0;
        var blockInfo = this.curblockview.getBlockInfo();
        if (pos.find) {
            r = pos.r;
            c = pos.c;
            canPutDown = this.gameData.blockCanPutPoint(r, c, blockInfo.id);
        }
        if (canPutDown) {
            // 绘制阴影
            if (this.shadow_pos == null || this.shadow_pos.r != r || this.shadow_pos.c != c) {
                this.shadowClear();
                this.shadow_pos = pos;
                var blockId = blockInfo.blockId;
                var colorId = blockInfo.colorId;
                var block = myClear.Block_conf[blockId];
                var color = myClear.Color_conf[colorId];
                var rows = block.length;
                var cols = block[0].length;
                for (var i = 0; i < rows; i++) {
                    for (var j = 0; j < cols; j++) {
                        if (block[i][j]) {
                            var fk = ResTools.createBitmapByName(color);
                            var gz_info = this.gameData.getGridInfoByPos(i + r, j + c);
                            fk.anchorOffsetX = this.fk_width / 2;
                            fk.anchorOffsetY = this.fk_width / 2;
                            fk.x = gz_info.x;
                            fk.y = gz_info.y;
                            fk.alpha = 0.5;
                            fk.width = this.fk_width;
                            fk.height = this.fk_width;
                            this.game.addChild(fk);
                            this.shadow.push(fk);
                        }
                    }
                }
            }
        }
        else {
            this.shadowClear();
        }
    };
    GameUI.prototype.shadowClear = function () {
        var _this = this;
        if (this.shadow_pos != null) {
            this.shadow.forEach(function (s) {
                _this.game.removeChild(s);
            });
            this.shadow = [];
        }
    };
    GameUI.prototype.onTouchEnd = function (e) {
        if (this.curdata == null)
            return;
        console.log('onBlockTouchEnd:', e.stageX, e.stageY);
        // 点的转换
        var pos = this.gameData.getPos(this.curblockview.x + this.gz_width / 2 - this.game.x, this.curblockview.y + this.gz_width / 2 - this.game.y);
        var canPutDown = false;
        var r = 0;
        var c = 0;
        if (pos.find) {
            r = pos.r;
            c = pos.c;
            canPutDown = this.gameData.blockCanPutPoint(r, c, this.curblockview.getBlockInfo().id);
        }
        console.log('onBlockTouchEnd 1:', pos, r, c, canPutDown);
        this.shadowClear();
        if (canPutDown) {
            // 放下block，并删除blockview
            this.gameData.blockAddToGrid(r, c, this.curblockview.getBlockInfo().id);
            this.blockAddToGrid(r, c, this.curblockview.getBlockInfo());
            this.curblockview.setState(myClear.Block_state.END);
            this.removeChild(this.curblockview);
            this.curblockview = null;
            this.checkClear();
            this.checkOver();
        }
        else {
            // block还原
            this.curdata.op.addChild(this.curblockview);
            this.curblockview.setState(myClear.Block_state.INIT);
            this.curblockview = null;
            //this.curblockview.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBlockTouchBegin1, this);
        }
        this.touchEnabled = false;
        this.op1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp1Click, this);
        this.op2.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp2Click, this);
        this.op3.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp3Click, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchReleaeOutside, this);
    };
    GameUI.prototype.onTouchCancel = function (e) {
        console.log('onTouchCancel/**/:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
        this.onTouchEnd(e);
    };
    GameUI.prototype.onTouchReleaeOutside = function (e) {
        console.log('onBlockTouchReleaeOutside:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
        this.onTouchEnd(e);
    };
    GameUI.prototype.onButtonOp1Click = function (e) {
        console.log('onButtonOp1Click');
        this.onButtonOpClick(e, 0);
    };
    GameUI.prototype.onButtonOp2Click = function (e) {
        console.log('onButtonOp2Click');
        this.onButtonOpClick(e, 1);
    };
    GameUI.prototype.onButtonOp3Click = function (e) {
        console.log('onButtonOp3Click');
        this.onButtonOpClick(e, 2);
    };
    GameUI.prototype.onButtonReplayClick = function (e) {
        console.log('onButtonReplayClick');
        var platform = window.platform;
        if (platform && platform.shareAppMessage) {
            platform.shareAppMessage();
        }
    };
    GameUI.prototype.onButtonRankClick = function (e) {
        var rank = new RankUI(this.main, this);
        rank.onButtonRankClick(e);
    };
    GameUI.prototype.onButtonMusicClick = function (e) {
        console.log('onButtonMusicClick');
    };
    GameUI.prototype.onButtonChangeClick = function (e) {
        console.log('onButtonChangeClick');
        if (this.change_times >= 3)
            return;
        if (this.change_times + this.left_change_times == 0) {
            var platform_1 = window.platform;
            if (platform_1 && platform_1.shareAppMessage) {
                platform_1.shareAppMessage();
                this.left_change_times = 3;
            }
            return;
        }
        this.initBlock();
        this.change_times++;
    };
    GameUI.prototype.blockAddToGrid = function (x, y, blockInfo) {
        // blockInfo { blockId, colorId}
        var blockId = blockInfo.blockId;
        var colorId = blockInfo.colorId;
        var block = myClear.Block_conf[blockId];
        var color = myClear.Color_conf[colorId];
        var rows = block.length;
        var cols = block[0].length;
        //console.log('addtogrid:', x, y, rows, cols);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (block[i][j]) {
                    var gz = ResTools.createBitmapByName(color);
                    var gz_info = this.gameData.getGridInfoByPos(i + x, j + y);
                    this.gameData.attachGz(i + x, j + y, gz);
                    gz.anchorOffsetX = this.fk_width / 2;
                    gz.anchorOffsetY = this.fk_width / 2;
                    gz.x = gz_info.x;
                    gz.y = gz_info.y;
                    gz.width = this.fk_width;
                    gz.height = this.fk_width;
                    this.game.addChild(gz);
                }
            }
        }
        this.score.text = '' + this.gameData.gameScore;
        // let sound: egret.Sound = RES.getRes('putdown_mp3');
        // sound.play(0, 1);
        this.playMusic('putdown_mp3', 1);
    };
    GameUI.prototype.checkClear = function () {
        // 清楚数据中的gz
        var clearData = this.gameData.doClear();
        // 从试图中清除掉gz
        if (clearData.gzs.length > 0) {
            for (var i = 0; i < clearData.gzs.length; i++) {
                //this.game.removeChild(clearData.gzs[i]);
                this.clearGz(i, clearData.gzs[i]);
            }
            this.showScore(clearData.addscore, clearData.gzs[0].x, clearData.gzs[0].y);
            var tnow = new Date().getTime();
            if (tnow - this.lastcleartime < 5000) {
                this.cleartimes++;
            }
            else {
                this.cleartimes = 2;
            }
            this.lastcleartime = tnow;
            var sound_res_name = this.cleartimes + '_mp3';
            console.log('sound', this.cleartimes, sound_res_name);
            // let sound: egret.Sound = RES.getRes(sound_res_name);
            // sound.play(0, 1);
            this.playMusic(sound_res_name, 1);
        }
        // 如果没有可用的组合，则再次生产
        if (this.gameData.haveBlockToUse() == false) {
            this.initBlock();
        }
    };
    GameUI.prototype.clearGz = function (wait_time, gz) {
        var _this = this;
        var tw = egret.Tween.get(gz);
        tw.to({ scaleX: 1.3, scaleY: 1.3 }, 100)
            .wait(100)
            .to({ scaleX: 0.5, scaleY: 0.5 }, 300)
            .call(function () {
            _this.game.removeChild(gz);
        });
    };
    GameUI.prototype.showScore = function (addscore, x, y) {
        var _this = this;
        this.addscore.textColor = 0xFFFF00;
        this.addscore.bold = true;
        this.addscore.strokeColor = 0x0000FF;
        this.addscore.x = x - this.gz_width / 2;
        this.addscore.y = y - this.gz_width / 2;
        this.addscore.scaleX = 1.0;
        this.addscore.scaleY = 1.0;
        this.addscore.visible = true;
        this.addscore.text = '+' + addscore;
        this.game.addChild(this.addscore);
        console.log('show:', this.addscore.x, this.addscore.y);
        var tw = egret.Tween.get(this.addscore);
        tw.wait(500)
            .to({ scaleX: 1.1, scaleY: 1.1 }, 100)
            .wait(100)
            .call(function () {
            _this.addscore.visible = false;
            _this.score.text = '' + _this.gameData.gameScore;
        });
    };
    GameUI.prototype.checkOver = function () {
        var overdata = this.gameData.checkOver();
        // 灰度不可用的
        for (var i = 0; i < 3; i++) {
            var block = this.gameData.blocks[i];
            if (block.isPut == false) {
                if (block.canPut) {
                    this.opdata[i].blockView.setColorFilter(false);
                }
                else {
                    this.opdata[i].blockView.setColorFilter(true);
                }
            }
        }
        if (overdata.over) {
            this.main.score = this.gameData.gameScore;
            // 结束逻辑执行
            if (this.main.highScore < this.gameData.gameScore) {
                this.main.highScore = this.gameData.gameScore;
                this.main.saveScore();
                var platform_2 = window.platform;
                if (platform_2 && platform_2.openDataContext && platform_2.openDataContext.postMessage) {
                    platform_2.openDataContext.postMessage({
                        command: 'save',
                        score: '' + this.main.highScore,
                    });
                }
            }
            this.highScore.text = '' + this.main.highScore;
            this.goOver();
        }
    };
    GameUI.prototype.goOver = function () {
        var _this = this;
        var topY = this.topGroup.y - this.topGroup.height;
        var opY = this.op.y + this.op.height;
        egret.Tween.get(this.topGroup).to({ y: topY }, 500).call(function () {
            console.log('top move ok');
        });
        egret.Tween.get(this.op).to({ y: opY }, 500).call(function () {
            console.log('op move ok');
        });
        egret.Tween.get(this.game).to({ scaleX: 0, scaleY: 0 }, 500).call(function () {
            _this.main.setPage("over");
        });
    };
    GameUI.prototype.onButtonBombClick = function (e) {
        console.log('onButtonBombClick', this.bomb_times, this.left_bomb_times);
        if (this.bomb_times > 0) {
            return;
        }
        if (this.left_bomb_times == 0) {
            var platform_3 = window.platform;
            if (platform_3 && platform_3.shareAppMessage) {
                platform_3.shareAppMessage();
                this.left_bomb_times = 1;
            }
            return;
        }
        if (this.curblockview) {
            this.onTouchEnd(e);
        }
        // 创建锤子模型
        if (this.hammerview == null) {
            this.hammerview = ResTools.createBitmapByName('game_hammer_png');
            this.hammerview.width = 2 * this.gz_width;
            this.hammerview.height = 2 * this.gz_width;
            this.addChild(this.hammerview);
        }
        // 创建阴影模型
        if (this.bombview == null) {
            this.bombview = ResTools.createBitmapByName("game_panel_1_png");
        }
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBombTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBombTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onBombTouchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onBombTouchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onBombTouchEnd, this);
    };
    GameUI.prototype.onBombTouchBegin = function (e) {
        console.log('onBombTouchBegin');
        this.hammerview.y = e.stageY - this.y - 300;
        this.hammerview.x = e.stageX - this.x - this.hammerview.width / 2;
    };
    GameUI.prototype.onBombTouchMove = function (e) {
        this.hammerview.y = e.stageY - this.y - 300;
        this.hammerview.x = e.stageX - this.x - this.hammerview.width / 2;
        var area = this.gameData.getBombArea(this.hammerview.x + this.gz_width / 2 - this.game.x, this.hammerview.y + this.gz_width / 2 - this.game.y);
        console.log('onBombTouchMove:', area);
        this.bomb_area = area;
        if (area.find) {
            this.game.addChild(this.bombview);
            this.bombview.x = area.c * this.gz_width;
            this.bombview.y = area.r * this.gz_width;
            this.bombview.width = area.w * this.gz_width;
            this.bombview.height = area.h * this.gz_width;
        }
        else {
            if (this.bombview.parent)
                this.bombview.parent.removeChild(this.bombview);
        }
    };
    GameUI.prototype.onBombTouchEnd = function (e) {
        console.log('onBombTouchEnd');
        var bomb_used = false;
        if (this.bomb_area.find) {
            var bomb_gzs = this.gameData.bomb(this.bomb_area);
            for (var i = 0; i < bomb_gzs.length; i++) {
                this.clearGz(i, bomb_gzs[i]);
                bomb_used = true;
            }
        }
        if (this.bombview.parent) {
            this.bombview.parent.removeChild(this.bombview);
            this.bombview = null;
        }
        if (this.hammerview.parent) {
            this.hammerview.parent.removeChild(this.hammerview);
            this.hammerview = null;
        }
        if (bomb_used) {
            this.bomb_times++;
            this.bomb.source = "game_nobomb_png";
        }
        this.checkOver();
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBombTouchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBombTouchMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onBombTouchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onBombTouchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onBombTouchEnd, this);
    };
    return GameUI;
}(eui.Component));
__reflect(GameUI.prototype, "GameUI", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=GameUI.js.map