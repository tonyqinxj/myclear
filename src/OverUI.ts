class OverUI extends eui.Component implements eui.UIComponent {
	private main: Main;
	private overScoreGroup: eui.Group;
	private restart: eui.Button;


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



	private init(): void {
		this.restart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartClick, this);
	}

	private onStartClick(e: egret.TouchEvent): void {
		console.log('onStartClick');
		this.main.setPage('game');
	}

}