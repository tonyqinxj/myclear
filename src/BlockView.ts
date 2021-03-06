class BlockView extends eui.Group {
	private op: eui.Group; // upper group

	private gz_width: number;
	private fk_width: number;

	private blockInfo: any;

	private block_scale: number;

	private state: number;

	private fklist: Array<egret.Bitmap>;

	public constructor(op: eui.Group, gz_width: number, fk_width: number, blockInfo: any) {
		super();
		this.op = op;
		this.gz_width = gz_width;
		this.fk_width = fk_width;

		this.blockInfo = blockInfo;
		this.block_scale = 0.3;
		this.state = null;
		this.fklist = [];
		//this.op.addChild(this);
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		this.init(this.blockInfo);
	}

	private init(blockinfo: any): void {

		// 缩放

		let color = myClear.Color_conf[blockinfo.colorId];
		let blockdata = myClear.Block_conf[blockinfo.blockId];

		let rows = blockdata.length;
		let cols = blockdata[0].length;

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				if (blockdata[r][c]) {
					let x = c * this.gz_width + (this.gz_width - this.fk_width) / 2; // 相对位置
					let y = r * this.gz_width + (this.gz_width - this.fk_width) / 2;

					let fk = ResTools.createBitmapByName(color);
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
	}

	public setState(state: number): void {
		this.state = state;
		switch (state) {
			case myClear.Block_state.INIT:
				this.scaleX = this.block_scale;
				this.scaleY = this.block_scale;

				this.x = (this.op.width - this.width * this.scaleX) / 2;
				this.y = (this.op.height - this.height * this.scaleY) / 2;
				console.log('b:', this.op.x, this.op.y, this.op.width, this.op.height, this.width, this.height, this.x, this.y,
					this.width * this.scaleX,
					this.height * this.scaleY
				);
				break;
			case myClear.Block_state.MOVING:
				this.scaleX = 1.0;
				this.scaleY = 1.0;
				break;
			case myClear.Block_state.END:
				this.removeChildren();
				break;
		}
	}

	public setColorFilter(isGray: boolean): void {
		if (isGray) {
			var colorMatrix = [
				0.3, 0, 0, 0, 100,
				0.3, 0, 0, 0, 0,
				0.3, 0, 0, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);

			for (let i = 0; i < this.fklist.length; i++) {
				this.fklist[i].filters = [colorFlilter];
			}

		} else {
			for (let i = 0; i < this.fklist.length; i++) {
				this.fklist[i].filters = [];
			}
		}

	}

	public getState(): number {
		return this.state;
	}

	public getBlockInfo(): any {
		return this.blockInfo;
	}
}