export class Texture {
  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {TexImageSource} image
   */
  constructor(gl, image) {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    // 픽셀 사이의 값을 가져올 때 그 중간 값을 계산하는 방법 설정
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    this.data = texture
    this.gl = gl
  }

  /**
   *
   * @param {WebGLUniformLocation} uniform
   * @param {number} binding
   */
  use(uniform, binding) {
    binding = Number(binding) || 0
    const gl = this.gl
    gl.activeTexture(gl[`TEXTURE${binding}`])
    gl.bindTexture(gl.TEXTURE_2D, this.data)
    gl.uniform1i(uniform, binding)
  }

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {string} url
   * @return {Promise<Texture>}
   */
  static load(gl, url) {
    return new Promise((resolve) => {
      const image = new Image()
      image.onload = () => resolve(new Texture(gl, image))
      image.src = url
    })
  }
}
