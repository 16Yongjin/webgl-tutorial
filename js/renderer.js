import { Camera } from './camera'
import { Mesh } from './mesh'
import { Light } from './light'

export class Renderer {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    gl.enable(gl.DEPTH_TEST)
    this.gl = gl
  }

  setClearColor(red, green, blue, alpha = 1) {
    this.gl.clearColor(red / 255, green / 255, blue / 255, alpha)
  }

  get context() {
    return this.gl
  }

  /**
   *
   * @param {ShaderProgram} shader
   */
  setShader(shader) {
    this.shader = shader
  }

  /**
   *
   * @param {Camera} camera
   * @param {Light} light
   * @param {Mesh[]} objects
   */
  render(camera, light, objects) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    const shader = this.shader
    if (!shader) return

    shader.use()
    light.use(shader)
    camera.use(shader)
    objects.forEach((mesh) => mesh.draw(shader))
  }
}
