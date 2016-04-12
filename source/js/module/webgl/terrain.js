import ElevationData from './elevationdata';

class terrain3D {

	init(settings) {
		this.scene = settings.scene;
	}

	createMapTerrain() {
		let imgW,
			imgH,
			res = 4,
			size = 8,
			scale = 7,
			resW,
			resH,
			wLength,
			hLength,
			geometry,
			allVertices,
			material;

		this.terrainData = ElevationData.getElevationMap().country.elevationArray;

		imgW = ElevationData.getElevationMap().country.imgW;
		imgH = ElevationData.getElevationMap().country.imgH;
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

		for (let i = 0; i < allVertices; i++) {
			let x = geometry.vertices[i].x + imgW * size / 2;
			let y = geometry.vertices[i].y + imgH * size / 2;

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

	initTerrainParticles() {
		let lineMaterial = new THREE.LineBasicMaterial({
				color: 0xaf3ecf,
				linewidth: 1.5,
				opacity: 0.2,
				transparent: true,
				fog: true
			}),
			geometry = new THREE.Geometry(),
			lineGeom = new THREE.Geometry(),
			step = 8,
			vertex,
			vertex2,
			vertex3,
			scale = 7,
			item,
			vertices = [];

		for (let i = 0; i < this.terrainData.length; i += 1) {
			for (let j = 0; j < this.terrainData[i].length; j += 2) {

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