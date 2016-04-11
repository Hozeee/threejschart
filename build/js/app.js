(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webgl = require('./webgl/webgl');

var _webgl2 = _interopRequireDefault(_webgl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var appInstance = null;

var App = function () {
	function App() {
		_classCallCheck(this, App);
	}

	_createClass(App, null, [{
		key: 'getInstance',
		value: function getInstance() {
			if (!appInstance) {
				appInstance = this;
				App.init();
			} else {
				console.log('%c [Module - App] - Already created an instance! ', 'background: #ea4118; color: #fff');
			}
		}
	}, {
		key: 'init',
		value: function init() {
			var webgl = new _webgl2.default();

			webgl.init();
		}
	}]);

	return App;
}();

exports.default = App;

},{"./webgl/webgl":8}],2:[function(require,module,exports){
'use strict';

var _app = require('./app.js');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.App = _app2.default;

},{"./app.js":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ElevationData = function () {
	function ElevationData() {
		_classCallCheck(this, ElevationData);
	}

	_createClass(ElevationData, [{
		key: 'init',
		value: function init() {
			console.log('ElevationData init');
		}
	}, {
		key: 'initElevationMaps',
		value: function initElevationMaps() {
			var _this = this;

			this.elevationData = {};

			return new Promise(function (resolve, reject) {

				_this.loadElevationMap({ imageURL: './i/azerelevation_map_small2.jpg', matrix: true }).then(function (response) {
					_this.elevationData.country = response;
					resolve();
				});
			});
		}
	}, {
		key: 'loadElevationMap',
		value: function loadElevationMap(data) {

			return new Promise(function (resolve, reject) {
				var img = new Image(),
				    elevationData = {};

				elevationData.elevationArray = [];

				img.onload = function () {
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
							index = x * 4 + y * (4 * imgW);
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
	}]);

	return ElevationData;
}();

exports.default = ElevationData;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageProcessor = function () {
	function ImageProcessor() {
		_classCallCheck(this, ImageProcessor);
	}

	_createClass(ImageProcessor, [{
		key: 'init',
		value: function init() {
			var _this = this;

			this.gradientImage = new Image();
			this.gradientImage.onload = function () {
				_this.createGradientImage();
			};

			this.gradientImage.src = '{{ASSET_PREFIX}}i/content/torchgradient.jpg';
		}
	}, {
		key: 'createGradientImage',
		value: function createGradientImage() {
			this.gradientCanvas = document.createElement('canvas');
			this.gradientCanvas.width = this.gradientImage.width;
			this.gradientCanvas.height = this.gradientImage.height;

			this.gradientCanvas.getContext('2d').drawImage(this.gradientImage, 0, 0, this.gradientImage.width, this.gradientImage.height);
		}
	}, {
		key: 'getColorForPercent',
		value: function getColorForPercent(percent) {
			var result = '#ffffff';

			if (this.gradientCanvas) {
				result = this.gradientCanvas.getContext('2d').getImageData(percent * this.gradientImage.width, 0, 1, 1).data;
			}

			return result;
		}
	}]);

	return ImageProcessor;
}();

exports.default = ImageProcessor;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _terrain = require('./terrain');

var _terrain2 = _interopRequireDefault(_terrain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map3D = function () {
	function Map3D() {
		_classCallCheck(this, Map3D);
	}

	_createClass(Map3D, [{
		key: 'init',
		value: function init(settings) {
			this.scene = settings.scene;
			this.camera = settings.camera;

			this.initWorld();

			this.terrain3D = new _terrain2.default();
			this.terrain3D.init({ scene: this.worldContainer });
		}
	}, {
		key: 'initWorld',
		value: function initWorld() {
			this.world = new THREE.Object3D();
			this.world.rotation.y = -Math.PI / 2;
			//scene.add(world);

			this.worldContainer = new THREE.Object3D();
			this.worldContainer.rotation.x = -Math.PI / 2;
			this.world.add(this.worldContainer);
		}
	}, {
		key: 'initTerrain',
		value: function initTerrain() {
			console.log('Map initTerrain');

			var geometry = new THREE.BoxGeometry(10, 10, 10);
			var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
			var cube = new THREE.Mesh(geometry, material);
			this.scene.add(cube);
		}
	}, {
		key: 'render',
		value: function render() {
			if (this.camera) {
				this.camera.updateMatrix();
				this.camera.updateMatrixWorld();
			}
		}
	}]);

	return Map3D;
}();

exports.default = Map3D;

},{"./terrain":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SkyBox = function () {
	function SkyBox() {
		_classCallCheck(this, SkyBox);
	}

	_createClass(SkyBox, [{
		key: 'init',
		value: function init(settings) {
			console.log('skybox init');
		}
	}]);

	return SkyBox;
}();

exports.default = SkyBox;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var terrain3D = function () {
	function terrain3D() {
		_classCallCheck(this, terrain3D);
	}

	_createClass(terrain3D, [{
		key: 'init',
		value: function init(settings) {
			console.log('nit terrain3D');
		}
	}]);

	return terrain3D;
}();

exports.default = terrain3D;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _imageprocessor = require('./imageprocessor');

var _imageprocessor2 = _interopRequireDefault(_imageprocessor);

var _skybox = require('./skybox');

var _skybox2 = _interopRequireDefault(_skybox);

var _elevationdata = require('./elevationdata');

var _elevationdata2 = _interopRequireDefault(_elevationdata);

var _map = require('./map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebGl = function () {
	function WebGl() {
		_classCallCheck(this, WebGl);
	}

	_createClass(WebGl, [{
		key: 'init',
		value: function init() {
			var _this = this;

			this.scene = new THREE.Scene();

			this.renderer = new THREE.WebGLRenderer({ antialias: true, clearColor: 0x000000 });
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.setClearColor(0x19081b, 1);
			document.getElementById('webgl-content').appendChild(this.renderer.domElement);

			this.initCamera();
			this.initLights();

			this.skybox = new _skybox2.default();
			this.skybox.init({ scene: this.scene });

			this.elevationData = new _elevationdata2.default();
			this.elevationData.initElevationMaps().then(function () {
				_this.init3dMap();
			});

			this.render();

			window.addEventListener('resize', this.onWindowResize.bind(this), false);
			this.inited = true;
			this.needRender = true;
		}
	}, {
		key: 'init3dMap',
		value: function init3dMap() {
			this.map3d = new _map2.default();
			this.map3d.init({ scene: this.scene, camera: this.camera });
			this.map3d.initTerrain();
		}
	}, {
		key: 'initCamera',
		value: function initCamera() {
			this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
			this.camera.position.z = 500;
			this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		}
	}, {
		key: 'initLights',
		value: function initLights() {
			var ambientLight = new THREE.AmbientLight(0x222222),
			    pointLight = void 0;

			this.scene.add(ambientLight);

			pointLight = new THREE.PointLight(0xffffff, 1, 0);
			pointLight.position.set(0, 500, 0);
			this.scene.add(pointLight);
		}
	}, {
		key: 'onWindowResize',
		value: function onWindowResize() {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		}
	}, {
		key: 'render',
		value: function render() {
			if (this.needRender) {

				if (this.map3d) {
					this.map3d.render();
				}

				this.controls.update();

				this.renderer.render(this.scene, this.camera);
			}

			requestAnimationFrame(this.render.bind(this));
		}
	}]);

	return WebGl;
}();

exports.default = WebGl;

},{"./elevationdata":3,"./imageprocessor":4,"./map":5,"./skybox":6}]},{},[2])


//# sourceMappingURL=map/app.js.map
