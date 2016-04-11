import ImageProcessor from './imageprocessor';
import Skybox from './skybox';
import ElevationData from './elevationdata';
import Map3d from './map';

class WebGl {

	init() {
		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer({antialias: true, clearColor: 0x000000});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0x19081b, 1);
		document.getElementById('webgl-content').appendChild(this.renderer.domElement);

		this.initCamera();
		this.initLights();

		this.skybox = new Skybox();
		this.skybox.init({scene: this.scene});

		this.elevationData = new ElevationData();
		this.elevationData.initElevationMaps().then(() => {
			this.init3dMap();
		});

		this.render();

		window.addEventListener('resize', this.onWindowResize.bind(this), false);
		this.inited = true;
		this.needRender = true;
	}

	init3dMap() {
		this.map3d = new Map3d();
		this.map3d.init({scene: this.scene, camera: this.camera});
		this.map3d.initTerrain();
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 500;
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
	}

	initLights() {
		let ambientLight = new THREE.AmbientLight(0x222222),
			pointLight;

		this.scene.add(ambientLight);

		pointLight = new THREE.PointLight(0xffffff, 1, 0);
		pointLight.position.set(0, 500, 0);
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