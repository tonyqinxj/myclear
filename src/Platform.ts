/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {
    
    getUserInfo(): Promise<any>;

    login(): Promise<any>;

    setDefaultShare():Promise<any>; 

    

    pauseLoopMusic():void;
    resumeLoopMusic():void;
    playMusic(name:string, times:number):void;
    navigateToMiniProgram(appid:string, param:string):Promise<any>;
    shareAppMessage(title:string, url:string):void;
}

class DebugPlatform implements Platform {
    
    
    async getUserInfo() {
        return { nickName: "username" }
    }

    async login() {

    }

    async setDefaultShare() {

    }

    shareAppMessage(title:string, url:string){
        
    }

    playMusic(name:string, times:number):void{

    } 

    pauseLoopMusic():void{

    }

    resumeLoopMusic():void{

    }

    async navigateToMiniProgram(appid:string, param:string){

    }
}


if (!window.platform) {
    window.platform = new DebugPlatform();
}



declare let platform: Platform;

declare interface Window {

    platform: Platform
}





