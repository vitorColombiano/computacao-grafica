// GL_LINES Example - Separate line segments
const vertexShaderSourceLines = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;

const fragmentShaderSourceLines = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // Magenta color
    }
`;

function createShaderLines(gl, type, source) {
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

function createProgramLines(gl, vertexShader, fragmentShader) {
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

function mainLines() {
  const canvas = document.getElementById('webgl-flor');
  const gl = canvas.getContext('webgl');

  if (!gl) {
    console.error('WebGL not supported');
    return;
  }

  const vertexShader = createShaderLines(gl, gl.VERTEX_SHADER, vertexShaderSourceLines);
  const fragmentShader = createShaderLines(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceLines);
  const program = createProgramLines(gl, vertexShader, fragmentShader);

  // Vertices da reta (caule)
  const lineVertices = new Float32Array([
    0, 0.5,  // topo
    0, -0.8, // base
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, lineVertices, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'a_position');

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Desenha a reta (caule)
  gl.drawArrays(gl.LINES, 0, 2);

  // Vertices do quadrado (miolo da flor) no topo da reta
  const squareSize = 0.15;
  const cx = 0.0, cy = 0.5; // centro do quadrado no topo da reta
  const half = squareSize / 2;
  const squareVertices = new Float32Array([
    cx - half, cy + half, // topo esquerdo
    cx + half, cy + half, // topo direito
    cx + half, cy - half, // base direito
    cx - half, cy - half, // base esquerdo
  ]);

  // Novo buffer para o quadrado
  const squareBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);

  // Desenha o quadrado (miolo da flor)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

window.addEventListener('load', mainLines);