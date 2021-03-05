export class Trasnformation {
  constructor() {
    this.fields = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  }

  /**
   *
   * @param {Trasnformation} t
   */
  mult(t) {
    const output = new Trasnformation()
    for (let row = 0; row < 4; ++row) {
      for (let col = 0; col < 4; ++col) {
        let sum = 0
        for (let k = 0; k < 4; ++k) {
          sum += this.fields[k * 4 + row] * t.fields[col * 4 + k]
        }
        output.fields[col * 4 + row] = sum
      }
    }
    return output
  }

  translate(x, y, z) {
    const matrix = new Trasnformation()
    matrix.fields[12] = Number(x) || 0
    matrix.fields[13] = Number(y) || 0
    matrix.fields[14] = Number(z) || 0
    return this.mult(matrix)
  }

  scale(x, y, z) {
    const matrix = new Trasnformation()
    matrix.fields[0] = Number(x) || 0
    matrix.fields[5] = Number(y) || 0
    matrix.fields[10] = Number(z) || 0
    return this.mult(matrix)
  }

  rotateX(angle) {
    angle = Number(angle) || 0
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    const matrix = new Trasnformation()
    matrix.fields[5] = c
    matrix.fields[10] = c
    matrix.fields[9] = -s
    matrix.fields[6] = s
    return this.mult(matrix)
  }

  rotateY(angle) {
    angle = Number(angle) || 0
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    const matrix = new Trasnformation()
    matrix.fields[0] = c
    matrix.fields[10] = c
    matrix.fields[2] = -s
    matrix.fields[8] = s
    return this.mult(matrix)
  }

  rotateZ(angle) {
    angle = Number(angle) || 0
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    const matrix = new Trasnformation()
    matrix.fields[0] = c
    matrix.fields[5] = c
    matrix.fields[4] = -s
    matrix.fields[1] = s
    return this.mult(matrix)
  }

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {WebGLUniformLocation} uniform
   * @param {*} transpose
   */
  sendToGpu(gl, uniform, transpose = false) {
    gl.uniformMatrix4fv(uniform, transpose, new Float32Array(this.fields))
  }
}
