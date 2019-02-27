class ReLifeUI extends eui.Component implements eui.UIComponent {
	private main: Main = null;
	private game: GameUI = null;

	private tip: eui.Image;

	private pgImage: eui.Image;
	private scoreLable: eui.Label;
	private timeLable: eui.Label;

	private relifeImage: eui.Image;
	private passLable: eui.Label;


	private shape: egret.Shape = null;

	public constructor(main: Main, game: GameUI) {
		super();
		this.main = main;
		this.game = game;
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();

		this.scoreLable.text = '' + this.game.getScore().score;

		// 创建mask
		var shape: egret.Shape = this.shape = new egret.Shape();
		shape.graphics.beginFill(0x00ffff, 1);
		shape.graphics.drawCircle(this.pgImage.x, this.pgImage.y, this.pgImage.width / 2);
		shape.graphics.endFill();
		this.addChild(shape);
		this.pgImage.mask = shape;

		// tip动画
		egret.Tween.get(this.tip, { loop: true }).to({ x: 202 }, 300).to({ x: 222 }, 300);


		this.relifeImage.touchEnabled = true;
		this.passLable.touchEnabled = true;

		this.relifeImage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonRelifeClick, this);
		this.passLable.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonPassClick, this);

		this.createTimer();
	}

	private curtime: number = 10;
	private timer: egret.Timer = null;
	protected createTimer(): void {
		// 倒计时更新
		this.timeLable.text = '' + this.curtime;

		this.timer = new egret.Timer(1000, 10);
		this.timer.addEventListener(egret.TimerEvent.TIMER, (event: egret.TimerEvent) => {
			ResTools.playMusic('0_mp3',1);
			this.curtime--;

			// 倒计时更新
			this.timeLable.text = '' + this.curtime;

			// 绘制mask
			var shape: egret.Shape = this.shape;

			shape.graphics.clear();
			shape.graphics.beginFill(0x00ffff, 1);
			shape.graphics.moveTo(this.pgImage.x, this.pgImage.y);
			shape.graphics.lineTo(this.pgImage.x, this.pgImage.y - this.pgImage.width / 2);

			//我们从上开始绘制，则弧度为-90 * Math.PI / 180
			shape.graphics.drawArc(this.pgImage.x, this.pgImage.y, this.pgImage.width / 2, -90 * Math.PI / 180, (36 * this.curtime -90) * Math.PI / 180, false);
			shape.graphics.lineTo(this.pgImage.x, this.pgImage.y);
			shape.graphics.endFill();

		}, this);
		this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, (event: egret.TimerEvent) => {
			this.game.removeChild(this);
			this.main.setPage('over');
		}, this);

		this.timer.start();
	}


	protected onButtonRelifeClick(e: egret.TouchEvent): void {
		console.log('onButtonRelifeClick');
		this.timer.stop();
		this.game.removeChild(this);
		this.game.onRelife();

		let platform: Platform = window.platform;
		platform.shareAppMessage('@我，来跟我挑战一下，我不信你能赢！', 'resource/assets/share_2.png');
	}

	protected onButtonPassClick(e: egret.TouchEvent): void {
		console.log('onButtonPassClick');
		this.timer.stop();
		this.game.removeChild(this);
		this.main.setPage('over');
	}
}