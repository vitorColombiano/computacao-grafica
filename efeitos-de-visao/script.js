/**
 * Efeitos de Visão - Diferentes Configurações de Câmera
 * Implementação com flor animada e múltiplas vistas
 */

// Biblioteca WebGLLib adaptada
window.WebGLLib = window.WebGLLib || {};

// Vertex shader com suporte a matrizes de transformação
const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_viewMatrix;
    uniform mat4 u_projectionMatrix;
    uniform mat4 u_modelMatrix;
    varying vec4 v_color;

    void main() {
        gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;
        v_color = a_color;
    }
`;

// Fragment shader
const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;

    void main() {
        gl_FragColor = v_color;
    }
`;

// Variáveis globais
let gl, program;
let canvas;
let animationId;
let currentView = 1;
let isAnimating = true;
let rotationAngle = 0;
let zoomLevel = 1.0;

// Matrizes de transformação
let viewMatrix, projectionMatrix, modelMatrix;

// Tipos de vista
const viewTypes = {
    1: { name: "Vista Frontal (Front View)", description: "Câmera olhando diretamente para o objeto" },
    2: { name: "Vista Superior (Top View)", description: "Câmera olhando de cima para baixo" },
    3: { name: "Vista Lateral Direita (Right Side View)", description: "Câmera olhando do lado direito" },
    4: { name: "Vista Isométrica (Isometric View)", description: "Vista 3D com ângulo isométrico" },
    5: { name: "Vista Perspectiva (Perspective View)", description: "Projeção perspectiva com profundidade" },
    6: { name: "Vista Ortográfica (Orthographic View)", description: "Projeção ortográfica sem distorção" }
};

/**
 * Funções de Matriz (implementação básica para WebGL)
 */
function createMatrix4() {
    return new Float32Array(16);
}

function identityMatrix4(out) {
    out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
    out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
    return out;
}

function rotateZ(out, rad) {
    let c = Math.cos(rad);
    let s = Math.sin(rad);

    out[0] = c; out[1] = s; out[2] = 0; out[3] = 0;
    out[4] = -s; out[5] = c; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
    return out;
}

function scale(out, sx, sy, sz) {
    out[0] = sx; out[1] = 0; out[2] = 0; out[3] = 0;
    out[4] = 0; out[5] = sy; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = sz; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
    return out;
}

function translate(out, x, y, z) {
    identityMatrix4(out);
    out[12] = x;
    out[13] = y;
    out[14] = z;
    return out;
}

function lookAt(out, eyeX, eyeY, eyeZ, targetX, targetY, targetZ, upX, upY, upZ) {
    // Simplified lookAt implementation
    identityMatrix4(out);

    // For different views, we'll use simple transformations
    // This is a simplified version for 2D-like transformations
    let dx = targetX - eyeX;
    let dy = targetY - eyeY;
    let dz = targetZ - eyeZ;

    // Normalize and create basic view transformations
    if (Math.abs(dx) > Math.abs(dy)) {
        // Side view
        if (dx > 0) {
            out[0] = 0; out[4] = 1; // Rotate 90 degrees
            out[1] = -1; out[5] = 0;
        } else {
            out[0] = 0; out[4] = -1; // Rotate -90 degrees
            out[1] = 1; out[5] = 0;
        }
    } else if (Math.abs(dy) > Math.abs(dx)) {
        // Top/bottom view
        if (dy > 0) {
            out[1] = 0; out[5] = 0; out[9] = 1; // Flip Y
            out[6] = -1; out[10] = 0;
        }
    }

    return out;
}

function ortho(out, left, right, bottom, top, near, far) {
    identityMatrix4(out);
    out[0] = 2 / (right - left);
    out[5] = 2 / (top - bottom);
    out[10] = -2 / (far - near);
    out[12] = -(right + left) / (right - left);
    out[13] = -(top + bottom) / (top - bottom);
    out[14] = -(far + near) / (far - near);
    return out;
}

function perspective(out, fovy, aspect, near, far) {
    identityMatrix4(out);
    let f = 1.0 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[5] = f;
    out[10] = (far + near) / (near - far);
    out[11] = -1;
    out[14] = (2 * far * near) / (near - far);
    out[15] = 0;
    return out;
}

/**
 * Funções da biblioteca WebGL adaptadas
 */
