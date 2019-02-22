class Main extends eui.UILayer {
    private curPage: eui.Component;

    public highScore: number;
    public score: number;
    public openid: string;

    public saveScore() {
        var key: string = "bestscore";
        var value: string = ""+this.highScore;
        egret.localStorage.setItem(key, value);
    }

    private getScore() :number{
        var key: string = "bestscore";
        let scorestr = egret.localStorage.getItem(key);
        if(scorestr) return parseInt(scorestr);

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
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
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
        console.log('loginInfo:', loginInfo, loginInfo.code);
        
        const res = await HttpTools.httpPost("https://www.nskqs.com/getOpenId", {code:loginInfo.code});
        console.log('res:', res);

        if(res.errcode == 0){
            let data = JSON.parse(res.data);
            this.openid = data.openid;
            egret.localStorage.setItem('myuserinfo', data);
            console.log('data:', data);
        }
        // const userInfo = await platform.getUserInfo();
        // console.log(userInfo);

    }

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
        if (this.curPage) this.removeChild(this.curPage);
    }


    public setPage(page: string) {

        // if(page == "over"){
        //     let oldPage = this.curPage;
        //     this.curPage = new OverUI(this);
            
        //     egret.Tween.get(oldPage).to({x:750}, 1000)
        //     .call(()=>{
        //         this.removeChild(oldPage);
        //         this.addChild(this.curPage);
        //     })

        //     return;
        // }

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
