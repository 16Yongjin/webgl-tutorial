import { ShaderProgram } from './shader'
import { Texture } from './texture'
import { Trasnformation } from './transform'

export class Vector2 {
  constructor(x, y) {
    this.x = Number(x) || 0
    this.y = Number(y) || 0
  }
}

export class Vector3 {
  constructor(x, y, z) {
    this.x = Number(x) || 0
    this.y = Number(y) || 0
    this.z = Number(z) || 0
  }
}

export class Vertex {
  constructor(
    position = new Vector3(),
    normal = new Vector3(),
    uv = new Vector2()
  ) {
    this.position = position
    this.normal = normal
    this.uv = uv
  }
}

export class Face {
  /**
   * @param {Vertex[]} vertices
   */
  constructor(vertices = []) {
    this.vertices = vertices
  }
}

export class Geometry {
  /**
   * @param {Face[]} faces
   */
  constructor(faces = []) {
    this.faces = faces
  }

  get vertexCount() {
    return this.faces.length * 3
  }

  get positions() {
    return this.faces.flatMap((face) =>
      face.vertices.flatMap(({ position: { x, y, z } }) => [x, y, z])
    )
  }

  get normals() {
    return this.faces.flatMap((face) =>
      face.vertices.flatMap(({ normal: { x, y, z } }) => [x, y, z])
    )
  }

  get uvs() {
    return this.faces.flatMap((face) =>
      face.vertices.flatMap(({ uv: { x, y } }) => [x, y])
    )
  }

  /**
   * OBJ 문자열을 파싱합니다.
   *
   * @param {string} src
   */
  static parseOBJ(src) {
    const POSITION = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
    const NORMAL = /^vn\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
    const UV = /^vt\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
    const FACE = /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/

    const lines = src.split('\n')

    const positions = []
    const uvs = []
    const normals = []
    const faces = []

    const parseVector3 = (x, y, z) =>
      new Vector3(parseFloat(x), parseFloat(y), parseFloat(z))
    const parseVector2 = (x, y) => new Vector2(parseFloat(x), parseFloat(y))

    lines.forEach((line) => {
      let result
      if ((result = POSITION.exec(line)) !== null) {
        const [_, x, y, z] = result
        positions.push(parseVector3(x, y, z))
      } else if ((result = NORMAL.exec(line)) !== null) {
        const [_, x, y, z] = result
        normals.push(parseVector3(x, y, z))
      } else if ((result = UV.exec(line)) !== null) {
        const [_, x, y] = result
        uvs.push(parseVector2(x, y))
      } else if ((result = FACE.exec(line)) !== null) {
        const vertices = []
        for (let i = 1; i < 10; i += 3) {
          const part = result.slice(i, i + 3)
          const position = positions[parseInt(part[0]) - 1]
          const uv = uvs[parseInt(part[1]) - 1]
          const normal = normals[parseInt(part[2]) - 1]
          vertices.push(new Vertex(position, normal, uv))
        }
        faces.push(new Face(vertices))
      }
    })

    return new Geometry(faces)
  }

  static async loadOBJ(url) {
    const res = await fetch(url)
    const text = await res.text()
    return Geometry.parseOBJ(text)
  }
}

export class VBO {
  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {ArrayLike} data
   * @param {*} count
   */
  constructor(gl, data, count) {
    const bufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    this.gl = gl
    this.size = data.length / count
    this.count = count
    this.data = bufferObject
  }

  bindToAttribute(attribute) {
    const gl = this.gl
    // 버퍼 객체 설정
    gl.bindBuffer(gl.ARRAY_BUFFER, this.data)
    // 쉐이더에 애트리뷰트 설정
    gl.enableVertexAttribArray(attribute)
    // 애트리뷰트 배열의 포맷 설정
    gl.vertexAttribPointer(attribute, this.size, gl.FLOAT, false, 0, 0)
  }

  destroy() {
    this.gl.deleteBuffer(this.data)
  }
}

export class Mesh {
  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {Geometry} geometry
   * @param {Texture} texture
   */
  constructor(gl, geometry, texture) {
    const vertexCount = geometry.vertexCount
    this.positions = new VBO(gl, geometry.positions, vertexCount)
    this.normals = new VBO(gl, geometry.normals, vertexCount)
    this.uvs = new VBO(gl, geometry.uvs, vertexCount)
    this.texture = texture
    this.vertexCount = vertexCount
    this.position = new Trasnformation()
    this.gl = gl
  }

  /**
   *
   * @param {ShaderProgram} shaderProgram
   */
  draw(shaderProgram) {
    this.positions.bindToAttribute(shaderProgram.position)
    this.normals.bindToAttribute(shaderProgram.normal)
    this.uvs.bindToAttribute(shaderProgram.uv)
    this.position.sendToGpu(this.gl, shaderProgram.model)
    this.texture.use(shaderProgram.diffuse, 0)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount)
  }

  destroy() {
    this.positions.destroy()
    this.normals.destroy
    this.uvs.destroy()
  }

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {string} modelUrl
   * @param {string} textureUrl
   */
  static async load(gl, modelUrl, textureUrl) {
    const [geometry, texture] = await Promise.all([
      Geometry.loadOBJ(modelUrl),
      Texture.load(gl, textureUrl),
    ])
    return new Mesh(gl, geometry, texture)
  }
}
