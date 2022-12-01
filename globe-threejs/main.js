import * as THREE from 'three'
import gsap from 'gsap'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vertexShader from './Shaders/vertex.glsl'
import fragmentShader from './Shaders/fragment.glsl'
import atmosphereVertexShader from './Shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './Shaders/atmosphereFragment.glsl'

const canvasContainer = document.querySelector('#canvas-container')

import { Float32BufferAttribute } from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth / canvasContainer.offsetHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('canvas')
})
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)
// document.body.appendChild(renderer.domElement)


// Orbit Control

// const controls = new OrbitControls(camera, renderer.domElement)

// create a sphere

const sphere = new THREE.Mesh(new THREE.
  SphereGeometry(5, 64, 64),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load('globeuv.jpg')
      }
    }
  }))

scene.add(sphere)

// atmosphere

const atmosphere = new THREE.Mesh(new THREE.
  SphereGeometry(5, 64, 64),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  }))

scene.add(atmosphere)

atmosphere.scale.set(1.1, 1.1, 1.1)

camera.position.z = 15
// console.log(sphere)

// star

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})

const starVertices = []
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.3) * 2000
  const y = (Math.random() - 0.6) * 2000
  const z = -Math.random() * 2000
  starVertices.push(x, y, z)
}

starGeometry.setAttribute('position', new Float32BufferAttribute(starVertices, 3))

// console.log(starVertices)

const stars = new THREE.Points(
  starGeometry, starMaterial
)
scene.add(stars)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const mouse = {
  x: undefined,
  y: undefined
}

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  sphere.rotation.y += 0.003
  gsap.to(group.rotation, {
    x: -mouse.y * 0.3,
    y: mouse.x * 0.5,
    duration: 2
  })
}


addEventListener('mousemove', () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
  // console.log(mouse)
})


animate()