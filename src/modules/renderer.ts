import { PerspectiveCamera, WebGLRenderer } from 'three'
import { camera } from './camera'

interface WebkitCanvas extends HTMLCanvasElement {
	webkitRequestFullScreen: any,
}

export const canvas = <WebkitCanvas>document.querySelector('#bg')

const renderer = new WebGLRenderer({
	canvas
})


export const resize = () => {
	size.update()
	camera.aspect = size.getRatio();
	camera.updateProjectionMatrix();
	renderer.setSize(size.width, size.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

export const size = {
	update () {
		this.width = window.innerWidth
		this.height = window.innerHeight
	},
	width: window.innerWidth,
	height: window.innerHeight,
	getRatio () { return this.width / this.height },
};

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(size.width, size.height);

export { renderer }