WebGLLib.createShader = function(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};

WebGLLib.createProgram = function(gl, vertexShader, fragmentShader) {
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
};

function circleVertices(cx, cy, radius) {
    const vertices = [];
    const numSides = 30;

    vertices.push(cx, cy, 0.0, 1.0); // Centro (x, y, z, w)

    for (let i = 0; i <= numSides; i++) {
        const angle = i * 2 * Math.PI / numSides;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        vertices.push(x, y, 0.0, 1.0);
    }

    return new Float32Array(vertices);
}

WebGLLib.createCircle = function(gl, data, colors, program) {
    const cx = data[0];
    const cy = data[1];
    const radius = data[2];

    const vertices = circleVertices(cx, cy, radius);

    const colorsArray = [];
    for (let i = 0; i < vertices.length / 4; i++) {
        colorsArray.push(colors[0], colors[1], colors[2], 1.0);
    }

    const vertexBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsArray), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 4);
};

WebGLLib.createSquare = function(gl, vertices, colors, program) {
    let points = [];

    for(let i = 0; i < vertices.length; i += 4) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const width = vertices[i + 2];
        const height = vertices[i + 3];

        // Dois triângulos para formar um quadrado
        points.push(
            x, y, 0.0, 1.0,
            x + width, y, 0.0, 1.0,
            x, y + height, 0.0, 1.0,

            x + width, y, 0.0, 1.0,
            x, y + height, 0.0, 1.0,
            x + width, y + height, 0.0, 1.0
        );
    }

    const vertexBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, points.length / 4);
};

/**
 * Configura as diferentes vistas de câmera
 */
function setupCameraView(viewType) {
    viewMatrix = createMatrix4();
    projectionMatrix = createMatrix4();

    const aspect = canvas.width / canvas.height;

    switch(viewType) {
        case 1: // Vista Frontal
            identityMatrix4(viewMatrix);
            ortho(projectionMatrix, -2 * zoomLevel, 2 * zoomLevel, -2 * zoomLevel, 2 * zoomLevel, -1, 1);
            break;

        case 2: // Vista Superior
            lookAt(viewMatrix, 0, 1, 0, 0, 0, 0, 0, 0, -1);
            ortho(projectionMatrix, -2 * zoomLevel, 2 * zoomLevel, -2 * zoomLevel, 2 * zoomLevel, -1, 1);
            break;

        case 3: // Vista Lateral Direita
            lookAt(viewMatrix, 1, 0, 0, 0, 0, 0, 0, 1, 0);
            ortho(projectionMatrix, -2 * zoomLevel, 2 * zoomLevel, -2 * zoomLevel, 2 * zoomLevel, -1, 1);
            break;

        case 4: // Vista Isométrica
            // Rotação isométrica aproximada
            identityMatrix4(viewMatrix);
            let tempMatrix = createMatrix4();

            // Rotação em X (30 graus)
            let angleX = Math.PI / 6;
            viewMatrix[5] = Math.cos(angleX);
            viewMatrix[6] = Math.sin(angleX);
            viewMatrix[9] = -Math.sin(angleX);
            viewMatrix[10] = Math.cos(angleX);

            ortho(projectionMatrix, -2 * zoomLevel * aspect, 2 * zoomLevel * aspect, -2 * zoomLevel, 2 * zoomLevel, -1, 1);
            break;

        case 5: // Vista Perspectiva
            identityMatrix4(viewMatrix);
            perspective(projectionMatrix, Math.PI / 4, aspect, 0.1, 10.0);

            // Mover para trás para ver o objeto
            viewMatrix[14] = -3 * zoomLevel;
            break;

        case 6: // Vista Ortográfica (similar à frontal, mas com zoom diferente)
            identityMatrix4(viewMatrix);
            ortho(projectionMatrix, -1.5 * zoomLevel * aspect, 1.5 * zoomLevel * aspect, -1.5 * zoomLevel, 1.5 * zoomLevel, -1, 1);
            break;
    }
}

/**
 * Desenha a flor com animação
 */
