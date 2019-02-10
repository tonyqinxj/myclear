class StartUI extends eui.Component implements eui.UIComponent {
	private main: Main;
	public start: eui.Button;

	private resOK: boolean;


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



	}



	private init(): void {
		this.start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonStartClick, this);
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