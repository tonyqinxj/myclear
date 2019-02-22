class OverUI extends eui.Component implements eui.UIComponent {
	private main: Main;

	private score: eui.Label;
	private highscore: eui.Label;

	private replay: eui.Button;
	private share: eui.Button;
	private rank: eui.Button;

	private tip: eui.Image;

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
		this.score.text = '' + this.main.score;
		this.highscore.text = '历史最高分：' + this.main.highScore;

		egret.Tween.get(this.tip, { loop: true })
			.to({ x: 202 }, 300)
			.to({ x: 222 }, 300);

		let platform: any = window.platform;
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
	}

	private onStartClick(e: egret.TouchEvent): void {
		console.log('onStartClick');
		this.main.setPage('game');
	}

	private onShareClick(e: egret.TouchEvent): void {
		console.log('onShareClick');

	}

	private onRankClick(e: egret.TouchEvent): void {
		console.log('onRankClick');
		let rank = new RankUI(this.main, this);
		rank.onButtonRankClick(e);

	}

}