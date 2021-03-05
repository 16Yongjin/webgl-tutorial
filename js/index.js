import { Camera } from './camera'
import { Mesh } from './mesh'
import { Light } from './light'
import { Renderer } from './renderer'
import { ShaderProgram } from './shader'

const renderer = new Renderer(document.getElementById('webgl-canvas'))
renderer.setClearColor(100, 149, 237)
const gl = renderer.context

const objects = []

Mesh.load(gl, '/assets/sphere.obj', '/assets/diffuse.png').then((mesh) =>
  objects.push(mesh)
)

ShaderProgram.load(
  gl,
  '/shaders/basic.vert',
  '/shaders/basic.frag'
).then((shader) => renderer.setShader(shader))

const camera = new Camera()
camera.setOrthographic(16, 10, 10)

const light = new Light()

const loop = () => {
  renderer.render(camera, light, objects)
  camera.position = camera.position.rotateY(Math.PI / 120)
  camera.position = camera.position.rotateX(Math.PI / 120)
  requestAnimationFrame(loop)
}

loop()
