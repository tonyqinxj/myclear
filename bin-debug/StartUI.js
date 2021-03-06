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
var StartUI = (function (_super) {
    __extends(StartUI, _super);
    function StartUI(main) {
        var _this = _super.call(this) || this;
        _this.main = main;
        _this.resOK = false;
        return _this;
    }
    StartUI.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    StartUI.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.init();
        // test font
        //RES.getResByUrl("resource/fonts/mynumber.fnt", this.onFontComplete, this, RES.ResourceItem.TYPE_FONT);
    };
    // private _bitmapText:egret.BitmapText;
    // private onFontComplete(font:egret.BitmapFont):void{
    // 	this._bitmapText = new egret.BitmapText();
    // 	this._bitmapText.font = font;
    // 	this._bitmapText.text = '123,444';
    // 	this.addChild(this._bitmapText);
    // }
    StartUI.prototype.init = function () {
        if (window["canvas"]) {
            var real_w = window["canvas"].width;
            var real_h = window["canvas"].height;
            if (real_h / real_w > 2) {
                this.tip.y += 50;
            }
        }
        egret.Tween.get(this.tip, { loop: true }).to({ x: 202 }, 300).to({ x: 222 }, 300);
        this.start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonStartClick, this);
    };
    StartUI.prototype.onButtonStartClick = function (e) {
        this.startGame().catch(function (e) {
            console.log(e);
        });
    };
    StartUI.prototype.startGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadGameResource()];
                    case 1:
                        _a.sent();
                        this.main.setPage("game");
                        return [2 /*return*/];
                }
            });
        });
    };
    StartUI.prototype.loadGameResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (this.resOK)
                            return [2 /*return*/];
                        this.resOK = true;
                        this.removeChild(this.start_bg);
                        this.removeChild(this.start);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadGroup("game", 0, loadingView)];
                    case 1:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return StartUI;
}(eui.Component));
__reflect(StartUI.prototype, "StartUI", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=StartUI.js.map