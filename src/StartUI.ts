class StartUI extends eui.Component implements eui.UIComponent {
	private main: Main;
	public start: eui.Button;
	public constructor(main: Main) {
		super();

		this.main = main;
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();


		this.start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonStartClick, this);

	}


	private onButtonStartClick(e: egret.TouchEvent) {
        this.startGame().catch(e => {
            console.log(e);
        })

	}

	private async startGame() {
		await this.loadResource()
		this.main.onStart();
	}

	private async loadResource() {
		try {
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