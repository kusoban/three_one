import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AdditiveBlending, BoxBufferGeometry, BufferAttribute, BufferGeometry, Clock, Mesh, MeshBasicMaterial, PerspectiveCamera, Points, PointsMaterial, Scene, SphereBufferGeometry, TextureLoader, WebGLRenderer } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = <HTMLCanvasElement>document.querySelector('#bg')

// Scene
const scene = new Scene()

/**
 * Textures
 */
const textureLoader = new TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/4.png')

/**
 * 
 * Particles
*/
const particlesGeometry = new BufferGeometry();
const vertices: number[] = [];
const colors: number[] = [];
const particleCount = 10000;
for (let i = 0; i < particleCount; i++) {
    const vertice = [
        (Math.random() - .5) * 20 + 5,
        1,
        (Math.random() - .5) * 20 + 5
    ];
    const color = [
        (Math.random()),
        (Math.random()),
        (Math.random())
    ]
    vertices.push(...vertice);
    colors.push(...color);
}

particlesGeometry.setAttribute('position', new BufferAttribute(Float32Array.from(vertices), 3))
particlesGeometry.setAttribute('color', new BufferAttribute(Float32Array.from(colors), 3))

const particlesMaterial = new PointsMaterial({
    // vertexColors: true,
    // alphaMap: particleTexture,
    // transparent: true,
    // map: particleTexture,
    size: .001,
    sizeAttenuation: true,
})

const points = new Points(particlesGeometry, particlesMaterial)
points.material.depthWrite = false;
points.material.blending = AdditiveBlending;
scene.add(points)


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
const camera = new PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = particlesGeometry.attributes.position.getX(i)

        particlesGeometry.attributes.position.setY(
            i,
            Math.sin(elapsedTime + x)
        )
    }
    particlesGeometry.attributes.position.needsUpdate = true;
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()