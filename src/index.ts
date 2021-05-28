import './style.css'

import { AmbientLight, AxesHelper, Clock, Mesh, MeshBasicMaterial, MeshMatcapMaterial, TorusBufferGeometry } from 'three'

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
import { animateDonuts } from './animations'
import { generateDonuts } from './creators'
const axesHelper = new AxesHelper();
// scene.add(axesHelper)

setPointLight(scene);
setHemiLight(scene);
const OC = setOrbitControls(camera, canvas);
OC.dampingFactor = .01
OC.enableDamping = true
OC.enablePan = true;
// OC.autoRotate = true;
OC.minAzimuthAngle = -Math.PI /4 
OC.maxAzimuthAngle = Math.PI /4
OC.maxPolarAngle = Math.PI /1.7
OC.minPolarAngle = Math.PI / 2.3
// OC.minPolarAngle = Math.PI /3
// const ambientLight = new AmbientLight(0xffffff, .05)
// scene.add(ambientLight)
let text: Mesh;

loadText('BUGFELLA', .2, greenMaterial).then(mesh => {
	mesh.position.z = -20;
	mesh.scale.set(20, 20, 3);
	text = mesh;
	scene.add(mesh)
})

const cursor = {
	x: 0,
	y: 0,
}

window.addEventListener('resize', () => {
	resize();
})

camera.position.z += 20

window.addEventListener('mousemove', (e) => {
	cursor.x = e.clientX / size.width - 0.5
	cursor.y = e.clientY / size.height - 0.5
})

window.addEventListener('keydown', (e) => {
	if(e.code == 'Space') shouldAnimateDonuts = !shouldAnimateDonuts;
})
let shouldAnimateDonuts = true;

const donuts = generateDonuts(100);
scene.add(...donuts)

const clock = new Clock()

function animate () {
	if (shouldAnimateDonuts) animateDonuts(donuts);
	OC.update()
	requestAnimationFrame(animate)
	renderer.render(scene, camera);
}

animate()