
class ImageProcessor {

	init() {
		this.gradientImage = new Image();
		this.gradientImage.onload = () => {
			this.createGradientImage();
		};

		this.gradientImage.src = '{{ASSET_PREFIX}}i/content/torchgradient.jpg';
	}

	createGradientImage() {
		this.gradientCanvas = document.createElement('canvas');
		this.gradientCanvas.width = this.gradientImage.width;
		this.gradientCanvas.height = this.gradientImage.height;

		this.gradientCanvas.getContext('2d').drawImage(this.gradientImage, 0, 0, this.gradientImage.width, this.gradientImage.height);
	}

	getColorForPercent(percent) {
		let result = '#ffffff';

		if (this.gradientCanvas) {
			result = this.gradientCanvas.getContext('2d').getImageData(percent * this.gradientImage.width, 0, 1, 1).data;
		}

		return result;
	}

}

export default ImageProcessor;