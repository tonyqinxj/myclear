class StartUI extends eui.Component implements eui.UIComponent {
	private main: Main;
	private start: eui.Button;
	private start_bg: eui.Image;

	private resOK: boolean;

	private tip: eui.Image;


	public constructor(main: Main) {
		super();

		this.main = main;
		this.resOK = false;

	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();


		this.init();

		// test font
		//RES.getResByUrl("resource/fonts/mynumber.fnt", this.onFontComplete, this, RES.ResourceItem.TYPE_FONT);


	}

	// private _bitmapText:egret.BitmapText;

	// private onFontComplete(font:egret.BitmapFont):void{
	// 	this._bitmapText = new egret.BitmapText();
	// 	this._bitmapText.font = font;
	// 	this._bitmapText.text = '123,444';
	// 	this.addChild(this._bitmapText);
	// }



	private init(): void {

		if (window["canvas"]) {
			let real_w = window["canvas"].width;
			let real_h = window["canvas"].height;

			if (real_h / real_w > 2) {
				this.tip.y += 50;
			}
		}


		egret.Tween.get(this.tip, { loop: true }).to({ x: 202 }, 300).to({ x: 222 }, 300);
		this.start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonStartClick, this);

		this.startGame().catch(e => {
			console.log(e);
		})
	}


	private onButtonStartClick(e: egret.TouchEvent) {
		this.startGame().catch(e => {
			console.log(e);
		})

	}

	private async startGame() {
		await this.loadGameResource()
		this.main.setPage("game");
	}

	private async loadGameResource() {
		try {

			if (this.resOK) return;

			this.resOK = true;

			this.removeChild(this.start_bg);
			this.removeChild(this.start);

			const loadingView = new LoadingUI();
			this.stage.addChild(loadingView);
			await RES.loadGroup("game", 0, loadingView);
			this.stage.removeChild(loadingView);
		}
		catch (e) {
			console.error(e);
		}
	}

}