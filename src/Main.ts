class Main extends eui.UILayer {
    private curPage: any;

    public highScore: number;
    public score: number;
    public openid: string;

    public game:GameUI = null;
    public saveScore() {
        var key: string = "bestscore";
        var value: string = "" + this.highScore;
        egret.localStorage.setItem(key, value);
    }

    private getScore(): number {
        var key: string = "bestscore";
        let scorestr = egret.localStorage.getItem(key);
        if (scorestr) return parseInt(scorestr);

        return 0;
    }

    protected createChildren(): void {
        super.createChildren();

        this.curPage = null;
        this.score = 0;
        this.highScore = this.getScore();
        this.openid = '';


        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            window.addEventListener("focus", context.resume, false);
            window.addEventListener("blur", context.pause, false);
        })

        egret.lifecycle.onPause = () => {
            console.log('onPause');
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            console.log('onResume');
            egret.ticker.resume();
            if(this.game){
                this.game.resume();
                this.game = null;
            }
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.goStart().catch(e => {
            console.log(e);
        })
    }

    private async goStart() {

        await this.loadResource()
        this.setPage("start");
        // const result = await RES.getResAsync("description_json")
        // this.startAnimation(result);
        const loginInfo = await platform.login();


        console.log('loginInfo:', loginInfo);

        const res = await HttpTools.httpPost("https://www.nskqs.com/getOpenId", { code: loginInfo.code, name: 'myclear', test: 'test_', num: 333 });
        console.log('res:', res);

        if (res.errcode == 0) {
            let data = JSON.parse(res.data);
            this.openid = data.openid;
            egret.localStorage.setItem('myuserinfo', data);
            console.log('data:', data);
        }
        // const userInfo = await platform.getUserInfo();
        // console.log(userInfo);

        // const ret = await platform.setDefaultShare();
        // console.log('ret:', ret);

    }
    d
    private async loadResource() {
        try {
            //const loadingView = new LoadingUI();
            //this.stage.addChild(loadingView);
            //await RES.loadConfig("default.res.json", "https://prizedraw.myxianxiaobao.com/resource");
            await RES.loadConfig("default.res.json", "/resource");
            await this.loadTheme();
            await RES.loadGroup("start");
            //await RES.loadGroup("start", 0, loadingView);
            //this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    //private textfield: egret.TextField;

    private clearCurScene() {
        if (this.curPage) {
            if (this.curPage.beforeExit != undefined) this.curPage.beforeExit();
            this.removeChild(this.curPage);
        }
    }


    public setPage(page: string) {


        this.clearCurScene();
        switch (page) {
            case "start":
                this.curPage = new StartUI(this);
                break;

            case "game":
                this.curPage = new GameUI(this);
                break;

            case "over":
                this.curPage = new OverUI(this);
                break;

            default:
                return;
        }

        this.addChild(this.curPage);
    }

}
