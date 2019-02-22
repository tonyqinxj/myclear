class HttpTools {
	public constructor() {
	}


	// 想一个url发送一个data数据，并获取返回结果
	// data是一个json对象，只能有一层结构
	public static httpPost(url, data): any {
		return new Promise((resolve, reject) => {

			console.log(url, data);
			var request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.open(url, egret.HttpMethod.POST);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

			if (data) {
				var params = Object.keys(data).map(function (key) {
					// body...
					return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
				}).join("&");

				request.send(params);
			} else {
				request.send();
			}

			request.addEventListener(egret.Event.COMPLETE, (event: egret.Event): void => {
				var request = <egret.HttpRequest>event.currentTarget;
				console.log("get data : ", request.response);
				resolve({
					errcode: 0,
					data: request.response
				});

			},
				this);
			request.addEventListener(egret.IOErrorEvent.IO_ERROR, (event: egret.IOErrorEvent): void => {
				console.log("get error : " + event);
				resolve({
					errcode: 1,
				});
			}, this);
			request.addEventListener(egret.ProgressEvent.PROGRESS, (event: egret.ProgressEvent): void => {
				console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
			}, this);
		});

	}
}