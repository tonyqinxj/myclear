class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {

    public constructor() {
        super();
        this.createView();
    }

    //private textField: egret.TextField;

    private bg: egret.Bitmap;
    private front: egret.Bitmap;

    private createView(): void {
        this.bg = ResTools.createBitmapByName("progress_bg_png");
        this.front = ResTools.createBitmapByName("progress_front_png");

        this.bg.x = 54;
        this.bg.y = 1013;
        this.bg.width = 642;
        this.bg.height = 45;
        this.addChild(this.bg);

        this.front.x = 54;
        this.front.y= 1013;
        this.front.height = 45;
        this.front.width = 0;
        this.addChild(this.front);


        // this.textField = new egret.TextField();
        // this.addChild(this.textField);
        // this.textField.x = 54;
        // this.textField.y = 1031;
        // this.textField.width = 642;
        // this.textField.height = 45;

    }

    public onProgress(current: number, total: number): void {
        //this.textField.text = `Loading...${current}/${total}`;
        this.front.width = 642*current/total;
    }
}
