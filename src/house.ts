import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AmbientLight, BoxBufferGeometry, Clock, ConeGeometry, DirectionalLight, Float32BufferAttribute, Fog, Group, Mesh, MeshStandardMaterial, PCFSoftShadowMap, PerspectiveCamera, PlaneBufferGeometry, PointLight, RepeatWrapping, Scene, Sphere, SphereBufferGeometry, TextureLoader, WebGLRenderer } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = <HTMLCanvasElement>document.querySelector('#bg')

// FOG
const fog = new Fog('#262837', 2, 15);

// Scene
const scene = new Scene()
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new TextureLoader()

const colorDoorTexture = textureLoader.load('/textures/door/color.jpg');
const alphaDoorTexture = textureLoader.load('/textures/door/alpha.jpg');
const metalnessDoorTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessDoorTexture = textureLoader.load('/textures/door/roughness.jpg');
const ambientOcclusionDoorTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const normalDoorTexture = textureLoader.load('/textures/door/normal.jpg');
const heightDoorTexture = textureLoader.load('/textures/door/height.jpg');

const colorBricksTexture = textureLoader.load('/textures/bricks/color.jpg');
const roughnessBricksTexture = textureLoader.load('/textures/bricks/roughness.jpg');
const ambientOcclusionBricksTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const normalBricksTexture = textureLoader.load('/textures/bricks/normal.jpg');

const colorGrassTexture = textureLoader.load('/textures/grass/color.jpg');
const roughnessGrassTexture = textureLoader.load('/textures/grass/roughness.jpg');
const ambientOcclusionGrassTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
const normalGrassTexture = textureLoader.load('/textures/grass/normal.jpg');

colorGrassTexture.repeat.set(12, 12)
roughnessGrassTexture.repeat.set(12, 12)
normalGrassTexture.repeat.set(12, 12)
ambientOcclusionGrassTexture.repeat.set(12, 12)
colorGrassTexture.wrapS = RepeatWrapping
colorGrassTexture.wrapT = RepeatWrapping
roughnessGrassTexture.wrapS = RepeatWrapping
roughnessGrassTexture.wrapT = RepeatWrapping
normalGrassTexture.wrapS = RepeatWrapping
normalGrassTexture.wrapT = RepeatWrapping
ambientOcclusionGrassTexture.wrapS = RepeatWrapping
ambientOcclusionGrassTexture.wrapT = RepeatWrapping
// Floor
const floor = new Mesh(
    new PlaneBufferGeometry(40, 40),
    new MeshStandardMaterial({
        normalMap: normalGrassTexture,
        map: colorGrassTexture,
        aoMap: ambientOcclusionGrassTexture,
        roughnessMap: roughnessGrassTexture
    })
)

