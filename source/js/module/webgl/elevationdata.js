class ElevationData {
	init() {
		console.log('ElevationData init');
	}

	initElevationMaps() {
		this.elevationData = {};

		return new Promise((resolve, reject) => {

			this.loadElevationMap({imageURL: './i/azerelevation_map_small2.jpg', matrix: true})
				.then((response) => {
					this.elevationData.country = response;
					resolve();
				});
		});


	}

	loadElevationMap(data) {

		return new Promise((resolve, reject) => {
			var img = new Image(),
				elevationData = {};

			elevationData.elevationArray = [];

			img.onload = function() {
				var imgCanvas = document.createElement('canvas'),
					ctx = imgCanvas.getContext('2d'),
					imgW = this.width,
					imgH = this.height,
					pixels,
					index = 0,
					r,
					g,
					b,
					a,
					sum;

				imgCanvas.width = imgW;
				imgCanvas.height = imgH;

				elevationData.imgW = imgW;
				elevationData.imgH = imgH;

				ctx.drawImage(this, 0, 0);
				pixels = ctx.getImageData(0, 0, imgW, imgH).data;

				for (var x = 0; x < imgW; x++) {

					if (data.matrix) {
						elevationData.elevationArray[x] = [];
					}

					for (var y = 0; y < imgH; y++) {
						r = pixels[index];
						g = pixels[index + 1];
						b = pixels[index + 2];
						a = pixels[index + 3];
						index = (x * 4) + y * (4 * imgW);
						sum = r + g + b;

						if (data.matrix) {
							if (sum > 43) {
								elevationData.elevationArray[x].push({
									x: x - imgW / 2,
									y: y - imgH / 2,
									scale: sum,
									active: true
								});
							} else {
								elevationData.elevationArray[x].push({
									x: x - imgW / 2,
									y: y - imgH / 2,
									scale: sum,
									active: false
								});
							}
						} else {
							if (sum > 43) {
								elevationData.elevationArray.push({
									x: x - imgW / 2,
									y: y - imgH / 2,
									scale: sum,
									active: true
								});
							} else {
								elevationData.elevationArray.push({
									x: x - imgW / 2,
									y: y - imgH / 2,
									scale: 0,
									active: false
								});
							}

						}

					}

				}

				resolve(elevationData);

			};

			img.src = data.imageURL;
		});

	}

}

export default ElevationData;