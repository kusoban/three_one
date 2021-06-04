import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AmbientLight, AxesHelper, Color, DirectionalLight, Intersection, MeshToonMaterial, Object3D, Raycaster, Vector3 } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = <HTMLCanvasElement>document.querySelector('#bg')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object0 = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 16, 16),
	new MeshToonMaterial({color: 'blue'})
)
object0.position.x = 1
object0.userData.nextColor = new Color('cyan')

const object1 = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 16, 16),
	new MeshToonMaterial({color: 'blue'})
)
object1.position.x = 3
object1.userData.nextColor = new Color('violet')

const object2 = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 16, 16),
	new MeshToonMaterial({color: 'blue'})
)
object2.position.x = 5
object2.userData.nextColor = new Color('orange')

const object3 = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 16, 16),
	new MeshToonMaterial({color: 'blue'})
)
object3.userData.nextColor = new Color('yellow')
object3.position.x = 7

const object4 = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 16, 16),
	new MeshToonMaterial({color: 'blue'})
)
object4.position.x = 9
object4.userData.nextColor = new Color(0x01ff22);

scene.add(object0, object1, object2, object3, object4,)


/** 
 * Raycaster
 * 
*/

const raycaster = new Raycaster();


/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//Mouse 

const mouse = new THREE.Vector2()
scene.add(new DirectionalLight('white'));
window.addEventListener('mousemove', e => {
	mouse.x = e.clientX / sizes.width * 2 - 1;
	mouse.y = -(e.clientY / sizes.height * 2 - 1);
})

window.addEventListener('click', e => {
	if(currIntersect) {
		console.log(currIntersect.object);
		
		currIntersect.object.material.color = currIntersect.object.userData.nextColor
		if(currIntersect.object.userData.material) currIntersect.object.material = currIntersect.object.userData.material
	}
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const ah = new AxesHelper(1)
scene.add(ah)
// const rayOrigin = new Vector3(0, -2, 0);
// const rayDir = new Vector3(10, 0, 0);
// rayDir.normalize()
// raycaster.set(rayOrigin, rayDir);
// const arrowHelper = new THREE.ArrowHelper( rayDir, rayOrigin );
// scene.add( arrowHelper );

const objects = [object0, object1, object2, object3, object4];
let currIntersect: Intersection | null = null;
const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	object0.position.y = Math.sin(elapsedTime + .1) * 2
	object1.position.y = Math.sin(elapsedTime + .3) * 2
	object2.position.y = Math.sin(elapsedTime + .5) * 2
	object3.position.y = Math.sin(elapsedTime + .6) * 2
	object4.position.y = Math.sin(elapsedTime + .7) * 2

	// rayDir.normalize();
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(objects);
	const intersectObjects = intersects.map(int => int.object);

	if (intersects.length) {
		if (!currIntersect) {
			console.log('mouse enter');

		}
		currIntersect = intersects[0]

	} else {
		if (currIntersect) {
			console.log('mouse leave');
			currIntersect = null;
		}
	}

	objects.map(obj => {
		// if (intersectObjects.includes(obj)) {
		// 	obj.material.color = new Color('blue')
		// } else {
		// 	obj.material.color = new Color('red')
		// }
	})


	// if(!object) return;
	// console.log(intersect[0])
	// const intersects = raycaster.intersectObjects([object1, object2, object3]);
	// console.log(intersect);
	// console.log(intersects);

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()