function drawFlower() {
    // Limpar canvas
    gl.clearColor(0.53, 0.81, 0.92, 1.0); // Azul céu
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Usar programa shader
    gl.useProgram(program);

    // Configurar matriz de modelo com rotação
    modelMatrix = createMatrix4();
    rotateZ(modelMatrix, rotationAngle);

    // Aplicar zoom à matriz de modelo
    let scaleMatrix = createMatrix4();
    scale(scaleMatrix, zoomLevel, zoomLevel, zoomLevel);

    // Enviar matrizes para o shader
    const viewMatrixLocation = gl.getUniformLocation(program, 'u_viewMatrix');
    const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix');
    const modelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix');

    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    // Caule
    let quadradoVertices = [-0.05, -1.0, 0.1, 0.8];
    let quadradoCores = [
        0.0, 1.0, 0.0, 1.0,    // verde
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0
    ];
    WebGLLib.createSquare(gl, quadradoVertices, quadradoCores, program);

    // Centro da flor
    WebGLLib.createCircle(gl, [0.0, 0.0, 0.2], [1.0, 1.0, 0.0], program);

    // Pétalas
    const petalPositions = [
        [0.35, 0.0],    // Direita
        [-0.35, 0.0],   // Esquerda
        [0.0, 0.35],    // Cima
        [0.0, -0.35],   // Baixo
        [0.25, 0.25],   // Canto Superior Direito
        [-0.25, 0.25],  // Canto Superior Esquerdo
        [-0.25, -0.25], // Canto Inferior Esquerdo
        [0.25, -0.25]   // Canto Inferior Direito
    ];

    petalPositions.forEach(pos => {
        WebGLLib.createCircle(gl, [pos[0], pos[1], 0.21], [1.0, 0.0, 0.0], program);
    });

    // Folhas
    WebGLLib.createCircle(gl, [-0.1, -0.7, 0.1], [0.0, 1.0, 0.0], program);
    WebGLLib.createCircle(gl, [0.1, -0.8, 0.1], [0.0, 1.0, 0.0], program);

    // Centro pequeno
    WebGLLib.createCircle(gl, [0.0, 0.0, 0.03], [0.0, 0.0, 0.0], program);
}

/**
 * Loop de animação
 */
function animate() {
    if (isAnimating) {
        rotationAngle += 0.02; // Velocidade de rotação
    }

    setupCameraView(currentView);
    drawFlower();

    animationId = requestAnimationFrame(animate);
}

/**
 * Atualiza informações da vista atual
 */
function updateViewInfo() {
    const viewInfo = document.getElementById('viewInfo');
    const view = viewTypes[currentView];
    viewInfo.textContent = `Vista Atual: ${view.name}`;
}

/**
 * Event listeners para controles de teclado
 */
function setupKeyboardControls() {
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                currentView = parseInt(event.key);
                updateViewInfo();
                break;

            case 'a':
            case 'A':
                toggleAnimation();
                break;

            case 'r':
            case 'R':
                resetView();
                break;

            case '+':
            case '=':
                zoomLevel = Math.max(0.1, zoomLevel - 0.1);
                break;

            case '-':
                zoomLevel = Math.min(3.0, zoomLevel + 0.1);
                break;
        }
    });
}

/**
 * Funções de controle
 */
function toggleAnimation() {
    isAnimating = !isAnimating;
    const btn = document.getElementById('animationBtn');
    btn.textContent = isAnimating ? 'Pausar Animação' : 'Retomar Animação';
    btn.className = isAnimating ? '' : 'active';
}

function resetView() {
    currentView = 1;
    zoomLevel = 1.0;
    rotationAngle = 0;
    updateViewInfo();
}

function nextView() {
    currentView = (currentView % 6) + 1;
    updateViewInfo();
}

/**
 * Inicialização principal
 */
function main() {
    canvas = document.getElementById('glCanvas');
    gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    // Habilitar teste de profundidade
    gl.enable(gl.DEPTH_TEST);

    try {
        // Criar shaders
        const vertexShader = WebGLLib.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = WebGLLib.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        // Criar programa
        program = WebGLLib.createProgram(gl, vertexShader, fragmentShader);

        if (!vertexShader || !fragmentShader || !program) {
            throw new Error('Erro ao criar shaders ou programa');
        }

        // Configurar controles
        setupKeyboardControls();
        updateViewInfo();

        // Iniciar animação
        animate();

    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
    }
}

// Inicializar quando a página carregar
window.addEventListener('load', main);
