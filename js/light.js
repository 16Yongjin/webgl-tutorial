import { Vector3 } from './mesh'
import { ShaderProgram } from './shader'

export class Light {
  constructor() {
    this.lightDirection = new Vector3(-1, -1, -1)
    this.ambientLight = 0.3
  }

  /**
   *
   * @param {ShaderProgram} shaderProgram
   */
  use(shaderProgram) {
    const { x, y, z } = this.lightDirection
    const gl = shaderProgram.gl
    gl.uniform3f(shaderProgram.lightDirection, x, y, z)
    gl.uniform1f(shaderProgram.ambientLight, this.ambientLight)
  }
}
