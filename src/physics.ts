import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Body, Box, Constraint, ContactMaterial, DistanceConstraint, ICollisionEvent, Material, Plane, SAPBroadphase, Sphere, Vec3, World } from 'cannon'
import { BoxBufferGeometry, Color, Mesh, MeshStandardMaterial, MeshToonMaterial, SphereBufferGeometry, Vector3 } from 'three'
import chroma from 'chroma-js'

/**
 * Debug
 */

const pallete = chroma.scale(['orange', 'blue'])
    .mode('lch').colors(7).map(color => new Color(color));
console.log(pallete);

const gui = new dat.GUI()
const objects: [Body, Mesh][] = [];

const debugObj = {
    createSphere,
    createBox,
    reset: function () {
        for (const object of objectsToUpdate) {
            object.body.removeEventListener('collide', playHitSound)
            world.remove(object.body);
            scene.remove(object.mesh);
        }

    }
}

gui.add(debugObj, 'createSphere');
gui.add(debugObj, 'createBox');
gui.add(debugObj, 'reset');


const cursor = { x: 0, y: 0 };
window.addEventListener('mousemove', e => {
    cursor.x = e.clientX / window.innerWidth - .5
    cursor.y = -(e.clientY / window.innerHeight - .5)
})
/**
 * Base
 */
// Canvas
const canvas = <HTMLCanvasElement>document.querySelector('#bg')

// Scene
const scene = new THREE.Scene()

const world = new World();
world.allowSleep = true;
world.broadphase = new SAPBroadphase(world);

const mover = new Body();
const moverSphere = new Mesh(new SphereBufferGeometry(.5), new MeshToonMaterial({ color: 'cyan' }));
world.addBody(mover);
// scene.add(moverSphere)

mover.position.y = 2;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

const objectsToUpdate: { mesh: Mesh, body: Body }[] = []
/**
 * Test sphere
 */
const meshMaterial = new MeshStandardMaterial({
    metalness: .4,
    roughness: .4,
    envMap: environmentMapTexture
});

const sphereGeometry = new SphereBufferGeometry(1, 50, 50)
const boxGeometry = new BoxBufferGeometry(1, 1, 1);

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    })
)

floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5

// scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 10)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Physics

world.gravity.set(0, -9.82, 0);
const defaultMaterial = new Material('default');
const defaultContactMaterial = new ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        restitution: .3,
        friction: .1,
    }
)
world.defaultContactMaterial = defaultContactMaterial

const floorShape = new Plane();
const floorBody = new Body({
    mass: 0,
    shape: floorShape,
});
floorBody.quaternion.setFromAxisAngle(new Vec3(-1, 0, 0), Math.PI / 2);
// world.addBody(floorBody);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let prevElTime = 0;
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const timeSinceLastCalled = elapsedTime - prevElTime;
    prevElTime = elapsedTime;
    //update physics
    mover.position.x = cursor.x * 30
    mover.position.y = cursor.y * 30
    moverSphere.position.set(mover.position.x, mover.position.y, mover.position.z)
    world.step(1 / 60, timeSinceLastCalled);

    for (const obj of objectsToUpdate) {
        const { x, y, z } = obj.body.position;
        obj.mesh.position.set(x, y, z)
        const { x: qx, y: qy, z: qz, w: qw } = obj.body.quaternion
        obj.mesh.quaternion.set(qx, qy, qz, qw);
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

function createSphere (
    position: [
        number,
        number,
        number
    ] =
        [
            (Math.random() - .5) * 8,
            (Math.random()) * 8,
            (Math.random() - .5) * 5
        ]
) {
    
    const rand = Math.floor(Math.random() * (7 - 0) + 0);
    console.log('arg rad', rand);

    const material = new MeshToonMaterial({ color: pallete[rand] })
    const mesh = new Mesh(sphereGeometry, material)

    mesh.scale.set(rand, rand, rand);
    mesh.castShadow = true;
    mesh.position.set(...position)
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh)

    //cannon body
    const shape = new Sphere(rand);
    
    const body = new Body({
        mass: 1,
        position: new Vec3(...position),
        shape,
    })
    
    console.log(mesh.geometry.parameters.radius);
    console.log(body.shapes[0].boundingSphereRadius);
    

    const constraint = new DistanceConstraint(mover, body, .1, 2)
    world.addConstraint(constraint)

    world.addBody(body);
    objectsToUpdate.push({ mesh, body })
    return { mesh, shape, body }
}

function createBox (
    size: number = 1,
    position: [
        number,
        number,
        number
    ] =
        [
            (Math.random() - .5) * 8,
            (Math.random()) * 8,
            (Math.random() - .5) * 5
        ]
) {
    const mesh = new Mesh(boxGeometry, meshMaterial)

    mesh.scale.set(size, size, size);
    mesh.castShadow = true;
    mesh.position.set(...position)

    scene.add(mesh)

    //cannon body
    const shape = new Box(new Vec3(size / 2, size / 2, size / 2));
    const body = new Body({
        mass: 1,
        position: new Vec3(...position),
        shape,
    })

    body.addEventListener('collide', playHitSound)

    if (objectsToUpdate.length) {

        const constraint = new DistanceConstraint(objectsToUpdate[objectsToUpdate.length - 1].body, body, 1.5, .05)
        world.addConstraint(constraint)

    }

    world.addBody(body);
    objectsToUpdate.push({ mesh, body })

    return { mesh, shape, body }
}

function playHitSound (collision: ICollisionEvent) {
    const hitSound = new Audio('/sounds/hit.mp3');
    const impact = collision.contact.getImpactVelocityAlongNormal();

    if (impact <= 1.2) return;
    hitSound.volume = Math.floor(impact * 4 / 300);
    hitSound.currentTime = 0;
    hitSound.play()
}