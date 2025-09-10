// Vertex shader source code
const vertexShaderSource3 = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main() {
        gl_Position = a_position;
        v_color = a_color;
    }
`;

// Fragment shader source code
const fragmentShaderSource3 = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
        gl_FragColor = v_color;
    }
`;

function createShader3(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram3(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error linking program:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

// Gera os vértices de um quadrado centralizado em (cx, cy) com tamanho size
function squareVertices3(size = 1.0, cx = 0.0, cy = 0.0) {
  const s = size / 2;
  return new Float32Array([
    cx - s, cy + s, // canto superior esquerdo
    cx + s, cy + s, // canto superior direito
    cx + s, cy - s, // canto inferior direito
    cx - s, cy - s, // canto inferior esquerdo
    cx + s, cy - s, // canto inferior direito (repetido)
    cx - s, cy + s  // canto superior esquerdo (repetido)
  ]);
}

function squareColors3() {
  let color = [Math.random(), Math.random(), Math.random()];
  let colorValues = [];
  for (let i = 0; i < 6; i++) {
    colorValues.push(color[0], color[1], color[2]); // Push individual RGB values
  }
  return new Float32Array(colorValues);
}

function drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, size, cx, cy) {
  // Gera vértices para o quadrado na posição e tamanho desejados
  let vertices = squareVertices3(size, cx, cy);
  gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);

  // Gera cores aleatórias para o quadrado
  let colors = squareColors3();
  gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLocation);

  // Desenha o quadrado
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function main3() {
  const canvas = document.getElementById('webgl-canvas');
  const gl = canvas.getContext('webgl');

  if (!gl) {
    console.error('WebGL not supported');
    return;
  }

  const vertexShader = createShader3(gl, gl.VERTEX_SHADER, vertexShaderSource3);
  const fragmentShader = createShader3(gl, gl.FRAGMENT_SHADER, fragmentShaderSource3);

  const program = createProgram3(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const colorLocation = gl.getAttribLocation(program, 'a_color');

  const VertexBuffer = gl.createBuffer();
  const ColorBuffer = gl.createBuffer();

  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black background
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Corpo do robô (quadrado maior, centralizado)
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.9, 0.0, 0.0);

  // Cabeça do robô (quadrado menor, acima do corpo)
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.6, 0.0, 0.7);

  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.3, -0.3, -0.5);
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.3, 0.3, -0.5);
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.3, -0.3, -0.8);
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.3, 0.3, -0.8);

  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.3, 0.5, 0.3);
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.3, -0.5, 0.3);
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.3, 0.8, 0.3);
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.3, -0.8, 0.3);

  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.2, 0.2, 0.7);
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.2, -0.2, 0.7);

  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.1, 0.2, 0.7);
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.1, -0.2, 0.7);

  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.1, 0.1, 0.5);
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.1, 0, 0.5);
  drawSquare(gl, positionLocation, colorLocation, VertexBuffer, ColorBuffer, 0.1, -0.1, 0.5);
}

// Start the application when the page loads
window.addEventListener('load', main3);
