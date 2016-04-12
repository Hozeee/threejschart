import Terrain3d from './terrain';

class Map3D {
	init(settings) {
		this.scene = settings.scene;
		this.camera = settings.camera;

		this.initWorld();

		this.terrain3D = new Terrain3d();
		this.terrain3D.init({scene: this.worldContainer});
	}

	initWorld() {
		this.world = new THREE.Object3D();
		this.world.rotation.y = -Math.PI / 2;
		this.scene.add(this.world);

		this.worldContainer = new THREE.Object3D();
		this.worldContainer.rotation.x = -Math.PI / 2;
		this.world.add(this.worldContainer);
	}

	initTerrain() {
		console.log('Map initTerrain');

		if (this.terrain3D) {
			this.terrain3D.createMapTerrain();
		}
	}

	render() {
		if (this.camera) {
			this.camera.updateMatrix();
			this.camera.updateMatrixWorld();
		}
	}

}

export default Map3D;