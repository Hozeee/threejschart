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

		this.scene.fog = new THREE.FogExp2(0xFFEDBC, 0.0003);

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
			text2: 'AFRICA',
			color: 0x57385C,
			delay: 0,
		});

		//SAMERICA
		this.createColumn({
			x: -850,
			z: 230,
			height: 300,
			text2: 'SOUTH AMERICA',
			text: '45%',
			color: 0xA75265,
			delay: 0.3,
		});

		//NAMERCIA
		this.createColumn({
			x: -1150,
			z: -550,
			height: 800,
			text2: 'NORTH AMERICA',
			text: '85%',
			color: 0xA75265,
			delay: 0.5,
		});

		//Europe
		this.createColumn({
			x: 200,
			z: -600,
			height: 1000,
			text2: 'EUROPE',
			text: '95%',
			color: 0x3F195C,
			delay: 0.7,
		});

		//Asia
		this.createColumn({
			x: 1200,
			z: -600,
			height: 400,
			text2: 'ASIA',
			text: '45%',
			color: 0xA75265,
			delay: 0.9
		});


		//Australia
		this.createColumn({
			x: 1700,
			z: 600,
			height: 400,
			text2: 'AUSTRALIA',
			text: '45%',
			color: 0xA75265,
			delay: 1,
		});

	}

	createColumn(settings) {
		let geometry = new THREE.BoxGeometry(50, settings.height, 50),
			material = new THREE.MeshPhongMaterial({color: settings.color}),
			textMaterial = new THREE.MeshPhongMaterial({color: settings.color, shading: THREE.FlatShading}),
			cube = new THREE.Mesh(geometry, material),
			wrapper,
			height = 4,
			size = 30,
			textGeometry = new THREE.TextGeometry(settings.text, {
				size: 80,
				height: height,
				font: this.font,
				material: 0,
				extrudeMaterial: 1,
				curveSegments: 4,
				bevelEnabled: false
			}),
			textGeometry2 = new THREE.TextGeometry(settings.text2, {
				size: size,
				height: height,
				font: this.font,
				material: 0,
				extrudeMaterial: 1,
				curveSegments: 4,
				bevelEnabled: false
			}),
			textMesh,
			textMesh2;

		textMesh = new THREE.Mesh(textGeometry, textMaterial);
		textMesh2 = new THREE.Mesh(textGeometry2, textMaterial);

		textMesh.position.x = settings.x + 40;
		textMesh2.position.x = settings.x - 25;
		textMesh.position.z = settings.z;
		textMesh2.position.z = settings.z;
		textMesh.position.y = settings.height / 2 - 80;
		textMesh2.position.y = settings.height / 2 + 20;

		cube.position.x = settings.x;
		cube.position.z = settings.z;

		wrapper = new THREE.Object3D();
		wrapper.position.y = -700;
		this.scene.add(wrapper);

		TweenMax.to(wrapper.position, 1.8, {delay: 1 + settings.delay, y: 0, ease: Circ.easeOut});

		wrapper.add(textMesh);
		wrapper.add(textMesh2);
		wrapper.add(cube);
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 1500;
		this.camera.position.y = 7000;
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

		TweenMax.to(this.camera.position, 1.4, {delay: 0.4, z: 1500, y: 1600, ease: Circ.easeOut});
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