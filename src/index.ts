import './style.css'

import { AmbientLight, AxesHelper, Clock, Mesh, MeshBasicMaterial, MeshMatcapMaterial, MeshStandardMaterial, Object3D, TorusBufferGeometry } from 'three'

import gsap from 'gsap'

import { scene } from './scene'
import { camera } from './camera'
import { canvas, renderer } from './renderer'
import { loadText, makePlane } from './shapes'
import { size, resize } from './renderer'
import './window'
import { acidMaterial, orangeMatcap, greenMaterial } from './materials'
import { getRectLight, getHemiLight, getPointLight, getSpotLight } from './light'
import { setOrbitControls } from './helpers'
import { animateDonuts } from './animations'
import { generateDonuts } from './creators'
const axesHelper = new AxesHelper();
// scene.add(axesHelper)

// const rLight = getRectLight();
// const rLight2 = getRectLight();
const spotLight = getSpotLight();
spotLight.castShadow = true;
scene.add(spotLight.target)
spotLight.position.z = 20;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
// scene.add(new AmbientLight())
// scene.add(rLight)
// scene.add(rLight2)
scene.add(spotLight)
// setPointLight(scene);
const {mesh: plane} = makePlane(2000, 2000);
plane.position.z = -150;
plane.receiveShadow = true;

scene.add(plane);
// setHemiLight(scene);
const OC = setOrbitControls(camera, canvas);
OC.dampingFactor = .01
OC.enableDamping = true
OC.enablePan = true;
// OC.autoRotate = true;
// OC.minAzimuthAngle = -Math.PI /4 
// OC.maxAzimuthAngle = Math.PI /4
// OC.maxPolarAngle = Math.PI /1.7
// OC.minPolarAngle = Math.PI / 2.3
// OC.minPolarAngle = Math.PI /3
// const ambientLight = new AmbientLight(0xffffff, .05)
// scene.add(ambientLight)
loadText('BUGFELLA', 1.3, new MeshStandardMaterial()).then(mesh => {
	mesh.position.z = -100;
	mesh.scale.set(20, 20, 3);
	mesh.receiveShadow = true;
	mesh.castShadow = true;
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
	if (e.code == 'Space') shouldAnimateDonuts = !shouldAnimateDonuts;
})
let shouldAnimateDonuts = true;

const donuts = generateDonuts(20);
scene.add(...donuts)

const clock = new Clock()
renderer.shadowMap.enabled = true;
function animate () {
	if (shouldAnimateDonuts) animateDonuts(donuts);
	spotLight.target.position.x = (cursor.x * 25);
	spotLight.target.position.y = -(cursor.y * 25);
	spotLight.rotation.x += 1
	spotLight.rotation.y += 1
	spotLight.rotation.z += 1
	// spotLight.position.x = -(cursor.x * 25);
	// spotLight.position.y = (cursor.y * 25);
	// spotLight.rotation.y = cursor.x * 20

	OC.update()
	requestAnimationFrame(animate)
	renderer.render(scene, camera);
}

animate()