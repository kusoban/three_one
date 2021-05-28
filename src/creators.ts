import { random } from 'gsap/all';
import { Color, Mesh, MeshStandardMaterial, MeshToonMaterial, TorusBufferGeometry } from 'three';
import { acidMaterial, orangeMatcap, greenMaterial, standard } from './materials'
const geometry = new TorusBufferGeometry(1, .6, 30, 30)

export function generateDonuts (count: number) {
	const donuts: Mesh[] = []
	for (let i = 0; i < count; i++) {
		const rand = Math.random()
		const randR = Math.floor(random(0, 255))
		const randG = Math.floor(random(0, 255))
		const randB = Math.floor(random(0, 255))
		// console.log(randR, randG, randB);
		const material = new MeshToonMaterial({ color: new Color(`rgb(${randR}, ${randG}, ${randB})`) })
		const donut = new Mesh(geometry, material)
		donut.position.x = (Math.random() - .5) * 30;
		donut.position.y = (Math.random() - .5) * 35;
		donut.position.z = (Math.random() - .5) * 15;
		donut.rotation.y = (Math.random() - .5) * Math.PI
		donut.rotation.x = (Math.random() - .5) * Math.PI
		const scale = Math.random();
		donut.scale.set(scale, scale, scale);
		donuts.push(donut);
	}
	return donuts;
}
