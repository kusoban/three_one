import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3, ShapeGeometry, WireframeGeometry, BufferGeometry, BufferAttribute, Texture, TextureLoader } from 'three'

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({
	color: 0xff0000,
	// wireframe: true
})

export function getCustom () {

	// const verticesArray = []

	// for (let i = 0; i < 100; i++) {
	// 	for (let j = 0; j < 3; j++) {
	// 		verticesArray.push(...[
	// 			(Math.round(Math.random()) - 0.5) * 4,
	// 			(Math.round(Math.random()) - 0.5) * 4,
	// 			(Math.round(Math.random()) - 0.5) * 4,
	// 		])
	// 	}
	// }
	// const vertices = Float32Array.from(verticesArray);

	const texture = new TextureLoader().load('/textures/Door_Wood_001_basecolor.jpg');

	const geometry = new BoxGeometry(20, 20, 20);
	const material = new MeshBasicMaterial({ map: texture });

	const mesh = new Mesh(geometry, material);
	return { mesh, material, geometry };
}

const box = new Mesh(geometry, material)

export { box }