floor.geometry.setAttribute(
    'uv2',
    new Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow = true;

/**
 * House 
 */

const house = new Group();

const walls = new Mesh(new BoxBufferGeometry(5, 3, 5), new MeshStandardMaterial({
    map: colorBricksTexture,
    normalMap: normalBricksTexture,
    aoMap: ambientOcclusionBricksTexture,
    roughnessMap: roughnessBricksTexture,
}))

walls.geometry.setAttribute(
    'uv2',
    new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.castShadow = true;
walls.receiveShadow = true;
walls.position.y = walls.geometry.parameters.height / 2

house.add(walls)

const roof = new Mesh(
    new ConeGeometry(
        walls.geometry.parameters.width * .75,
        walls.geometry.parameters.height * .3, 4, 1),
    new MeshStandardMaterial({ color: '#b35f45' })
)

roof.position.y = walls.geometry.parameters.height + roof.geometry.parameters.height / 2;
roof.rotation.y = Math.PI / 4
house.add(roof)

const door = new Mesh(new PlaneBufferGeometry(2.4, 2.4, 100, 100), new MeshStandardMaterial({
    normalMap: normalDoorTexture,
    alphaMap: alphaDoorTexture,
    roughnessMap: roughnessDoorTexture,
    metalnessMap: metalnessDoorTexture,
    aoMap: ambientOcclusionDoorTexture,
    displacementMap: heightDoorTexture,
    map: colorDoorTexture,
    transparent: true,
    displacementScale: .1,
}));
door.geometry.setAttribute('uv2', new Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
door.position.y = door.geometry.parameters.height / 2;
door.position.z = walls.geometry.parameters.depth / 2 + .01;
house.add(door);
scene.add(house)

const bushGeometry = new SphereBufferGeometry(1, 16, 16);
const bushMaterial = new MeshStandardMaterial({ color: '#89c854' });

const bush1 = new Mesh(bushGeometry, bushMaterial);
const bush1Proportion = .75;
bush1.position.set(2, bush1.geometry.parameters.radius * bush1Proportion * .60, 3)
bush1.scale.set(bush1Proportion, bush1Proportion, bush1Proportion)

const bush2 = new Mesh(bushGeometry, bushMaterial);
const bush2Proportion = .35;
bush2.position.set(1.2, bush2.geometry.parameters.radius * bush2Proportion * .60, 3.5);
bush2.scale.set(bush2Proportion, bush2Proportion, bush2Proportion)

const bush3 = new Mesh(bushGeometry, bushMaterial);
const bush3Proportion = .6;
bush3.position.set(-2, bush3.geometry.parameters.radius * bush3Proportion * .60, 3);
bush3.scale.set(bush3Proportion, bush3Proportion, bush3Proportion)

const bush4 = new Mesh(bushGeometry, bushMaterial);
const bush4Proportion = .3;
bush4.position.set(-1.3, bush4.geometry.parameters.radius * bush4Proportion * .60, 3);
bush4.scale.set(bush4Proportion, bush4Proportion, bush4Proportion)

new Array(bush1, bush2, bush3, bush4).forEach(bush => {
    bush.castShadow = true;
    bush.receiveShadow = true;
});

house.add(bush1, bush2, bush3, bush4)

const graves = new Group();

const graveGeometry = new BoxBufferGeometry(.5, .9, .2);
const graveMaterial = new MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 30; i++) {
    const grave = new Mesh(graveGeometry, graveMaterial);
    grave.position.y = ((Math.random()) * + 1.3) * .3
    grave.rotation.x = (Math.random() - .5) * .45;
    grave.rotation.z = (Math.random() - .5) * .25;
    grave.rotation.y = (Math.random() - .5) * .3;
    const angle = Math.random() * Math.PI * 2;
    const radius = 4.5 + Math.random() * 4.5;
    const width = walls.geometry.parameters.width / 2;
    const depth = walls.geometry.parameters.depth / 2;
    const x = Math.sin(angle);
    const z = Math.cos(angle);
    grave.position.x = x * radius;
    grave.position.z = z * radius;
    grave.castShadow = true;
    // grave.receiveShadow = true;
    graves.add(grave);
}

scene.add(graves);
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
moonLight.castShadow = true;
scene.add(moonLight)

const doorLight = new PointLight('#ff7d46', 2, 10);
doorLight.position.set(door.position.x, door.geometry.parameters.height + .2, door.position.z + .1)
// doorLight.shadow.radius = 10
doorLight.castShadow = true;
house.add(doorLight)

const ghost1 = new PointLight('#ff00ff', 2, 3)
ghost1.castShadow = true;
const ghost2 = new PointLight('#00ffff', 2, 3)
ghost2.castShadow = true;
const ghost3 = new PointLight('#ffff00', 2, 3)
ghost3.castShadow = true;
scene.add(ghost1, ghost2, ghost3)
/**
 * Sizes
 */


doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

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
const camera = new PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 15
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
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
/**
 * Animate
 */
const clock = new Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    const ghost1Angle = elapsedTime;
    ghost1.position.x = Math.cos(ghost1Angle) * 5
    ghost1.position.z = Math.sin(ghost1Angle) * 5
    ghost1.position.y = Math.sin(ghost1Angle * 3)

    ghost2.position.x = Math.sin(Math.cos(- ghost1Angle / 5) * 4) * 7
    ghost2.position.z = Math.cos(Math.sin(- ghost1Angle / 5) * 5) * 7

    ghost3.position.x = Math.cos(Math.cos(- ghost1Angle / 10) * 4) * 7
    ghost3.position.z = Math.sin(Math.sin(- ghost1Angle / 10) * 5) * 7
    ghost3.position.y = Math.sin(ghost1Angle * 3)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()