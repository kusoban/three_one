import './style.css'

import { AxesHelper, Clock, Mesh, MeshBasicMaterial, MeshMatcapMaterial, TorusBufferGeometry } from 'three'

import gsap from 'gsap'

import { scene } from './scene'
import { camera } from './camera'
import { canvas, renderer } from './renderer'
import { loadText } from './shapes'
import { size, resize } from './renderer'
import './window'
import { acidMaterial, orangeMatcap, greenMaterial } from './materials'
import { setHemiLight, setPointLight } from './light'
import { setOrbitControls } from './helpers'

const axesHelper = new AxesHelper();
// scene.add(axesHelper)

setPointLight(scene);
setHemiLight(scene);
// const OC = setOrbitControls(camera, canvas);

loadText('JMEB', greenMaterial).then(mesh => {
	mesh.position.z = -20;
	mesh.scale.set(20,20,3);
	scene.add(mesh)
})

const cursor = {
	x: 0,
	y: 0,
}

window.addEventListener('resize', () => {
	resize();
})

camera.position.z += 10

window.addEventListener('mousemove', (e) => {
	cursor.x = e.clientX / size.width - 0.5
	cursor.y = e.clientY / size.height - 0.5
})

const geometry = new TorusBufferGeometry(1, .6, 30, 30)
const material = acidMaterial
const donuts: Mesh[] = [];
for (let i = 0; i < 200; i++) {
	const rand = Math.random()
	const donut = new Mesh(geometry, rand > .5 ? (rand < .65  ? greenMaterial : orangeMatcap) : material )
	donut.position.x = (Math.random() - .5) * 20;
	donut.position.y = (Math.random() - .5) * 30;
	donut.position.z = (Math.random() - .5) * 15;
	donut.rotation.y = (Math.random() - .5) * Math.PI
	donut.rotation.x = (Math.random() - .5) * Math.PI
	const scale = Math.random();
	donut.scale.set(scale, scale, scale);
	scene.add(donut)
	donuts.push(donut);
}

const clock = new Clock()

function animate () {
	camera.rotation.y = cursor.x;
	// OC.update()
	donuts.forEach(donut => {
		if(donut.position.y < - 15) return  donut.position.y = 15;
		donut.position.y -= .1
		donut.rotation.y -= .02
		donut.rotation.x -= .02
		
	})
	requestAnimationFrame(animate)
	renderer.render(scene, camera);
}

animate()