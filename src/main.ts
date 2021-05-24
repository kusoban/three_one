import './style.css'
import { scene } from './scene'
import { camera } from './camera'
import { renderer } from './renderer'
import { box } from './shapes'

camera.position.z += 2
box.rotation.y += .5

scene.add(box);

function animate () {
	requestAnimationFrame(animate)
	renderer.render(scene, camera);
}

animate();