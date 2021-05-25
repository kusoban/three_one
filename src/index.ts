import './style.css'

import { AxesHelper, Clock, Material } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { gui } from './gui'
import gsap from 'gsap'

import { scene } from './scene'
import { camera } from './camera'
import { canvas, renderer } from './renderer'
import { getCustom } from './shapes'
import { size, resize } from './renderer'
import './window'
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

const { mesh: custom } = getCustom();
console.log(custom.material.color.getHex());

const customParams = {
	spin () {
		gsap.to(custom.rotation, {
			y: function (index, target) {
				return target.y + (Math.PI * 2);
			}, duration: 3
		})
		console.log('spin')
	},
	color: custom.material.color.getHex()
}


window.addEventListener('mousemove', (e) => {
	cursor.x = e.clientX / size.width - 0.5
	cursor.y = e.clientY / size.height - 0.5
})

scene.add(custom)
gui.add(custom.position, 'x').min(-3).max(3).step(0.01);
gui.add(custom.position, 'y').min(-3).max(3).step(0.01);
gui.add(custom.position, 'z').min(-3).max(3).step(0.01);

gui.add(custom, 'visible')
gui.add(custom.material, 'wireframe')
gui.addColor(customParams, 'color').onChange((v) => {
	custom.material.setValues({ color: v })
})
gui.add(customParams, 'spin');
camera.position.z += 40

function animate () {
	orbitControl.update()
	requestAnimationFrame(animate)
	renderer.render(scene, camera);
}

animate()