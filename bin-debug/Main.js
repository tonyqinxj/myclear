var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Main.prototype.saveScore = function () {
        var key = "bestscore";
        var value = "" + this.highScore;
        egret.localStorage.setItem(key, value);
    };
    Main.prototype.getScore = function () {
        var key = "bestscore";
        var scorestr = egret.localStorage.getItem(key);
        if (scorestr)
            return parseInt(scorestr);
        return 0;
    };
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.curPage = null;
        this.score = 0;
        this.highScore = this.getScore();
        this.openid = '';
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.goStart().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.goStart = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loginInfo, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.setPage("start");
                        return [4 /*yield*/, platform.login()];
                    case 2:
                        loginInfo = _a.sent();
                        console.log('loginInfo:', loginInfo, loginInfo.code);
                        return [4 /*yield*/, HttpTools.httpPost("https://www.nskqs.com/getOpenId", { code: loginInfo.code })];
                    case 3:
                        res = _a.sent();
                        console.log('res:', res);
                        if (res.errcode == 0) {
                            data = JSON.parse(res.data);
                            this.openid = data.openid;
                            egret.localStorage.setItem('myuserinfo', data);
                            console.log('data:', data);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        //const loadingView = new LoadingUI();
                        //this.stage.addChild(loadingView);
                        //await RES.loadConfig("default.res.json", "https://prizedraw.myxianxiaobao.com/resource");
                        return [4 /*yield*/, RES.loadConfig("default.res.json", "/resource")];
                    case 1:
                        //const loadingView = new LoadingUI();
                        //this.stage.addChild(loadingView);
                        //await RES.loadConfig("default.res.json", "https://prizedraw.myxianxiaobao.com/resource");
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("start")];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    //private textfield: egret.TextField;
    Main.prototype.clearCurScene = function () {
        if (this.curPage)
            this.removeChild(this.curPage);
    };
    Main.prototype.setPage = function (page) {
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
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map