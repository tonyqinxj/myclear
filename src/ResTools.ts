// TypeScript file
class ResTools {
	/**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
	public static createBitmapByName(name: string): egret.Bitmap {
		var result: egret.Bitmap = new egret.Bitmap();
		var texture: egret.Texture = RES.getRes(name);
		result.texture = texture;
		return result;
	}

    /**
     * 根据name关键字创建一个Bitmap对象。此name 是根据TexturePacker 组合成的一张位图
     */
	public static createBitmapFromSheet(name: string, sheetName: string = "gameRes"): egret.Bitmap {
		var sheet: egret.SpriteSheet = RES.getRes(sheetName);
		var texture: egret.Texture = sheet.getTexture(name);
		var result: egret.Bitmap = new egret.Bitmap();
		result.texture = texture;
		return result;
	}

    /**
     * 根据name关键字创建一个Texture对象。此name 是根据TexturePacker 组合成的一张位图
     */

	public static getTextureFromSheet(name: string, sheetName: string = "gameRes"): egret.Texture {
		var sheet: egret.SpriteSheet = RES.getRes(sheetName);
		var result: egret.Texture = sheet.getTexture(name);
		return result;
	}

	public static music_off:boolean = false;
	public static playMusic(name:string, times:number):void {
		if (ResTools.music_off) return;
		
		console.log('play:', name, times);
		let res_name = 'resource/sounds/' + name.match(/(.+)_mp3/)[1] + '.mp3';

		let platform: Platform = window.platform;
		platform.playMusic(res_name, times);
	}
}