// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var myClear;
(function (myClear) {
    // 定义组合形态，一个点阵，1表示有方块，0表示没有
    myClear.Block_conf = [
        // 0
        [
            [1]
        ],
        // 1
        [
            [1, 1]
        ],
        // 2
        [
            [1, 1, 1]
        ],
        // 3
        [
            [1, 1, 1, 1]
        ],
        // 4
        [
            [1, 1, 1, 1, 1]
        ],
        // 5
        [
            [1],
            [1]
        ],
        // 6
        [
            [1],
            [1],
            [1]
        ],
        // 7
        [
            [1],
            [1],
            [1],
            [1],
        ],
        // 8
        [
            [1],
            [1],
            [1],
            [1],
            [1]
        ],
        // 9
        [
            [0, 1, 1],
            [1, 1, 0]
        ],
        // 10
        [
            [1, 1],
            [1, 0]
        ],
        // 11
        [
            [1, 1],
            [1, 1],
        ],
        // 12
        [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
        // 13
        [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 1],
        ],
        // 14
        [
            [1, 0, 0],
            [1, 1, 1],
        ],
        // 15
        [
            [0, 1, 0],
            [1, 1, 1],
        ],
    ];
    // 各种颜色方块对应的game.json中的id（资源名）
    myClear.Color_conf = [
        'game_gz_fang_png', 'game_gz_hong_png', 'game_gz_hei_png', 'game_gz_mei_png'
    ];
    myClear.Block_state = {
        INIT: 1,
        MOVING: 2,
        END: 3,
    };
    // 纯数据对象
    var GameData = (function () {
        function GameData() {
        }
        GameData.prototype.init = function (gz_width, fk_width) {
            this.gz_width = gz_width;
            this.fk_width = fk_width;
        };
        // game区域方块的数据初始化，包括相对位置 x,y , 方块类型 colorId， 
        GameData.prototype.initGrid = function () {
            // 初始化分数
            this.gameScore = 0;
            // 初始化网格
            this.gameGrid = new Array();
            // 初始化一批block（每一批3个）
            this.blocks = new Array();
            var x = 0;
            var y = 0;
            for (var i = 0; i < 8; i++) {
                this.gameGrid.push([]);
                for (var j = 0; j < 8; j++) {
                    // 计算方块相对坐标
                    // x = this.gz_width * j + (this.gz_width - this.fk_width) / 2;
                    // y = this.gz_width * i + (this.gz_width - this.fk_width) / 2;
                    x = this.gz_width * j + (this.gz_width) / 2;
                    y = this.gz_width * i + (this.gz_width) / 2;
                    this.gameGrid[i].push({
                        num: 0,
                        colorId: 0,
                        x: x,
                        y: y,
                        gz: null,
                    });
                }
            }
        };
        GameData.prototype.attachGz = function (r, c, gz) {
            this.gameGrid[r][c].gz = gz;
        };
        GameData.prototype.getGridInfoByPos = function (x, y) {
            return this.gameGrid[x][y];
        };
        GameData.prototype.getPos = function (px, py) {
            // px,py 是相对于gameGroup的坐标
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    if (
                    // this.gameGrid[i][j].x <= px && px <= this.gameGrid[i][j].x + this.gz_width &&
                    // this.gameGrid[i][j].y <= py && py <= this.gameGrid[i][j].y + this.gz_width
                    this.gameGrid[i][j].x - this.gz_width / 2 <= px && px <= this.gameGrid[i][j].x + this.gz_width / 2 &&
                        this.gameGrid[i][j].y - this.gz_width / 2 <= py && py <= this.gameGrid[i][j].y + this.gz_width / 2) {
                        return {
                            r: i,
                            c: j,
                            find: true,
                        };
                    }
                }
            }
            return {
                find: false
            };
        };
        // 初始化一批block（每一批3个）
        GameData.prototype.initBlock = function () {
            if (this.blocks.length > 0) {
                this.blocks = [];
            }
            for (var i = 0; i < 3; i++) {
                var colorId = Math.floor(Math.random() * myClear.Color_conf.length);
                var blockId = Math.floor(Math.random() * myClear.Block_conf.length);
                this.blocks.push({
                    id: i,
                    colorId: colorId,
                    blockId: blockId,
                    canPut: false,
                    isPut: false
                });
            }
            for (var i = 0; i < 3; i++) {
                this.blockCanPut(i);
            }
        };
        // 检测x,y为起始点（左上角）的地方是否能够放入blockId对应的block，拖动的过程中，需要调用，拖动结束的时候需要调用
        GameData.prototype.blockCanPutPoint = function (r, c, id) {
            if (this.blocks.length < id)
                return false;
            var blockId = this.blocks[id].blockId;
            console.log('blockCanPutPoint:', r, c, blockId);
            var block = myClear.Block_conf[blockId];
            var rows = block.length;
            var cols = block[0].length;
            // 顶到边了
            if (c + cols > 8 || r + rows > 8)
                return false;
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (block[i][j] + this.gameGrid[i + r][j + c].num > 1)
                        return false;
                }
            }
            return true;
        };
        // 判断是否可以放入grid中, 每次生成新的block或者拜访block成功的时候，需要调用一次
        GameData.prototype.blockCanPut = function (id) {
            // 没找到
            if (this.blocks.length < id)
                return false;
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    if (this.blockCanPutPoint(i, j, id)) {
                        this.blocks[id].canPut = true;
                        return true;
                    }
                }
            }
            this.blocks[id].canPut = false;
            return false;
        };
        // 将block放入grid，拖动结束的时候需要调用
        GameData.prototype.blockAddToGrid = function (r, c, id) {
            // 没找到
            if (this.blocks.length < id)
                return false;
            if (!this.blockCanPutPoint(r, c, id))
                return;
            var blockId = this.blocks[id].blockId;
            var colorId = this.blocks[id].colorId;
            this.blocks[id].canPut = false;
            this.blocks[id].isPut = true;
            // 加入grid
            var block = myClear.Block_conf[blockId];
            var rows = block.length;
            var cols = block[0].length;
            var addscore = 0;
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (block[i][j]) {
                        addscore++;
                        this.gameGrid[r + i][c + j].num += block[i][j];
                        this.gameGrid[r + i][c + j].colorId = colorId;
                    }
                }
            }
            this.gameScore += addscore;
        };
        // 消除
        GameData.prototype.doClear = function () {
            var clears = 0;
            var gzs = [];
            var rows = [];
            var cols = [];
            for (var i = 0; i < 8; i++) {
                var sums = 0;
                for (var j = 0; j < 8; j++) {
                    sums += this.gameGrid[i][j].num;
                }
                if (sums >= 8) {
                    clears++;
                    rows.push(i);
                }
                ;
            }
            for (var i = 0; i < 8; i++) {
                var sums = 0;
                for (var j = 0; j < 8; j++) {
                    sums += this.gameGrid[j][i].num;
                }
                if (sums >= 8) {
                    clears++;
                    cols.push(i);
                }
            }
            for (var i = 0; i < rows.length; i++) {
                for (var j = 0; j < 8; j++) {
                    if (this.gameGrid[rows[i]][j].gz != null) {
                        gzs.push(this.gameGrid[rows[i]][j].gz);
                        this.gameGrid[rows[i]][j].gz = null;
                        this.gameGrid[rows[i]][j].num = 0;
                    }
                }
            }
            for (var i = 0; i < cols.length; i++) {
                for (var j = 0; j < 8; j++) {
                    if (this.gameGrid[j][cols[i]].gz != null) {
                        gzs.push(this.gameGrid[j][cols[i]].gz);
                        this.gameGrid[j][cols[i]].gz = null;
                        this.gameGrid[j][cols[i]].num = 0;
                    }
                }
            }
            var addscore = 0;
            if (clears > 0) {
                addscore = this.getScore(clears);
            }
            this.gameScore += addscore;
            return {
                gzs: gzs,
                addscore: addscore
            };
        };
        // 计算消除需要添加的分数
        GameData.prototype.getScore = function (clears) {
            var scores = 0;
            while (clears) {
                scores += 10 * clears;
                clears--;
            }
            return scores;
        };
        // 判断是否还有可用的组合
        GameData.prototype.haveBlockToUse = function () {
            var len = this.blocks.length;
            if (len == 0)
                return false;
            for (var i = 0; i < len; i++) {
                if (this.blocks[i].isPut == false)
                    return true;
            }
            return false;
        };
        // 判断是否结束, return {over：boolean， cantnum:number}
        GameData.prototype.checkOver = function () {
            var cantnum = 0;
            var neetPut = 0;
            for (var i = 0; i < 3; i++) {
                var block = this.blocks[i];
                if (block.isPut)
                    continue;
                neetPut++;
                if (false == this.blockCanPut(i)) {
                    cantnum++;
                }
            }
            var over = false;
            if (cantnum == neetPut) {
                over = true;
            }
            return {
                over: over,
                cantnum: cantnum
            };
        };
        return GameData;
    }());
    myClear.GameData = GameData;
    __reflect(GameData.prototype, "myClear.GameData");
})(myClear || (myClear = {}));
//# sourceMappingURL=GameData.js.map