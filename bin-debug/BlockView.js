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
var BlockView = (function (_super) {
    __extends(BlockView, _super);
    function BlockView(op, gz_width, fk_width, blockInfo) {
        var _this = _super.call(this) || this;
        _this.op = op;
        _this.gz_width = gz_width;
        _this.fk_width = fk_width;
        _this.blockInfo = blockInfo;
        _this.block_scale = 0.35;
        _this.state = null;
        _this.fklist = [];
        return _this;
        //this.op.addChild(this);
    }
    BlockView.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.init(this.blockInfo);
    };
    BlockView.prototype.init = function (blockinfo) {
        // 缩放
        var color = myClear.Color_conf[blockinfo.colorId];
        var blockdata = myClear.Block_conf[blockinfo.blockId];
        var rows = blockdata.length;
        var cols = blockdata[0].length;
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                if (blockdata[r][c]) {
                    var x = c * this.gz_width + (this.gz_width - this.fk_width) / 2; // 相对位置
                    var y = r * this.gz_width + (this.gz_width - this.fk_width) / 2;
                    var fk = ResTools.createBitmapByName(color);
                    fk.x = x;
                    fk.y = y;
                    fk.width = this.fk_width;
                    fk.height = this.fk_width;
                    this.addChild(fk);
                    this.fklist.push(fk);
                }
            }
        }
        // 计算blockview的size
        // this.x = 0;
        // this.y = 0;
        this.width = cols * this.gz_width;
        this.height = rows * this.gz_width;
        this.setState(myClear.Block_state.INIT);
    };
    BlockView.prototype.setState = function (state) {
        this.state = state;
        switch (state) {
            case myClear.Block_state.INIT:
                this.scaleX = this.block_scale;
                this.scaleY = this.block_scale;
                this.x = (this.op.width - this.width * this.scaleX) / 2;
                this.y = (this.op.height - this.height * this.scaleY) / 2;
                console.log('b:', this.op.x, this.op.y, this.op.width, this.op.height, this.width, this.height, this.x, this.y, this.width * this.scaleX, this.height * this.scaleY);
                break;
            case myClear.Block_state.MOVING:
                this.scaleX = 1.0;
                this.scaleY = 1.0;
                break;
            case myClear.Block_state.END:
                this.removeChildren();
                break;
        }
    };
    BlockView.prototype.setColorFilter = function (isGray) {
        if (isGray) {
            var colorMatrix = [
                0.3, 0, 0, 0, 100,
                0.3, 0, 0, 0, 0,
                0.3, 0, 0, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            for (var i = 0; i < this.fklist.length; i++) {
                this.fklist[i].filters = [colorFlilter];
            }
        }
        else {
            for (var i = 0; i < this.fklist.length; i++) {
                this.fklist[i].filters = [];
            }
        }
    };
    BlockView.prototype.getState = function () {
        return this.state;
    };
    BlockView.prototype.getBlockInfo = function () {
        return this.blockInfo;
    };
    return BlockView;
}(eui.Group));
__reflect(BlockView.prototype, "BlockView");
//# sourceMappingURL=BlockView.js.map