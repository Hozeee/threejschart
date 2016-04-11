import WebGL from './webgl/webgl';

let appInstance = null;

class App {
	static getInstance() {
		if (!appInstance) {
			appInstance = this;
			App.init();
		} else {
			console.log('%c [Module - App] - Already created an instance! ', 'background: #ea4118; color: #fff');
		}
	}

	static init() {
		let webgl = new WebGL();

		webgl.init();
	}
}

export default App;
