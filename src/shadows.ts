import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AmbientLight, Camera, CameraHelper, Clock, DirectionalLight, Mesh, MeshStandardMaterial, PCFShadowMap, PerspectiveCamera, PlaneBufferGeometry, PointLight, Scene, SphereBufferGeometry, SpotLight, TextureLoader, WebGLRenderer } from 'three'
/**
 * Textures
 */
const textureLoader = new TextureLoader();
const bakedShadow = textureLoader.load('/textures/shadows/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/shadows/simpleShadow.jpg')
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
 * Lights
 */
// Ambient light
const ambientLight = new AmbientLight(0xffffff, 0.4)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// point light
const pointLight = new PointLight(0xffffff, 0.4, 2)
pointLight.position.set(.01, 0, 1)
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = .1
pointLight.shadow.camera.far = 2
pointLight.castShadow = true;
scene.add(pointLight)
const pointLightHelper = new CameraHelper(pointLight.shadow.camera);
pointLightHelper.visible = false
scene.add(pointLightHelper)

// Directional light
const directionalLight = new DirectionalLight(0xffffff, 0.4)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

directionalLight.shadow.camera.top = 1
directionalLight.shadow.camera.right = 1
directionalLight.shadow.camera.left = - 1
directionalLight.shadow.camera.bottom = - 1

directionalLight.shadow.camera.near = 1.2
directionalLight.shadow.camera.far = 6
directionalLight.shadow.radius = 10


const dirLightHelper = new CameraHelper(directionalLight.shadow.camera);
dirLightHelper.visible = false
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight, dirLightHelper)

const spotLight = new SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2)
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6;
scene.add(spotLight.target)
scene.add(spotLight)
const spotLightHelper = new CameraHelper(spotLight.shadow.camera);
spotLightHelper.visible = false;
scene.add(spotLightHelper)
/**
 * Materials
 */
const material = new MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const plane = new Mesh(
    new PlaneBufferGeometry(5, 5),
    material
)

const sphere = new Mesh(
    new SphereBufferGeometry(0.5, 32, 32),
    material
)

sphere.castShadow = true
plane.receiveShadow = true;

plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5


const sphereShadow = new Mesh(new PlaneBufferGeometry(1, 1), new MeshStandardMaterial({
    alphaMap: simpleShadow,
    color: 0x000000,
    transparent: true
}))
sphereShadow.rotation.x = - Math.PI * .5
sphereShadow.position.y = plane.position.y + .01

scene.add(sphereShadow)
scene.add(sphere, plane)

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
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = PCFShadowMap;
/**
 * Animate
 */
const clock = new Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
    sphereShadow.position.z = sphere.position.z
    sphereShadow.position.x = sphere.position.x
    sphereShadow.material.opacity = (1 - sphere.position.y ) *.8
    sphereShadow.scale.x = 1 + sphere.position.y * .6
    sphereShadow.scale.y = 1 + sphere.position.y * .6
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()