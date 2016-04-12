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

},{"./webgl/webgl":7}],2:[function(require,module,exports){
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

	_createClass(ElevationData, null, [{
		key: 'initElevationMaps',
		value: function initElevationMaps() {
			var _this = this;

			//let imageURL = './i/azerelevation_map_small2.jpg';
			var imageURL = './i/worldmap.jpg';
			//let imageURL = './i/sam.jpg';

			this.elevationData = {};

			return new Promise(function (resolve, reject) {

				ElevationData.loadElevationMap({ imageURL: imageURL, matrix: true }).then(function (response) {
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
	}, {
		key: 'getElevationMap',
		value: function getElevationMap() {
			return this.elevationData;
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
			this.scene.add(this.world);

			this.worldContainer = new THREE.Object3D();
			this.worldContainer.rotation.x = -Math.PI / 2;
			this.world.add(this.worldContainer);
		}
	}, {
		key: 'initTerrain',
		value: function initTerrain() {
			console.log('Map initTerrain');

			if (this.terrain3D) {
				this.terrain3D.createMapTerrain();
			}
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

},{"./terrain":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _elevationdata = require('./elevationdata');

var _elevationdata2 = _interopRequireDefault(_elevationdata);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var terrain3D = function () {
	function terrain3D() {
		_classCallCheck(this, terrain3D);
	}

	_createClass(terrain3D, [{
		key: 'init',
		value: function init(settings) {
			this.scene = settings.scene;
		}
	}, {
		key: 'createMapTerrain',
		value: function createMapTerrain() {
			var imgW = void 0,
			    imgH = void 0,
			    res = 4,
			    size = 8,
			    scale = 7,
			    resW = void 0,
			    resH = void 0,
			    wLength = void 0,
			    hLength = void 0,
			    geometry = void 0,
			    allVertices = void 0,
			    material = void 0;

			this.terrainData = _elevationdata2.default.getElevationMap().country.elevationArray;

			imgW = _elevationdata2.default.getElevationMap().country.imgW;
			imgH = _elevationdata2.default.getElevationMap().country.imgH;
			resW = Math.floor(imgW / res);
			resH = Math.floor(imgH / res);
			wLength = this.terrainData.length;
			hLength = this.terrainData[0].length;

			geometry = new THREE.PlaneGeometry(imgW * size, imgH * size, resW, resH);

			allVertices = geometry.vertices.length;

			material = new THREE.MeshPhongMaterial({
				color: 0xFEBE7E,
				shininess: 5,
				side: THREE.DoubleSide,
				shading: THREE.FlatShading,
				opacity: 1
			});

			for (var i = 0; i < allVertices; i++) {
				var x = geometry.vertices[i].x + imgW * size / 2;
				var y = geometry.vertices[i].y + imgH * size / 2;

				x = x / (imgW * size / wLength);
				y = y / (imgH * size / hLength);

				if (this.terrainData[x] && this.terrainData[x][hLength - y]) {
					geometry.vertices[i].z = this.terrainData[x][hLength - y].scale / scale;
				}
			}

			this.mapTerrainMesh = new THREE.Mesh(geometry, material);
			this.mapTerrainMesh.position.z = -30;
			this.mapTerrainMesh.rotation.z = Math.PI / 2;

			this.scene.add(this.mapTerrainMesh);

			this.initTerrainParticles();
		}
	}, {
		key: 'initTerrainParticles',
		value: function initTerrainParticles() {
			var lineMaterial = new THREE.LineBasicMaterial({
				color: 0xaf3ecf,
				linewidth: 1.5,
				opacity: 0.2,
				transparent: true,
				fog: true
			}),
			    geometry = new THREE.Geometry(),
			    lineGeom = new THREE.Geometry(),
			    step = 8,
			    vertex = void 0,
			    vertex2 = void 0,
			    vertex3 = void 0,
			    scale = 7,
			    item = void 0,
			    vertices = [];

			for (var i = 0; i < this.terrainData.length; i += 1) {
				for (var j = 0; j < this.terrainData[i].length; j += 2) {

					if (this.terrainData[i][j].active) {
						vertex = new THREE.Vector3();

						vertex.x = this.terrainData[i][j].y * step;
						vertex.y = this.terrainData[i][j].x * step;
						vertex.z = this.terrainData[i][j].scale / scale;

						if (this.terrainData[i + 1]) {
							item = this.terrainData[i + 1][j];

							if (item) {
								vertex2 = new THREE.Vector3();

								vertex2.x = item.y * step;
								vertex2.y = item.x * step;
								vertex2.z = item.scale / scale;

								lineGeom.vertices.push(vertex);
								lineGeom.vertices.push(vertex2);
							}
						}

						item = this.terrainData[i][j + 1];

						/*if (item) {
      	vertex3 = new THREE.Vector3();
      		vertex3.x = item.y * step;
      	vertex3.y = item.x * step;
      	vertex3.z = item.scale / scale;
      		lineGeom.vertices.push(vertex);
      	lineGeom.vertices.push(vertex3);
      }*/

						geometry.vertices.push(vertex);
						vertices.push(vertex);
					}
				}
			}

			this.mapLineMesh = new THREE.Line(lineGeom, lineMaterial, THREE.LinePieces);
			this.scene.add(this.mapLineMesh);
		}
	}, {
		key: 'updateMaterials',
		value: function updateMaterials() {
			if (this.mapTerrainMesh && this.mapTerrainMesh.material) {
				this.mapTerrainMesh.material.needsUpdate = true;
			}

			if (this.mapLineMesh && this.mapLineMesh.material) {
				this.mapLineMesh.material.needsUpdate = true;
			}
		}
	}]);

	return terrain3D;
}();

exports.default = terrain3D;

},{"./elevationdata":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _imageprocessor = require('./imageprocessor');

var _imageprocessor2 = _interopRequireDefault(_imageprocessor);

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
			this.renderer.setClearColor(0xFFEDBC, 1);
			document.getElementById('webgl-content').appendChild(this.renderer.domElement);

			this.initCamera();
			this.initLights();

			_elevationdata2.default.initElevationMaps().then(function () {
				_this.init3dMap();
			});

			this.render();

			window.addEventListener('resize', this.onWindowResize.bind(this), false);
			this.inited = true;
			this.needRender = true;

			this.scene.fog = new THREE.FogExp2(0xFFEDBC, 0.0004);

			$(window).focus(function () {
				this.needRender = true;
			});
			$(window).blur(function () {
				this.needRender = false;
			});
		}
	}, {
		key: 'init3dMap',
		value: function init3dMap() {
			this.map3d = new _map2.default();
			this.map3d.init({ scene: this.scene, camera: this.camera });
			this.map3d.initTerrain();

			this.loadFont();
		}
	}, {
		key: 'loadFont',
		value: function loadFont() {
			var _this2 = this;

			var loader = new THREE.FontLoader();

			loader.load('fonts/droid.typeface.js', function (response) {
				_this2.font = response;

				_this2.initStatistics();
			});
		}
	}, {
		key: 'initStatistics',
		value: function initStatistics() {
			//AFRICA
			this.createColumn({
				x: 250,
				z: -100,
				height: 500,
				text: '75%',
				color: 0x57385C
			});

			//SAMERICA
			this.createColumn({
				x: -850,
				z: 230,
				height: 300,
				text: '45%',
				color: 0xA75265
			});

			//NAMERCIA
			this.createColumn({
				x: -1150,
				z: -550,
				height: 600,
				text: '85%',
				color: 0xA75265
			});

			//Europe
			this.createColumn({
				x: 200,
				z: -600,
				height: 700,
				text: '95%',
				color: 0x3F195C
			});

			//Asia
			this.createColumn({
				x: 1200,
				z: -600,
				height: 400,
				text: '45%',
				color: 0xA75265
			});

			//Australia
			this.createColumn({
				x: 1700,
				z: 600,
				height: 400,
				text: '45%',
				color: 0xA75265
			});
		}
	}, {
		key: 'createColumn',
		value: function createColumn(settings) {
			var geometry = new THREE.BoxGeometry(50, settings.height, 50),
			    material = new THREE.MeshPhongMaterial({ color: settings.color }),
			    textMaterial = new THREE.MeshPhongMaterial({ color: settings.color, shading: THREE.FlatShading }),
			    cube = new THREE.Mesh(geometry, material),
			    height = 4,
			    size = 30,
			    textGeometry = new THREE.TextGeometry(settings.text, {
				size: size,
				height: height,
				font: this.font,
				material: 0,
				extrudeMaterial: 1,
				curveSegments: 4,
				bevelEnabled: false
			}),
			    textMesh = void 0;

			textGeometry.computeBoundingBox();
			textGeometry.computeVertexNormals();
			textGeometry.verticesNeedUpdate = true;
			textGeometry.normalsNeedUpdate = true;

			textMesh = new THREE.Mesh(textGeometry, textMaterial);

			textMesh.position.x = settings.x + 40;
			textMesh.position.z = settings.z;
			textMesh.position.y = settings.height / 2 - 40;

			cube.position.x = settings.x;
			cube.position.z = settings.z;

			this.scene.add(textMesh);
			this.scene.add(cube);
		}
	}, {
		key: 'initCamera',
		value: function initCamera() {
			this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
			this.camera.position.z = 1500;
			this.camera.position.y = 7000;
			this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

			TweenMax.to(this.camera.position, 1, { delay: 0.3, z: 1500, y: 1600, ease: Circ.easeOut });
		}
	}, {
		key: 'initLights',
		value: function initLights() {
			var ambientLight = new THREE.AmbientLight(0xFFEDBC),
			    pointLight = void 0;

			this.scene.add(ambientLight);

			pointLight = new THREE.PointLight(0xffc4d5, 1, 0);
			pointLight.position.set(500, 1000, 0);
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

},{"./elevationdata":3,"./imageprocessor":4,"./map":5}]},{},[2])


//# sourceMappingURL=map/app.js.map
