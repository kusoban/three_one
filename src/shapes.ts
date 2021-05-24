import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({
	color: 0xff0000,
	// wireframe: true
})

const box = new Mesh(geometry, material)

export { box }