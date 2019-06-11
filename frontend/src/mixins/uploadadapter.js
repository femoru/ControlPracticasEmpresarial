
/**
 * Upload adapter for Base64.
 */
export default class UploadAdapter {

	constructor(loader, t) {
		this.loader = loader;
		this.t = t;
	}

	upload() {
		return new Promise(async (resolve, reject) => {
			const reader = this.reader = new window.FileReader();
			reader.onload = function () {
				var img = document.createElement("img");
				img.src = reader.result;

				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);

				var MAX_WIDTH = 200;
				var MAX_HEIGHT = 200;
				var width = img.width;
				var height = img.height;

				if (width > height) {
					if (width > MAX_WIDTH) {
						height *= MAX_WIDTH / width;
						width = MAX_WIDTH;
					}
				} else {
					if (height > MAX_HEIGHT) {
						width *= MAX_HEIGHT / height;
						height = MAX_HEIGHT;
					}
				}
				canvas.width = width;
				canvas.height = height;
				ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, width, height);

				let dataurl = canvas.toDataURL();
				console.log(dataurl)
				resolve({ default: dataurl });
			};

			reader.onerror = function (error) {
				reject(error);
			};

			reader.onabort = function () {
				reject();
			};
			reader.readAsDataURL(await this.loader.file);
		});
	}

	abort() {
		if (this.reader) {
			this.reader.abort();
		}
	}
}
