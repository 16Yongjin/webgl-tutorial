import { ShaderProgram } from './shader'
import { Trasnformation } from './transform'

export class Camera {
  constructor() {
    this.position = new Trasnformation()
    this.projection = new Trasnformation()
  }

  setOrthographic(width, height, depth) {
    this.projection = new Trasnformation()
    this.projection.fields[0] = 2 / width
    this.projection.fields[5] = 2 / height
    this.projection.fields[10] = -2 / depth
  }

  setPerspective(verticalFov, aspectRatio, near, far) {
    const heightDiv2n = Math.tan((verticalFov * Math.PI) / 360)
    const widthDiv2n = aspectRatio * heightDiv2n
    this.projection = new Trasnformation()
    this.projection.fields[0] = 1 / heightDiv2n
    this.projection.fields[5] = 1 / widthDiv2n
    this.projection.fields[10] = (far + near) / (near - far)
    this.projection.fields[11] = -1
    this.projection.fields[14] = (2 * far * near) / (near - far)
    this.projection.fields[15] = 0
  }

  getInversePosition() {
    const orig = this.position.fields
    const dest = new Trasnformation()
    const [x, y, z] = [orig[12], orig[13], orig[14]]
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        dest.fields[i * 4 + j] = orig[i + j * 4]
      }
    }

    return dest.translate(-x, -y, -z)
  }

  /**
   *
   * @param {ShaderProgram} shaderProgram
   */
  use(shaderProgram) {
    this.projection.sendToGpu(shaderProgram.gl, shaderProgram.projection)
    this.getInversePosition().sendToGpu(shaderProgram.gl, shaderProgram.view)
  }
}
