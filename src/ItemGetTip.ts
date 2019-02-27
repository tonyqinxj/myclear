class ItemGetTip {

	private myparent: GameUI;

	// 遮罩
	private maskShape: egret.Shape = null;
	private close: egret.Bitmap = null;
	private share: egret.Bitmap = null;
	private watch: egret.Bitmap = null;
	private type: string; // 'share:   watch: ....'
	private pl: egret.Sprite;

	public constructor(myparent: GameUI, type: string) {

		console.log('ItemGetTip create...');
		this.myparent = myparent;
		this.type = type;

		//处理遮罩，避免开放数据域事件影响主域。
		this.maskShape = new egret.Shape();
		this.maskShape.graphics.beginFill(0x000000, 1);
		this.maskShape.graphics.drawRect(0, 0, this.myparent.width, this.myparent.height);
		this.maskShape.graphics.endFill();
		this.maskShape.alpha = 0.5;
		this.maskShape.touchEnabled = true;
		this.myparent.addChild(this.maskShape);

		this.pl = new egret.Sprite();
		this.pl.x = 74;
		this.pl.y = 268;
		this.pl.width = 600;
		this.pl.height = 589;
		// this.pl.graphics.beginFill(0x000000, 1);
		// this.pl.graphics.drawRect(0,0, 600, 589);
		// this.pl.graphics.endFill();
		this.myparent.addChild(this.pl);

		let bg = ResTools.createBitmapByName('over_panel_png');
		bg.scale9Grid = new egret.Rectangle(20,20,20,20);
		bg.x = 0;
		bg.y = 0;
		bg.width = this.pl.width;
		bg.height = this.pl.height;
		this.pl.addChild(bg);

		// 绘制关闭按钮：
		let close = ResTools.createBitmapByName('close_png');
		close.x = 636;
		close.y = 208;
		close.width = 35;
		close.height = 36;
		close.touchEnabled = true;
		this.myparent.addChild(close);
		this.close = close;
		close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClose, this);

		let share = ResTools.createBitmapByName('item_share_png');
		share.x = 43;
		share.y = 478;
		share.width = 240;
		share.height = 68;
		share.touchEnabled = true;
		this.pl.addChild(share);
		this.share = share;
		share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonShare, this);



		let watch = ResTools.createBitmapByName('item_watch_png');
		watch.x = 319;
		watch.y = 478;
		watch.width = 240;
		watch.height = 68;
		watch.touchEnabled = true;
		this.pl.addChild(watch);
		watch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonWatch, this);
		this.watch = watch;

		// bg
		if (type == 'change') {
			let label1 = new eui.Label();
			label1.size = 36;
			label1.text = '恭喜你获得3次“换一换”机会';
			label1.textColor = 0x500092;
			label1.x = 33;
			label1.y = 25;
			this.pl.addChild(label1);


			let item = ResTools.createBitmapByName('item_change_png');
			item.x = 175;
			item.y = 176;
			item.width = 248;
			item.height = 253;
			item.touchEnabled = true;
			this.pl.addChild(item);
		} else {
			let label1 = new eui.Label();
			label1.size = 36;
			label1.text = '恭喜你获得“炸弹”\n拖至目标区域可以炸掉3*3的方块';
			label1.textColor = 0x500092;
			label1.x = 28;
			label1.y = 49;
			label1.width = 544;
			label1.height = 92;
			label1.textAlign = "center";
			this.pl.addChild(label1);


			let item = ResTools.createBitmapByName('item_bomb_png');
			item.x = 175;
			item.y = 176;
			item.width = 248;
			item.height = 253;
			item.touchEnabled = true;
			this.pl.addChild(item);
		}

	}

	protected onButtonClose(e: egret.TouchEvent): void {
		console.log('onButtonClose in ItemGetTip');
		this.maskShape.parent && this.maskShape.parent.removeChild(this.maskShape);
		this.pl.parent && this.pl.parent.removeChild(this.pl);
		this.close.parent && this.close.parent.removeChild(this.close);
		this.share.parent && this.share.parent.removeChild(this.share);
		this.watch.parent && this.watch.parent.removeChild(this.watch);

		this.maskShape = null;
		this.pl = null;
	}

	protected onButtonShare(e: egret.TouchEvent): void {
		this.onButtonClose(e);
		this.myparent.onShare(this.type);
	}

	protected onButtonWatch(e: egret.TouchEvent): void {
		this.onButtonClose(e);
		this.myparent.onShare(this.type);
	}

}