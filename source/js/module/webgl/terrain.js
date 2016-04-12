import ElevationData from './elevationdata';

class terrain3D {

	init(settings) {
		console.log('nit terrain3D');

		this.scene = settings.scene;
	}

	createMapTerrain() {
		let imgW,
			imgH,
			res = 2,
			size = 8,
			resW,
			resH,
			wLength,
			hLength,
			geometry,
			allVertices,
			material,
			bg;


		this.terrainData = ElevationData.getElevationMap().country.elevationArray;

		console.log('this.terrainData', this.terrainData);

		imgW = ElevationData.getElevationMap().country.imgW;
		imgH = ElevationData.getElevationMap().country.imgH;
		resW = Math.floor(imgW / res);
		resH = Math.floor(imgH / res);
		wLength = this.terrainData.length;
		hLength = this.terrainData[0].length;

		geometry = new THREE.PlaneGeometry(imgW * size, imgH * size, resW, resH);

		allVertices = geometry.vertices.length;

		material = new THREE.MeshPhongMaterial({
			color: 0x380746,
			shininess: 5,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading,
			opacity: 1
		});

		for (let i = 0; i < allVertices; i++) {
			let x = geometry.vertices[i].x + imgW * size / 2;
			let y = geometry.vertices[i].y + imgH * size / 2;

			x = x / (imgW * size / wLength);
			y = y / (imgH * size / hLength);

			if (this.terrainData[x] && this.terrainData[x][hLength - y]) {
				geometry.vertices[i].z = this.terrainData[x][hLength - y].scale / 8;
			}
		}

		bg = new THREE.BufferGeometry().fromGeometry(geometry);
		this.mapTerrainMesh = new THREE.Mesh(bg, material);

		this.mapTerrainMesh.position.z = -30;
		this.mapTerrainMesh.rotation.z = Math.PI / 2;

		this.scene.add(this.mapTerrainMesh);

		bg.verticesNeedUpdate = true;
		bg.computeFaceNormals();
		bg.computeVertexNormals();

		geometry.dispose();
		geometry = null;

		this.initTerrainParticles();
	}

	initTerrainParticles() {
		let i,
			material = new THREE.PointCloudMaterial({
				color: 0xe4173e,
				size: 1,
				map: THREE.ImageUtils.loadTexture('{{ASSET_PREFIX}}i/content/dot_simple.png'),
				blending: THREE.AdditiveBlending,
				opacity: 0.2
			});

		let lineMaterial = new THREE.LineBasicMaterial({
			color: 0xe4173e,
			linewidth: 1.0,
			opacity: 0.3,
			transparent: true,
			fog: true
		});

		let geometry = new THREE.Geometry(),
			lineGeom = new THREE.Geometry(),
			step = 8,
			vertex,
			vertex2,
			vertex3,
			item,
			vertices = [];

		for (let i = 0; i < this.terrainData.length; i++) {
			for (let j = 0; j < this.terrainData[i].length; j++) {

				if (this.terrainData[i][j].active) {
					vertex = new THREE.Vector3();

					vertex.x = this.terrainData[i][j].y * step;
					vertex.y = this.terrainData[i][j].x * step;
					vertex.z = this.terrainData[i][j].scale / 10;

					if (this.terrainData[i + 1]) {
						item = this.terrainData[i + 1][j];

						if (item) {
							vertex2 = new THREE.Vector3();

							vertex2.x = item.y * step;
							vertex2.y = item.x * step;
							vertex2.z = item.scale / 10;

							lineGeom.vertices.push(vertex);
							lineGeom.vertices.push(vertex2);
						}
					}

					item = this.terrainData[i][j + 1];

					geometry.vertices.push(vertex);
					vertices.push(vertex);
				}

			}

		}

		this.mapLineMesh = new THREE.Line(lineGeom, lineMaterial, THREE.LinePieces);
		this.scene.add(this.mapLineMesh);
	}

	updateMaterials() {
		if (this.mapTerrainMesh && this.mapTerrainMesh.material) {
			this.mapTerrainMesh.material.needsUpdate = true;
		}

		if (this.mapLineMesh && this.mapLineMesh.material) {
			this.mapLineMesh.material.needsUpdate = true;
		}
	}

}

export default terrain3D