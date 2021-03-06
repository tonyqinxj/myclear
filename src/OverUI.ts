class OverUI extends eui.Component implements eui.UIComponent {
	private main: Main;

	private score: eui.Label;
	private highscore: eui.Label;

	private replay: eui.Button;
	private share: eui.Button;
	private rank: eui.Button;

	private tip: eui.Image;
	private miniApp: eui.Image;

	private rankPl: eui.Group;

	public constructor(main: Main) {
		super();
		this.main = main;
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.init();
	}


	private rank_bitmap: egret.Bitmap;

	private init(): void {

		if (window["canvas"]) {

			let real_w = window["canvas"].width;
			let real_h = window["canvas"].height;

			if (real_h / real_w > 2) {
				this.tip.y += 50;
			}
		}

		this.score.text = '' + this.main.score;
		this.highscore.text = '历史最高分：' + this.main.highScore;

		egret.Tween.get(this.tip, { loop: true })
			.to({ x: 202 }, 300)
			.to({ x: 222 }, 300);

		let platform: any = window.platform;
		if (platform && platform.openDataContext && platform.openDataContext.postMessage) {

			let h = this.height;
			if (window["canvas"]) {

				let r_w = window["canvas"].width;
				let r_h = window["canvas"].height;

				h = Math.floor(r_h * this.width / r_w);
			}
			this.rank_bitmap = platform.openDataContext.createDisplayObject(null, this.width, h);
			this.addChild(this.rank_bitmap);

			platform.openDataContext.postMessage({
				command: "myscore",
				isDisplay: true,
				openid: this.main.openid,
				highscore: this.main.highScore,
			});

		}


		var timer: egret.Timer = new egret.Timer(1000, 1);
		timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, (event: egret.TimerEvent) => {
			egret.Tween.get(this.miniApp, { loop: true })
				.wait(3000).to({ rotation: 45 }, 150).to({ rotation: -45 }, 150).to({ rotation: 45 }, 150);
		}, this);
		timer.start();

		this.replay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartClick, this);
		this.rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRankClick, this);
		this.share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShareClick, this);
		this.miniApp.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonMiniAppClick, this);

	}

	protected onButtonMiniAppClick(e: egret.TouchEvent): void {
		console.log('onButtonMiniAppClick');
		this.goApp().catch(e => {
			console.log(e);
		});
	}

	private async goApp() {
		let platform: Platform = window.platform;
		let ret = await platform.navigateToMiniProgram('wx845c44523d1d7ef4', '');
		console.log(ret);
	}

	private onStartClick(e: egret.TouchEvent): void {
		console.log('onStartClick');
		this.main.setPage('game');
	}

	private onShareClick(e: egret.TouchEvent): void {
		console.log('onShareClick');
		let platform: Platform = window.platform;
		platform.shareAppMessage('@我，来跟我挑战一下，我不信你能赢！', 'resource/assets/share_2.png');

	}

	private onRankClick(e: egret.TouchEvent): void {
		console.log('onRankClick');
		let rank = new RankUI(this.main, this);
		rank.onButtonRankClick(e);

	}

	public beforeExit() {
		let platform: any = window.platform;
		if (platform && platform.openDataContext && platform.openDataContext.postMessage) {

			platform.openDataContext.postMessage({
				command: "myscore",
				isDisplay: false,
			});

		}
	}

}