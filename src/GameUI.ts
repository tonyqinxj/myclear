class GameUI extends eui.Component implements eui.UIComponent {
	private main: Main;

	private music: eui.Button;
	private replay: eui.Button;
	private rank: eui.Button;
	private bomb: eui.Button;
	private change: eui.Button;
	private op1: eui.Group;
	private op2: eui.Group;
	private op3: eui.Group;
	private addscore: eui.Label;
	private score: eui.Label;
	private highScore: eui.Label;

	private game: eui.Group;


	private gz_width: number;
	private fk_width: number;

	private gameData: myClear.GameData;
	private opdata: any;
	private curdata: any;
	private curblockview: BlockView;	// 当前正在操作的组合格子

	private shadow: Array<any>; // 移动过程中的阴影 [gz]
	private shadow_pos: any; // {r,c}

	private resOverOK: boolean;


	public constructor(main: Main) {
		super();
		this.main = main;
		this.opdata = [];
		this.shadow = [];
		this.shadow_pos = null;
		this.curdata = null;
		this.curblockview = null;

		this.resOverOK = false;

		this.gameData = new myClear.GameData();


	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();



		this.init();


	}



	private init(): void {

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
		this.bomb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonBombClick, this);
		this.change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonChangeClick, this);

		this.op1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp1Click, this);
		this.op2.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp2Click, this);
		this.op3.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonOp3Click, this);


		this.addscore.visible = false;
		this.score.text = '0';
		this.highScore.text = '' + this.main.highScore;
	}
	private initBlock(): void {
		// 对block的数据进行初始化
		this.gameData.initBlock();


		// 初始化op视图
		for (let i = 0; i < 3; i++) {
			this.opdata[i].blockView = new BlockView(this.opdata[i].op, this.gz_width, this.fk_width, this.gameData.blocks[i]);
			this.opdata[i].op.addChild(this.opdata[i].blockView);
			// this.opdata[i].op.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonOpClick, this);
			// this.opdata[i].op.touchEnable = true;
			// this.opdata[i].blockView.touchEnable = false;
		}

		this.checkOver();

	}




	protected onButtonOpClick(e: egret.TouchEvent, id: number): void {
		for (let i = 0; i < 3; i++) {
			let opdata = this.opdata[i];

			if (i == id && opdata.blockView.getState() == myClear.Block_state.INIT) {
				this.curdata = opdata;
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
		this.curblockview.x = e.stageX - this.x;
		this.curblockview.y = e.stageY - this.y - 300;
		console.log('onBlockTouchBegin:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);
	}

	private onTouchMove(e: egret.TouchEvent): void {
		this.curblockview.x = e.stageX - this.x;
		this.curblockview.y = e.stageY - this.y - 300;

		console.log('onTouchMove:', this.curblockview.x, this.curblockview.y, e.stageX, e.stageY);

		let pos = this.gameData.getPos(this.curblockview.x + this.fk_width / 2 - this.game.x, this.curblockview.y + this.fk_width / 2 - this.game.y);

		let canPutDown = false;
		let r = 0;
		let c = 0;

		let blockInfo = this.curblockview.getBlockInfo();

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
		}
	}

	private onTouchEnd(e: egret.TouchEvent): void {
		console.log('onBlockTouchEnd:', e.stageX, e.stageY);

		// 点的转换
		let pos = this.gameData.getPos(this.curblockview.x + this.fk_width / 2 - this.game.x, this.curblockview.y + this.fk_width / 2 - this.game.y);
		let canPutDown = false;
		let r = 0;
		let c = 0;

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

		} else {
			// block还原
			this.curdata.op.addChild(this.curblockview);
			this.curblockview.setState(myClear.Block_state.INIT);
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
	}


	protected onButtonRankClick(e: egret.TouchEvent): void {
		console.log('onButtonRankClick');
	}

	protected onButtonMusicClick(e: egret.TouchEvent): void {
		console.log('onButtonMusicClick');
	}


	protected onButtonBombClick(e: egret.TouchEvent): void {
		console.log('onButtonBombClick');
	}


	protected onButtonChangeClick(e: egret.TouchEvent): void {
		console.log('onButtonChangeClick');
	}



	private blockAddToGrid(x: number, y: number, blockInfo: any): void {
		// blockInfo { blockId, colorId}

		let blockId = blockInfo.blockId;
		let colorId = blockInfo.colorId;

		let block = myClear.Block_conf[blockId];
		let color = myClear.Color_conf[colorId];

		let rows = block.length;
		let cols = block[0].length;

		console.log('addtogrid:', x, y, rows, cols);

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

		}

		// 如果没有可用的组合，则再次生产
		if (this.gameData.haveBlockToUse() == false) {
			this.initBlock();
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

	private checkOver() {

		let overdata = this.gameData.checkOver();
		if (overdata.num > 0) {
			// 灰度不可用的
		}

		if (overdata.over) {
			// 结束逻辑执行
			if (this.main.highScore < this.gameData.gameScore) {
				this.main.highScore = this.gameData.gameScore;
			}
			this.highScore.text = '' + this.main.highScore;
			this.goOver().catch(e => {
				console.log(e);
			})
		}
	}


	private async goOver() {
		await this.loadOverResource()
		this.main.setPage("over");
		// const result = await RES.getResAsync("description_json")
		// this.startAnimation(result);
		// await platform.login();
		// const userInfo = await platform.getUserInfo();
		// console.log(userInfo);

	}

	private async loadOverResource() {
		try {
			if (this.resOverOK) return;

			this.resOverOK = true;

			const loadingView = new LoadingUI();
			this.stage.addChild(loadingView);
			await RES.loadGroup("over", 0, loadingView);
			this.stage.removeChild(loadingView);
		}
		catch (e) {
			console.error(e);
		}
	}
}