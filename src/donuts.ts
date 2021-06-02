import './style.css'

import { AmbientLight, AxesHelper, Clock, Mesh, MeshBasicMaterial, MeshMatcapMaterial, MeshStandardMaterial, Object3D, SpotLight, TorusBufferGeometry } from 'three'

import gsap from 'gsap'

import { scene } from './modules/scene'
import { camera } from './modules/camera'
import { canvas, renderer } from './modules/renderer'
import { loadText, makePlane } from './modules/shapes'
import { size, resize } from './modules/renderer'
import './window'
import { acidMaterial, orangeMatcap, greenMaterial } from './modules/materials'
import { getRectLight, getHemiLight, getPointLight, getSpotLight } from './modules/light'
import { setOrbitControls } from './helpers'
import { animateDonuts } from './modules/animations'
import { generateDonuts } from './modules/creators'

const axesHelper = new AxesHelper();

const distanceBetweenLights = 50;


const spotLight = getSpotLight();
spotLight.castShadow = true;
scene.add(spotLight.target)
spotLight.position.z = 30;
spotLight.position.y = 0;
console.log(spotLight.position)
scene.add(spotLight, spotLight.target)
// spotLight.shadow.mapSize.width = 2048;
// spotLight.shadow.mapSize.height = 2048;
// spotLight.shadow.radius = 20

const spotLight2 = getSpotLight();

spotLight2.position.z = 30;
spotLight2.position.y = spotLight.target.position.y - distanceBetweenLights;
spotLight2.target.position.y = spotLight.target.position.y - distanceBetweenLights
console.log(spotLight2.position)
scene.add(spotLight2, spotLight2.target)

const spotLight3 = getSpotLight();
spotLight3.position.z = 30;
spotLight3.position.y = spotLight2.target.position.y - distanceBetweenLights;
spotLight3.target.position.y = spotLight2.target.position.y - distanceBetweenLights;
scene.add(spotLight3, spotLight3.target)

const { mesh: plane } = makePlane(2000, 2000);
plane.position.z = -150;
plane.receiveShadow = true;

scene.add(plane);
// const OC = setOrbitControls(camera, canvas);
// OC.dampingFactor = .01
// OC.enableDamping = true
// OC.enablePan = true;
// OC.minAzimuthAngle = -Math.PI /4 
// OC.maxAzimuthAngle = Math.PI /4
// OC.maxPolarAngle = Math.PI /1.7
// OC.minPolarAngle = Math.PI / 2.3
// OC.minPolarAngle = Math.PI /3
// const ambientLight = new AmbientLight(0xffffff, 1)
// // scene.add(ambientLight)
let text: Mesh;
loadText('BUGFELLA', 1.3, new MeshStandardMaterial()).then(mesh => {
	mesh.position.z = -100;
	mesh.scale.set(20, 20, 3);
	mesh.receiveShadow = true;
	mesh.castShadow = true;
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

// camera.position.z += 10
camera.rotation.x = Math.PI / 2
camera.position.y = -20

window.addEventListener('mousemove', (e) => {
	cursor.x = e.clientX / size.width - 0.5
	cursor.y = e.clientY / size.height - 0.5
})

window.addEventListener('keydown', (e) => {
	if (e.code == 'Space') shouldAnimateDonuts = !shouldAnimateDonuts;
})
let shouldAnimateDonuts = true;

const donuts = generateDonuts(300);
scene.add(...donuts)

const clock = new Clock()
renderer.shadowMap.enabled = true;
function animate () {
	if (shouldAnimateDonuts) animateDonuts(donuts);
	spotLight.target.position.x = (cursor.x * 25);
	spotLight.target.position.y = -(cursor.y * 25);
	spotLight.position.y = -(cursor.y * 25);
	spotLight.position.x = -(cursor.x * 25);

	spotLight2.target.position.x = (cursor.x * 25);
	spotLight2.target.position.y  = spotLight.position.y - (cursor.y * 25);
	spotLight2.position.y  = spotLight.position.y - (cursor.y * 25);
	
	// spotLight3.target.position.x = (cursor.x * 25);
	// spotLight3.target.position.y = spotLight2.position.y -(cursor.y * 25);
	// spotLight3.position.y = spotLight2.position.y -(cursor.y * 25);

	// OC.update()
	requestAnimationFrame(animate)
	renderer.render(scene, camera);
}

animate()