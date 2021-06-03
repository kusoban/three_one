import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AdditiveBlending, AxesHelper, BufferAttribute, BufferGeometry, Color, Points, PointsMaterial } from 'three'

const AH = new AxesHelper(1);
/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 500
})

// Canvas
const canvas = <HTMLCanvasElement>document.querySelector('#bg')

// Scene
const scene = new THREE.Scene()


//Galaxy
const parameters = {
    radius: 5,
    branches: 7,
    count: 325140,
    pointSize: 0.01,
    pointSpread: 50,
    spin: 1,
    randomness: .2,
    randomnessPower: 2.7,
    insideColor: '#ff5d35',
    outsideColor: '#187fff'
}

gui.add(parameters, 'radius', .5, 20, .1).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches', 1, 200, 1).onFinishChange(generateGalaxy)
gui.add(parameters, 'count', 100, 1000000, 10).onFinishChange(generateGalaxy)
gui.add(parameters, 'pointSize', 0.01, 1, 0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'pointSpread', 1, 500, 1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin', -5, 5, 0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness', 0, 1, 0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower', 2, 10, 0.2).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)
let points: Points | null;
function generateGalaxy () {
    scene.clear()
    const geometry = new BufferGeometry();
    const colors = [];
    const vertices: number[] = [];

    const insideColor = new Color(parameters.insideColor)
    const outsideColor = new Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++) {

        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > .5 ? -1 : 1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > .5 ? -1 : 1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > .5 ? -1 : 1)

        const vertice = [
            Math.cos(branchAngle + spinAngle) * radius + randomX,
            Math.sin(branchAngle + spinAngle) * radius + randomY,
            randomZ,
        ];
        vertices.push(...vertice);
        
        const mixedColor = insideColor.clone().lerp(outsideColor, radius / parameters.radius);

        if(i < 10) {
            
            console.log('inside', insideColor)
            console.log('outside', outsideColor)
            console.log('mixed', mixedColor)
            
        }
        
        const color = [
            mixedColor.r,
            mixedColor.g,
            mixedColor.b
        ];

        colors.push(...color);
    }
    
    const float32Vertices = Float32Array.from(vertices);
    const float32Colors = Float32Array.from(colors);
    
    geometry.setAttribute('position', new BufferAttribute(float32Vertices, 3));
    geometry.setAttribute('color', new BufferAttribute(float32Colors, 3));
    const material = new PointsMaterial({
        size: parameters.pointSize,
        sizeAttenuation: true,
        depthWrite: false,
        blending: AdditiveBlending,
        vertexColors: true,
    })
    points = new Points(geometry, material);
    scene.add(points)
}
generateGalaxy()

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
scene.add(camera)
scene.add(AH);

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
let play = true;
document.addEventListener('keydown', e => {
    console.log(e.code);

    if (e.code == 'Space') {
        play = !play
    }
})
const tick = () => {
    // if (play && points) {
    //     if (points) points.rotation.z -= .01
    // }

    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()