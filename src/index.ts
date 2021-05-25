import './style.css'

import { AxesHelper, Clock } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { scene } from './scene'
import { camera } from './camera'
import { canvas, renderer } from './renderer'
import { box } from './shapes'
import { size, resize } from './renderer'
import './window'
// import gsap from 'gsap';
let theCamera = camera;

const orbitControl = new OrbitControls(camera, canvas)
orbitControl.enableDamping = true;
orbitControl.update()
const cursor = {
	x: 0,
	y: 0,
}

window.addEventListener('resize', () => {
	resize();
})


window.addEventListener('keydown', function (event) {
	if (event.code == 'KeyW') {
		camera.position.z -= 0.05
	}
	if (event.code == 'KeyS') {
		camera.position.z += 0.05
	}
	if (event.code == 'KeyA') {
		camera.position.x -= 0.05
	}
	if (event.code == 'KeyD') {
		camera.position.x += 0.05
	}
})

window.addEventListener('mousemove', (e) => {
	cursor.x = e.clientX / size.width - 0.5
	cursor.y = e.clientY / size.height - 0.5
})

const clock = new Clock();

const ah = new AxesHelper();
scene.add(ah);
scene.add(box);
camera.position.z += 3

function animate () {
	orbitControl.update()
	requestAnimationFrame(animate)
	renderer.render(scene, theCamera);
}

animate()