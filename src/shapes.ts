import { BoxGeometry, Mesh, TextureLoader, LoadingManager, MeshStandardMaterial, MirroredRepeatWrapping, NearestFilter, SphereBufferGeometry, PlaneBufferGeometry, TorusBufferGeometry, DoubleSide, MeshNormalMaterial, MeshMatcapMaterial, Vector2, MeshToonMaterial, BufferAttribute, CubeTextureLoader, Font, TextBufferGeometry, Material } from 'three'
import { orangeMatcap } from './materials';
import { getFont } from './text';

const loadingManager = new LoadingManager();
loadingManager.onStart = (url) => console.log(url)
loadingManager.onLoad = () => console.log('loaded')
loadingManager.onProgress = (url, loaded, total) => console.log('onprogress', url, loaded, total)
loadingManager.onError = () => console.log('errir')
const textureLoader = new TextureLoader(loadingManager)
const iceTexture = textureLoader.load('/textures/matcaps/ice.png');
const colorTexture = textureLoader.load('/textures/door/basecolor.jpg',
	undefined,
	undefined,
	err => {
		console.log('err', err)
	});

const opacityTexture = textureLoader.load('/textures/door/opacity.jpg')
const heightTexture = textureLoader.load('/textures/door/height.png')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const amOccTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metallicTexture = textureLoader.load('/textures/door/metallic.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')

const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
function getBasicMaterial () {


	const material = new MeshStandardMaterial({
		map: colorTexture,
		aoMap: amOccTexture,
		transparent: true,
		alphaMap: opacityTexture,
		metalnessMap: metallicTexture,
		normalMap: normalTexture,
		bumpMap: heightTexture,
		roughnessMap: roughnessTexture,
		aoMapIntensity: 100,
	});
	return material;
}

const cubeTextureLoader = new CubeTextureLoader();

const envMap = cubeTextureLoader.load([
	'/textures/environmentMaps/0/px.jpg',
	'/textures/environmentMaps/0/nx.jpg',
	'/textures/environmentMaps/0/py.jpg',
	'/textures/environmentMaps/0/ny.jpg',
	'/textures/environmentMaps/0/pz.jpg',
	'/textures/environmentMaps/0/nz.jpg',
])

function getNormalMaterial () {
	const material = new MeshNormalMaterial({
		// wireframe: true,
		flatShading: true
	});

	return material;
}

function getMatcapMaterial () {
	const iceT = textureLoader.load('/textures/matcaps/ice.png')
	const goldT = textureLoader.load('/textures/matcaps/gold.png')
	const normal = textureLoader.load('textures/lizard/NRM.jpg');
	const disp = textureLoader.load('textures/lizard/DISP.png');
	const iceM = new MeshMatcapMaterial({
		matcap: iceT,
		// flatShading: true
	})

	const goldM = new MeshMatcapMaterial({
		matcap: goldT,
		normalMap: normal,
		displacementMap: disp,
		// normalScale: new Vector2(.3, .3),
		// flatShading: true
	})
	return { ice: iceM, gold: goldM }
}

function getToonMaterial () {
	const material = new MeshToonMaterial({
		transparent: true,
		opacity: .4
		// gradientMap: gradientTexture
	})
	// gradientTexture.magFilter = NearestFilter
	return material;
	// gradientTexture.minFilter = NearestFilter
}

const standardMaterial = new MeshStandardMaterial({
	roughness: 0,
	metalness: 1,
	envMap: envMap
});

export function makeCustom () {

	// const verticesArray = []

	// for (let i = 0; i < 100; i++) {
	// 	for (let j = 0; j < 3; j++) {
	// 		verticesArray.push(...[
	// 			(Math.round(Math.random()) - 0.5) * 4,
	// 			(Math.round(Math.random()) - 0.5) * 4,
	// 			(Math.round(Math.random()) - 0.5) * 4,
	// 		])
	// 	}
	// }
	// const vertices = Float32Array.from(verticesArray);

	const geometry = new BoxGeometry(30, 30, 30);


	// colorTexture.repeat.x = 2
	// colorTexture.repeat.y = 2
	// colorTexture.offset.x = 0
	colorTexture.center.x = .5
	colorTexture.center.y = .5
	colorTexture.minFilter = NearestFilter
	// colorTexture.rotation = Math.PI * .25
	colorTexture.wrapS = MirroredRepeatWrapping;
	const mesh = new Mesh(geometry, getNormalMaterial());

	return { mesh, material: getBasicMaterial(), geometry };
}

export function makeSphere () {
	const geometry = new SphereBufferGeometry(1, 100, 100);
	const mesh = new Mesh(geometry, standardMaterial);
	return { mesh, geometry, material: standardMaterial };
}

export function makePlane () {
	const material = standardMaterial
	const geometry = new PlaneBufferGeometry(10, 10, 100, 100);
	const mesh = new Mesh(geometry, material);
	const { uv } = geometry.attributes;
	geometry.setAttribute('uv2', new BufferAttribute(uv.array, 2))
	// material.aoMap = amOccTexture
	// material.alphaMap = opacityTexture
	// material.displacementMap = heightTexture
	// material.metalnessMap = metallicTexture
	// material.roughnessMap = roughnessTexture
	// material.normalMap = normalTexture
	// material.transparent = true
	// material.envMap = envMap
	return { mesh, geometry, material: material }
}

export function makeTorus (type: 'gold' | 'ice') {
	const geometry = new TorusBufferGeometry(2, .5, 16, 16);
	const mesh = new Mesh(geometry, getToonMaterial());
	return { mesh, geometry, material: getToonMaterial() }
}


export const loadText = (text: string, size: number, material: Material): Promise<Mesh> => {
	return new Promise((res) => {

		getFont.then((font: Font) => {
			const bSize = 0.02
			const bThickness = 0.03

			const textGeometry = new TextBufferGeometry(text, {
				size: size,
				height: .2,
				font,
				bevelThickness: .03,
				bevelSize: .02,
				bevelOffset: 0,
				bevelSegments: 4,
				bevelEnabled: true,
				curveSegments: 4,
			});

			textGeometry.center()
			textGeometry.computeBoundingBox();
			const mesh = new Mesh(textGeometry, material);
			
			res(mesh)
		})
	})
}
