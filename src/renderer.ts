import { WebGLRenderer } from 'three'
const renderer = new WebGLRenderer({
	canvas: <HTMLCanvasElement>document.querySelector('#bg')
})


renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);

export { renderer }