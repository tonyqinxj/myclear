class GameUI extends eui.Component implements eui.UIComponent {
	private main: Main;

	// 以下对应exml中的控件
	private music: eui.Button;
	private replay: eui.Button;
	private rank: eui.Button;
	private bomb: eui.Image;

	private change: eui.Button;
	private op1: eui.Group;
	private op2: eui.Group;
	private op3: eui.Group;
	private addscore: eui.Label;
	private score: eui.Label;
	private highScore: eui.Label;

	private game: eui.Group;
	private gameGroup: eui.Group;
	private topGroup: eui.Group;
	private op: eui.Group;
	private ad: eui.Group;

	private changeNum: eui.Label;

	// 以下是游戏逻辑数据	
	private gz_width: number;	// 格子的大小
	private fk_width: number;	// 方块的大小

	private gameData: myClear.GameData;	// 游戏数据
	private opdata: any;	// 操作面板

	private curdata: any;	// 当前操作的数据存储
	private curblockview: BlockView;	// 当前正在操作的组合格子

	private hammerview: egret.Bitmap; // 锤子
	private bombview: egret.Bitmap; // 用于bomb的区域大小

	private shadow: Array<any>; // 移动过程中的阴影 [gz]
	private shadow_pos: any; // {r,c}

	private lastcleartime: number; // 上次消除时间
	private cleartimes: number; // 连击次数



	// 换block
	private left_change_times: number; // 剩余可换次数
	private change_times: number; // 当前换过的次数，最多不超过3次

	// 锤子
	private left_bomb_times: number; // 剩余bomb
	private bomb_times: number;// 已经用过的bomb数
	private bomb_area: any; // 需要锤掉的区域

	// 复活
	private left_relifes: number; // 剩余的复活次数
	private relifes: number; // 复活过的次数

	// 音效
	private sounds = [];

	//	道具获取辅助类
	private itemGetTip: ItemGetTip = null;

	// 是否做新手引导
	private isNewPlayer: boolean = true;
	private new_cur_pos: any = null;//{ r: 3, c: 3 };
	private new_mask_shape: egret.Sprite = null;
	private new_tip_shape: egret.Shape = null;

	public constructor(main: Main) {
		super();
		this.main = main;
		this.opdata = [];
		this.shadow = [];
		this.shadow_pos = null;
		this.curdata = null;
		this.curblockview = null;

		this.gameData = new myClear.GameData();

		this.main.highScore = 0;
		if (this.main.highScore) this.isNewPlayer = false;
	}

	protected playMusic(name: string, times: number): void {

		//		ResTools.playMusic(name, times);
		console.log('play:', name, times);
		let res_name = 'resource/sounds/' + name.match(/(.+)_mp3/)[1] + '.mp3';

		let platform: Platform = window.platform;
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
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);

		console.log('gameui pardadded...');

	}

	protected childrenCreated(): void {
		super.childrenCreated();
		console.log('gameui childrenCreated...');
		this.init();
	}

	private init(): void {
		this.lastcleartime = 0;
		this.cleartimes = 0;

		this.gz_width = this.game.width / 8;
		this.fk_width = this.gz_width - 2;

		this.gameData.init(this.gz_width, this.fk_width);

		this.opdata.push({ op: this.op1 });
		this.opdata.push({ op: this.op2 });
		this.opdata.push({ op: this.op3 });

		this.gameData.initGrid();

		if (window["canvas"]) {
			let real_w = window["canvas"].width;
			let real_h = window["canvas"].height;

			if (real_h / real_w > 2) {
				this.topGroup.y += 50;
				this.gameGroup.y += 50;
				this.op.y += 50;
				this.ad.y += 50;
			}
		}


		let oldtopy = this.topGroup.y;
		let oldgamey = this.gameGroup.y;
		let oldopy = this.op.y;

		this.topGroup.y -= 1624;
		this.gameGroup.y -= 1624;
		this.op.y -= 1624;

		console.log('pos:', oldtopy, oldgamey, oldopy);
		console.log('pos 2:', this.topGroup.y, this.gameGroup.y, this.op.y);

		egret.Tween.get(this.topGroup).to({ y: oldtopy }, 400).to({ y: oldtopy - 50 }, 50).to({ y: oldtopy }, 100);
		egret.Tween.get(this.gameGroup).to({ y: oldgamey }, 400).to({ y: oldgamey - 50 }, 50).to({ y: oldgamey }, 100);
		egret.Tween.get(this.op).to({ y: oldopy }, 400).to({ y: oldopy - 50 }, 50).to({ y: oldopy }, 100)
			.call(() => {

				console.log('pos 3:', this.topGroup.y, this.gameGroup.y, this.op.y);

				if (this.isNewPlayer) {
					this.initGridNew();
					this.initBlockNew();
					this.op2.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp2Click, this);
				} else {
					this.initBlock();

					this.music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonMusicClick, this);
					this.replay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonReplayClick, this);
					this.rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonRankClick, this);
					this.bomb.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonBombClick, this);
					this.change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonChangeClick, this);

					this.op1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp1Click, this);
					this.op2.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp2Click, this);
					this.op3.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp3Click, this);
				}

			});



		// 初始化成绩
		this.addscore.visible = false;
		this.score.text = '0';
		this.highScore.text = '' + this.main.highScore;

		// 播放背景音乐	
		this.playMusic('8_mp3', 0);

		this.playMusic('bgstart_mp3', 1);
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
	}

	private newPlayFinish(): any {
		this.delHoll();

		this.new_mask_shape && this.new_mask_shape.parent && this.new_mask_shape.parent.removeChild(this.new_mask_shape);
		this.new_tip_shape && this.new_tip_shape.parent && this.new_tip_shape.parent.removeChild(this.new_tip_shape);
		this.click_bitmap && this.click_bitmap.parent && this.click_bitmap.parent.removeChild(this.click_bitmap);

		this.new_tip_shape = null;
		this.new_cur_pos = null;
		this.isNewPlayer = false;
		this.click_bitmap = null;

		this.music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonMusicClick, this);
		this.replay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonReplayClick, this);
		this.rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonRankClick, this);
		this.bomb.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonBombClick, this);
		this.change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonChangeClick, this);

		this.op1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp1Click, this);
		this.op2.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp2Click, this);
		this.op3.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp3Click, this);
	}

	private initGridNew(): any {

		// 初始化格子
		let data = this.gameData.initGridNew();

		// 预先摆好一些
		data.has.forEach(value => {
			let color = myClear.Color_conf[value.colorId];
			let gz = ResTools.createBitmapByName(color);
			let gz_info = this.gameData.getGridInfoByPos(value.r, value.c);

			this.gameData.attachGz(value.r, value.c, gz);
			gz.anchorOffsetX = this.fk_width / 2;
			gz.anchorOffsetY = this.fk_width / 2;
			gz.x = gz_info.x;
			gz.y = gz_info.y;

			gz.width = this.fk_width;
			gz.height = this.fk_width;

			this.game.addChild(gz);
		})

		// 初始化block可以拖放的位置
		this.new_cur_pos = { r: 3, c: 3 };

		this.addHoll();

	}


	private initBlockNew(): any {
		// 画出block可以拖放的区域
		this.new_tip_shape && this.new_tip_shape.parent && this.new_tip_shape.parent.removeChild(this.new_tip_shape);
		this.new_tip_shape = new egret.Shape();
		this.new_tip_shape.graphics.lineStyle(3, 0xFFFFFF);
		this.new_tip_shape.graphics.drawRect(this.new_cur_pos.c * this.gz_width + 3, this.new_cur_pos.r * this.gz_width + 3, this.gz_width - 6, this.gz_width * 2 - 6);
		this.new_tip_shape.graphics.endFill();
		this.game.addChild(this.new_tip_shape);

		egret.Tween.get(this.new_tip_shape, { loop: true })
			.to({ alpha: 1 }, 200).wait(300)
			.to({ alpha: 0.5 }, 200);

		this.addClickTip();


		// 初始化op区
		this.gameData.initBlockNew();
		this.opdata[1].blockView = new BlockView(this.opdata[1].op, this.gz_width, this.fk_width, {
			id: 1,
			colorId: 0,
			blockId: 5,
			canPut: true,
			isPut: false
		});

		this.opdata[1].op.addChild(this.opdata[1].blockView);
	}

	private initBlock(): any {
		// 对block的数据进行初始化
		this.gameData.initBlock();

		// 初始化op视图
		for (let i = 0; i < 3; i++) {
			if (this.opdata[i].blockView && this.opdata[i].blockView.parent) this.opdata[i].blockView.parent.removeChild(this.opdata[i].blockView);
			this.opdata[i].blockView = new BlockView(this.opdata[i].op, this.gz_width, this.fk_width, this.gameData.blocks[i]);
			this.opdata[i].op.addChild(this.opdata[i].blockView);
		}

		return this.checkOver();

	}


	protected onButtonOpClick(e: egret.TouchEvent, id: number): void {
		for (let i = 0; i < 3; i++) {
			let opdata = this.opdata[i];

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
	}

	private onTouchBegin(e: egret.TouchEvent): void {
		if (this.curdata == null) return;

		this.curblockview.x = e.stageX - this.x - this.curblockview.width / 2;
		this.curblockview.y = e.stageY - this.y - 150 - this.curblockview.height;
		console.log('onBlockTouchBegin:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);

		if (this.isNewPlayer) {
			this.delClickTip();
		}

	}

	private onTouchMove(e: egret.TouchEvent): void {

		if (this.curdata == null) return;

		this.curblockview.x = e.stageX - this.x - this.curblockview.width / 2;
		this.curblockview.y = e.stageY - this.y - 150 - this.curblockview.height;

		//console.log('onTouchMove:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);

		let pos = this.gameData.getPos(
			this.curblockview.x + this.gz_width / 2 - this.gameGroup.x + this.gameGroup.width / 2 - this.game.x,
			this.curblockview.y + this.gz_width / 2 - this.gameGroup.y + this.gameGroup.height / 2 - this.game.y
		);


		console.log('move pos:', pos);

		let canPutDown = false;
		let r = 0;
		let c = 0;

		let blockInfo = this.curblockview.getBlockInfo();

		if (pos.find) {
			r = pos.r;
			c = pos.c;
			canPutDown = this.gameData.blockCanPutPoint(r, c, blockInfo.id);
		}

		// 新手引导阶段
		if (this.isNewPlayer) {
			if (canPutDown) {
				if (r != this.new_cur_pos.r || c != this.new_cur_pos.c) {
					canPutDown = false;
				}
			}
		}

		if (canPutDown) {
			// 绘制阴影
			if (this.shadow_pos == null || this.shadow_pos.r != r || this.shadow_pos.c != c) {
				this.shadowClear();
				this.shadow_pos = pos;

				let blockId = blockInfo.blockId;
				let colorId = blockInfo.colorId;

				let block = myClear.Block_conf[blockId];
				let color = myClear.Color_conf[colorId];

				let rows = block.length;
				let cols = block[0].length;


				for (let i = 0; i < rows; i++) {
					for (let j = 0; j < cols; j++) {

						if (block[i][j]) {
							let fk = ResTools.createBitmapByName(color);
							let gz_info = this.gameData.getGridInfoByPos(i + r, j + c);

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
		} else {
			this.shadowClear();
		}
	}

	private shadowClear(): void {
		if (this.shadow_pos != null) {
			this.shadow.forEach(s => {
				this.game.removeChild(s);
			})
			this.shadow = [];
			this.shadow_pos = null;
		}
	}

	private onTouchEnd(e: egret.TouchEvent): void {
		if (this.curdata == null) return;
		console.log('onBlockTouchEnd:', e.stageX, e.stageY);


		// 点的转换
		let pos = this.gameData.getPos(
			this.curblockview.x + this.gz_width / 2 - this.gameGroup.x + this.gameGroup.width / 2 - this.game.x,
			this.curblockview.y + this.gz_width / 2 - this.gameGroup.y + this.gameGroup.height / 2 - this.game.y);
		let canPutDown = false;
		let r = 0;
		let c = 0;

		if (pos.find) {
			r = pos.r;
			c = pos.c;
			canPutDown = this.gameData.blockCanPutPoint(r, c, this.curblockview.getBlockInfo().id);
		}

		// 新手引导相关
		if (this.isNewPlayer) {
			if (canPutDown) {
				if (r != this.new_cur_pos.r || c != this.new_cur_pos.c) {
					canPutDown = false;
				}
			}
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

		} else {
			// block还原
			this.curdata.op.addChild(this.curblockview);
			this.curblockview.setState(myClear.Block_state.INIT);

			this.curblockview = null;
			//this.curblockview.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBlockTouchBegin1, this);

			if (this.isNewPlayer) {
				this.addClickTip();
			}
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


	}

	private onTouchCancel(e: egret.TouchEvent): void {
		console.log('onTouchCancel/**/:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
		this.onTouchEnd(e);
	}

	private onTouchReleaeOutside(e: egret.TouchEvent): void {
		console.log('onBlockTouchReleaeOutside:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
		this.onTouchEnd(e);
	}

	protected onButtonOp1Click(e: egret.TouchEvent): void {
		console.log('onButtonOp1Click');

		this.onButtonOpClick(e, 0);
	}

	protected onButtonOp2Click(e: egret.TouchEvent): void {
		console.log('onButtonOp2Click');
		this.onButtonOpClick(e, 1);
	}

	protected onButtonOp3Click(e: egret.TouchEvent): void {
		console.log('onButtonOp3Click');
		this.onButtonOpClick(e, 2);
	}
	protected onButtonReplayClick(e: egret.TouchEvent): void {
		console.log('onButtonReplayClick');
		// let platform: any = window.platform;
		// if (platform && platform.shareAppMessage) {
		// 	platform.shareAppMessage();
		// }


		this.main.setPage("game");
	}

	protected onButtonRankClick(e: egret.TouchEvent): void {
		let rank = new RankUI(this.main, this);
		rank.onButtonRankClick(e);
	}

	protected onButtonMusicClick(e: egret.TouchEvent): void {
		console.log('onButtonMusicClick');
	}

	protected onButtonChangeClick(e: egret.TouchEvent): void {
		console.log('onButtonChangeClick');
		if (this.change_times >= 3) return;

		if (this.change_times + this.left_change_times == 0) {
			let platform: any = window.platform;
			if (platform && platform.shareAppMessage) {
				platform.shareAppMessage();
				this.left_change_times = 3;

				this.changeNum.text = '3/3';
			}

			return;
		}

		this.initBlock();
		this.change_times++;
		this.left_change_times--;

		this.changeNum.text = this.left_change_times + '/3';
	}

	private blockAddToGrid(x: number, y: number, blockInfo: any): void {
		// blockInfo { blockId, colorId}

		let blockId = blockInfo.blockId;
		let colorId = blockInfo.colorId;

		let block = myClear.Block_conf[blockId];
		let color = myClear.Color_conf[colorId];

		let rows = block.length;
		let cols = block[0].length;

		//console.log('addtogrid:', x, y, rows, cols);

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {

				if (block[i][j]) {
					let gz = ResTools.createBitmapByName(color);
					let gz_info = this.gameData.getGridInfoByPos(i + x, j + y);


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
	}

	private checkClear() {
		// 清楚数据中的gz
		let clearData = this.gameData.doClear();

		// 从试图中清除掉gz
		if (clearData.gzs.length > 0) {
			for (let i = 0; i < clearData.gzs.length; i++) {
				//this.game.removeChild(clearData.gzs[i]);
				this.clearGz(i, clearData.gzs[i]);
			}

			this.showScore(clearData.addscore, clearData.gzs[0].x, clearData.gzs[0].y);


			let tnow = new Date().getTime();
			if (tnow - this.lastcleartime < 5000) {
				this.cleartimes++;
			} else {
				this.cleartimes = 2;
			}

			this.lastcleartime = tnow;
			let sound_res_name = this.cleartimes + '_mp3';
			console.log('sound', this.cleartimes, sound_res_name);
			// let sound: egret.Sound = RES.getRes(sound_res_name);
			// sound.play(0, 1);

			this.playMusic(sound_res_name, 1);
		}

		// 如果没有可用的组合，则再次生产
		if (this.gameData.haveBlockToUse() == false) {
			if (this.isNewPlayer && this.new_cur_pos.c == 3) {
				this.new_cur_pos.c = 4;
				this.initBlockNew();
			} else {
				this.newPlayFinish();
				this.initBlock();
			}


		}
	}

	private clearGz(wait_time: number, gz: egret.Bitmap): void {

		let tw = egret.Tween.get(gz);
		tw.to({ scaleX: 1.3, scaleY: 1.3 }, 100)
			.wait(100)
			.to({ scaleX: 0.5, scaleY: 0.5 }, 300)
			.call(() => {
				this.game.removeChild(gz);
			})
	}

	private showScore(addscore: number, x: number, y: number): void {

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
		let tw = egret.Tween.get(this.addscore);
		tw.wait(500)
			.to({ scaleX: 1.1, scaleY: 1.1 }, 100)
			.wait(100)

			.call(() => {
				this.addscore.visible = false;
				this.score.text = '' + this.gameData.gameScore;
			})

	}

	private checkOver(): any {

		let overdata = this.gameData.checkOver();



		// 灰度不可用的
		for (let i = 0; i < 3; i++) {
			let block = this.gameData.blocks[i];
			if (block.isPut == false) {
				if (block.canPut) {
					this.opdata[i].blockView.setColorFilter(false);
				} else {
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
			}

			const platform: any = window.platform;
			if (platform && platform.openDataContext && platform.openDataContext.postMessage) {
				platform.openDataContext.postMessage({
					command: 'save',
					score: '' + this.main.highScore,
				});
			}

			this.highScore.text = '' + this.main.highScore;
			this.goOver();
		} else {
			if (this.itemGetTip == null && this.bomb_times == 0 && this.left_bomb_times == 0 && overdata.cantnum > 0) {
				this.itemGetTip = new ItemGetTip(this, 'bomb');
			}
		}



		return overdata;
	}


	private goOver() {

		let topY = this.topGroup.y - this.topGroup.height;

		let opY = this.op.y + this.op.height;


		this.playMusic('10_mp3', 1);

		egret.Tween.get(this.topGroup).to({ y: topY }, 300).call(() => {
			console.log('top move ok');
		});


		egret.Tween.get(this.op).to({ y: opY }, 300).call(() => {
			console.log('op move ok');
		});


		egret.Tween.get(this.gameGroup).to({ scaleX: 0, scaleY: 0 }, 300).call(() => {
			this.main.setPage("over");
		})

	}

	protected onButtonBombClick(e: egret.TouchEvent): void {
		if (this.is_bombing) return;

		console.log('onButtonBombClick', this.bomb_times, this.left_bomb_times);
		if (this.bomb_times > 0) {
			return;
		}

		if (this.left_bomb_times == 0) {
			let platform: any = window.platform;
			if (platform && platform.shareAppMessage) {
				platform.shareAppMessage();

				this.left_bomb_times = 1;
				this.bomb.source = "game_bomb_png";
			}

			return;
		}

		if (this.curblockview) {
			this.onTouchEnd(e);
		}

		this.playMusic('putup_mp3', 1);

		// 创建锤子模型
		if (this.hammerview == null) {
			this.hammerview = ResTools.createBitmapByName('game_hammer_png');
			this.hammerview.width = 2 * this.gz_width;
			this.hammerview.height = 2 * this.gz_width;
			this.hammerview.anchorOffsetX = this.hammerview.width;
			this.hammerview.anchorOffsetY = this.hammerview.height;
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
	}


	private onBombTouchBegin(e: egret.TouchEvent): void {
		console.log('onBombTouchBegin');
		if (this.is_bombing) return;
		this.hammerview.y = e.stageY - 300 + this.hammerview.height;
		this.hammerview.x = e.stageX + this.hammerview.width / 2;
	}

	private onBombTouchMove(e: egret.TouchEvent): void {
		if (this.is_bombing) return;

		this.hammerview.y = e.stageY - 300 + this.hammerview.height;
		this.hammerview.x = e.stageX + this.hammerview.width / 2;

		let area = this.gameData.getBombArea(
			this.hammerview.x - this.hammerview.width + this.gz_width / 2 - this.gameGroup.x + this.gameGroup.width / 2 - this.game.x,
			this.hammerview.y - this.hammerview.height + this.gz_width / 2 - this.gameGroup.y + this.gameGroup.height / 2 - this.game.y);
		console.log('onBombTouchMove:', area);
		this.bomb_area = area;
		if (area.find) {
			this.game.addChild(this.bombview);
			this.bombview.x = area.c * this.gz_width;
			this.bombview.y = area.r * this.gz_width;
			this.bombview.width = area.w * this.gz_width;
			this.bombview.height = area.h * this.gz_width;
		} else {
			if (this.bombview.parent) this.bombview.parent.removeChild(this.bombview);
		}

	}

	private is_bombing = false;
	private onBombTouchEnd(e: egret.TouchEvent): void {
		console.log('onBombTouchEnd');
		if (this.is_bombing) return;
		this.is_bombing = true;

		this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBombTouchBegin, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onBombTouchMove, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onBombTouchEnd, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onBombTouchEnd, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onBombTouchEnd, this);

		let bomb_gzs = [];
		if (this.bomb_area.find) {
			// 可以锤了
			bomb_gzs = this.gameData.bomb(this.bomb_area);
		}

		if (bomb_gzs.length > 0) {

			egret.Tween.get(this.hammerview)
				.to({ rotation: 30 }, 200)
				.to({ rotation: -40 }, 200)
				.call(() => {
					this.playMusic('1_mp3', 1);
					for (let i = 0; i < bomb_gzs.length; i++) {
						this.clearGz(i, bomb_gzs[i]);
					}

					if (this.bombview.parent) {
						this.bombview.parent.removeChild(this.bombview);
						this.bombview = null;
					}

					if (this.hammerview.parent) {
						this.hammerview.parent.removeChild(this.hammerview);
						this.hammerview = null;
					}

					this.bomb_times++;
					this.bomb.source = "game_nobomb_png";
					this.checkOver();

					this.is_bombing = false;
				});
		}
		else {
			if (this.bombview.parent) {
				this.bombview.parent.removeChild(this.bombview);
				this.bombview = null;
			}

			if (this.hammerview.parent) {
				this.hammerview.parent.removeChild(this.hammerview);
				this.hammerview = null;
			}

			this.is_bombing = false;
		}
	}


	public onShare(type: string): void {
		// if (type == "change") {
		// 	this.onButtonChangeClick(null);
		// } else if (type == "bomb") {
		// 	this.onButtonBombClick(null);
		// }

		console.log('onShare', this.bomb_times, this.left_bomb_times);
		if (this.bomb_times > 0 || this.left_bomb_times > 0) {
			return;
		}


		var timer: egret.Timer = new egret.Timer(100, 1);

		//注册事件侦听器
		timer.addEventListener(egret.TimerEvent.TIMER, () => {
			console.log("计时");
		}, this);
		timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
			console.log("计时结束");

			let platform: any = window.platform;
			if (platform && platform.shareAppMessage) {
				platform.shareAppMessage();

				this.left_bomb_times = 1;
				this.bomb.source = "game_bomb_png";

				this.itemGetTip = null;
			}

		}, this);
		//开始计时
		timer.start();
	}

	// public onWatch(type: string): void {
	// 	if (type == "change") {
	// 		this.onButtonChangeClick(null);
	// 	} else if (type == "bomb") {
	// 		this.onButtonBombClick(null);
	// 	}
	// }


	// //////////////////////////////////////////////////////
	// 挖洞
	private holl_bitmap: egret.Bitmap = null;
	private click_bitmap: egret.Bitmap = null;
	private addHoll() {
		// 挖洞
		let container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

		//创建一个背景
		let bg: egret.Sprite = new egret.Sprite();
		bg.graphics.beginFill(0x000000, 1);
		bg.graphics.drawRect(0, 0, this.width, this.height);
		bg.graphics.endFill();
		bg.alpha = 0.5;


		//洞的大小图片
		let holl: egret.Sprite = new egret.Sprite();
		holl.graphics.beginFill(0x000000, 1);
		holl.graphics.drawRect(this.gameGroup.x - 4 * this.gz_width - 3, this.gameGroup.y - this.gz_width - 3, 8 * this.gz_width + 6, 2 * this.gz_width + 6);
		holl.graphics.endFill();
		holl.blendMode = egret.BlendMode.ERASE;


		let holl_2: egret.Sprite = new egret.Sprite();
		holl_2.graphics.beginFill(0x000000, 1);
		holl_2.graphics.drawCircle(this.op.x + this.op.width / 2, this.op.y + this.op.height / 2, this.opdata[1].op.width / 2);
		holl_2.graphics.endFill();
		holl_2.blendMode = egret.BlendMode.ERASE;

		container.addChild(bg);
		container.addChild(holl);
		container.addChild(holl_2);


		let renderTexture: egret.RenderTexture = new egret.RenderTexture();
		renderTexture.drawToTexture(container);

		let bitmap: egret.Bitmap = new egret.Bitmap(renderTexture);
		this.addChild(bitmap);
		this.holl_bitmap = bitmap;


	}

	private delHoll() {
		this.holl_bitmap && this.holl_bitmap.parent && this.holl_bitmap.parent.removeChild(this.holl_bitmap);
		// 停止手势动画

	}

	private addClickTip() {
		this.click_bitmap = ResTools.createBitmapByName('click_tip_png');
		this.click_bitmap.x = this.op.x + this.op.width / 2;
		this.click_bitmap.y = this.op.y + this.op.height / 2;
		this.addChild(this.click_bitmap);

		let x0 = this.new_cur_pos.c == 3 ? this.gameGroup.x - this.gz_width : this.gameGroup.x;
		let y0 = this.gameGroup.y;
		let x1 = this.click_bitmap.x;
		let y1 = this.click_bitmap.y;

		console.log('addClickTip:', x0, y0, x1, y1);
		egret.Tween.get(this.click_bitmap, { loop: true })
			.to({ x: x0, y: y0 }, 1000)
			.to({ x: x1, y: y1, scaleX: 1.8, scaleY: 1.8 }, 500)
			.to({ scaleX: 1, scaleY: 1 }, 50);
	}

	private delClickTip() {
		this.click_bitmap && this.click_bitmap.parent && this.click_bitmap.parent.removeChild(this.click_bitmap);
		this.click_bitmap = null;
	}
}