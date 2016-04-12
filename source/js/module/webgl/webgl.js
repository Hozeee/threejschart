import ImageProcessor from './imageprocessor';
import ElevationData from './elevationdata';
import Map3d from './map';

class WebGl {

	init() {
		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer({antialias: true, clearColor: 0x000000});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0xFFEDBC, 1);
		document.getElementById('webgl-content').appendChild(this.renderer.domElement);

		this.initCamera();
		this.initLights();

		ElevationData.initElevationMaps().then(() => {
			this.init3dMap();
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

	init3dMap() {
		this.map3d = new Map3d();
		this.map3d.init({scene: this.scene, camera: this.camera});
		this.map3d.initTerrain();

		this.loadFont();
	}

	loadFont() {
		let loader = new THREE.FontLoader();

		loader.load('fonts/droid.typeface.js', (response) => {
			this.font = response;

			this.initStatistics();
		});
	}

	initStatistics() {
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

	createColumn(settings) {
		let geometry = new THREE.BoxGeometry(50, settings.height, 50),
			material = new THREE.MeshPhongMaterial({color: settings.color}),
			textMaterial = new THREE.MeshPhongMaterial({color: settings.color, shading: THREE.FlatShading}),
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
			textMesh;

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

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 1500;
		this.camera.position.y = 7000;
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

		TweenMax.to(this.camera.position, 1, {delay: 0.3, z: 1500, y: 1600, ease: Circ.easeOut});
	}

	initLights() {
		let ambientLight = new THREE.AmbientLight(0xFFEDBC),
			pointLight;

		this.scene.add(ambientLight);

		pointLight = new THREE.PointLight(0xffc4d5, 1, 0);
		pointLight.position.set(500, 1000, 0);
		this.scene.add(pointLight);
	}

	onWindowResize() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}

	render() {
		if (this.needRender) {

			if (this.map3d) {
				this.map3d.render();
			}

			this.controls.update();

			this.renderer.render(this.scene, this.camera);
		}

		requestAnimationFrame(this.render.bind(this));
	}

}

export default WebGl;