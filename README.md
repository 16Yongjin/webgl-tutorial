# WebGL 튜토리얼

from: [3D Graphics: A WebGL Tutorial](https://www.toptal.com/javascript/3d-graphics-a-webgl-tutorial)

## 실행

```
yarn

yarn dev
```

## 작동과정

### 1. Mesh 생성

1. OBJ 모델과 이미지 텍스쳐 불러오기
2. OBJ 파일 내 Vertex 값 파싱해서 Geometry 생성
3. Geometry와 Texture를 합쳐서 Mesh 생성

### 2. Shader 프로그램 생성

1. Vertex 쉐이더와 Fragment 쉐이더 코드 파일 불러오기
2. 각 쉐이더 코드 컴파일 후 쉐이더 프로그램 생성
3. 쉐이더 코드의 `attribute`와 `uniform` 변수에 연결할 포인터 인덱스 초기화
4. `draw` 호출 시 position, normal, uv 값을 Vertext 버퍼에 넣고 쉐이더 프로그램에 바인딩해서 `gl.drawArrays`로 삼각형들을 그림

### 3. Camera 생성

1. 위치와 방향을 나타내는 4x4 매트릭스 초기화
2. `use` 호출 시 쉐이더 프로그램의 `projection`과 `view` 값 바인딩

### 4. Light 생성

1. 빛의 방향을 나타내는 `Vector3`와 주변광(최소 밝기) 비율 초기화
2. `use` 호출 시 쉐이더 프로그램의 `lightDirection`과 `ambientLight` 값 바인딩

#### 5. 렌더링

1. `camera`, `light`, `mesh` 각 구성요소의 `use`나 `draw` 함수 호출
