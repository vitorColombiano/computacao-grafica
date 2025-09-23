// Variáveis globais
let gl;
let program;
let vertices = [];
let colors = [];
let lineWidths = [];
let currentMode = 'circle'; // 'line', 'triangle' ou 'circle'
let currentColorIndex = 0;
let currentThickness = 1;
let currentRadius = 50;
let clickedPoints = [];
let inputMode = 'draw'; // 'draw', 'color', 'thickness', 'radius'

// Cores disponíveis (índices 0-9)
const colorPalette = [
    [0.0, 0.0, 0.0, 1.0], // 0 - Preto
    [1.0, 0.0, 0.0, 1.0], // 1 - Vermelho
    [0.0, 1.0, 0.0, 1.0], // 2 - Verde
    [0.0, 0.0, 1.0, 1.0], // 3 - Azul
    [1.0, 1.0, 0.0, 1.0], // 4 - Amarelo
    [1.0, 0.0, 1.0, 1.0], // 5 - Magenta
    [0.0, 1.0, 1.0, 1.0], // 6 - Ciano
    [1.0, 0.5, 0.0, 1.0], // 7 - Laranja
    [0.5, 0.0, 0.5, 1.0], // 8 - Roxo
    [0.0, 0.5, 0.0, 1.0]  // 9 - Verde escuro
];

const colorNames = [
    'Preto', 'Vermelho', 'Verde', 'Azul', 'Amarelo',
    'Magenta', 'Ciano', 'Laranja', 'Roxo', 'Verde Escuro'
];

// Vertex shader source
const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    
    varying vec4 v_color;
    
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_color = a_color;
    }
`;

// Fragment shader source
const fragmentShaderSource = `
    precision mediump float;
    
    varying vec4 v_color;
    
    void main() {
        gl_FragColor = v_color;
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Erro ao compilar shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Erro ao linkar programa:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    
    return program;
}

function initWebGL() {
    const canvas = document.getElementById('webgl-canvas');
    gl = canvas.getContext('webgl');
    
    if (!gl) {
        alert('WebGL não é suportado pelo seu navegador!');
        return false;
    }

    // Criar shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    // Criar programa
    program = createProgram(gl, vertexShader, fragmentShader);
    
    if (!program) {
        return false;
    }

    // Configurar viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    return true;
}

function canvasToWebGL(canvas, x, y) {
    const rect = canvas.getBoundingClientRect();
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;
    
    const webglX = (canvasX / canvas.width) * 2 - 1;
    const webglY = -((canvasY / canvas.height) * 2 - 1);
    
    return [webglX, webglY];
}

function addLine(x1, y1, x2, y2) {
    const color = colorPalette[currentColorIndex];
    
    // Adicionar vértices da linha
    vertices.push(x1, y1, x2, y2);
    
    // Adicionar cores (mesma cor para ambos os vértices)
    colors.push(...color, ...color);
    
    // Adicionar espessura
    lineWidths.push(currentThickness);
}

function addTriangle(x1, y1, x2, y2, x3, y3) {
    const color = colorPalette[currentColorIndex];
    
    // Adicionar vértices do triângulo
    vertices.push(x1, y1, x2, y2, x3, y3);
    
    // Adicionar cores (mesma cor para todos os vértices)
    colors.push(...color, ...color, ...color);
    
    // Adicionar espessura
    lineWidths.push(currentThickness);
}

// Algoritmo de Bresenham para circunferências
function bresenhamCircle(centerX, centerY, radius) {
    const points = [];
    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;
    
    // Função para adicionar pontos simétricos
    function addCirclePoints(cx, cy, x, y) {
        const newPoints = [
            [cx + x, cy + y], [cx - x, cy + y],
            [cx + x, cy - y], [cx - x, cy - y],
            [cx + y, cy + x], [cx - y, cy + x],
            [cx + y, cy - x], [cx - y, cy - x]
        ];
        
        // Filtrar pontos duplicados
        newPoints.forEach(point => {
            const exists = points.some(p => p[0] === point[0] && p[1] === point[1]);
            if (!exists) {
                points.push(point);
            }
        });
    }
    
    addCirclePoints(centerX, centerY, x, y);
    
    while (y >= x) {
        x++;
        
        if (d > 0) {
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            d = d + 4 * x + 6;
        }
        
        addCirclePoints(centerX, centerY, x, y);
    }
    
    return points;
}

function addCircle(centerX, centerY, radius) {
    const color = colorPalette[currentColorIndex];
    const canvas = document.getElementById('webgl-canvas');
    
    // Converter centro para coordenadas de pixel
    const centerPixelX = Math.round((centerX + 1) * canvas.width / 2);
    const centerPixelY = Math.round((1 - centerY) * canvas.height / 2);
    
    // Gerar pontos da circunferência usando Bresenham em coordenadas de pixel
    const pixelPoints = bresenhamCircle(centerPixelX, centerPixelY, radius);
    
    // Converter pontos de volta para coordenadas WebGL
    const webglPoints = pixelPoints.map(([px, py]) => {
        const webglX = (px / canvas.width) * 2 - 1;
        const webglY = -((py / canvas.height) * 2 - 1);
        return [webglX, webglY];
    });
    
    // Ordenar pontos por ângulo para conectar corretamente
    webglPoints.sort((a, b) => {
        const angleA = Math.atan2(a[1] - centerY, a[0] - centerX);
        const angleB = Math.atan2(b[1] - centerY, b[0] - centerX);
        return angleA - angleB;
    });
    
    // Conectar pontos adjacentes para formar a circunferência
    for (let i = 0; i < webglPoints.length; i++) {
        const [x1, y1] = webglPoints[i];
        const [x2, y2] = webglPoints[(i + 1) % webglPoints.length];
        
        vertices.push(x1, y1, x2, y2);
        colors.push(...color, ...color);
        lineWidths.push(currentThickness);
    }
}

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    if (vertices.length === 0) {
        return;
    }

    // Usar o programa shader
    gl.useProgram(program);

    // Buffer de vértices
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Buffer de cores
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    // Desenhar primitivas
    let vertexIndex = 0;
    let shapeIndex = 0;
    
    while (vertexIndex < vertices.length / 2) {
        const thickness = lineWidths[shapeIndex];
        gl.lineWidth(thickness);
        
        if (currentMode === 'line' || vertexIndex % 3 === 0) {
            // Desenhar linha
            gl.drawArrays(gl.LINES, vertexIndex, 2);
            vertexIndex += 2;
        } else {
            // Desenhar triângulo
            gl.drawArrays(gl.TRIANGLES, vertexIndex, 3);
            vertexIndex += 3;
        }
        shapeIndex++;
    }
}

function updateModeIndicator() {
    const indicator = document.getElementById('mode-indicator');
    const colorName = document.getElementById('current-color-name');
    const colorPreview = document.getElementById('color-preview');
    const thickness = document.getElementById('current-thickness');
    const radius = document.getElementById('current-radius');
    
    // Atualizar cor
    colorName.textContent = colorNames[currentColorIndex];
    const color = colorPalette[currentColorIndex];
    const rgbColor = `rgb(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)})`;
    colorPreview.style.backgroundColor = rgbColor;
    
    // Atualizar espessura
    thickness.textContent = currentThickness;
    
    // Atualizar raio
    if (radius) {
        radius.textContent = currentRadius;
    }
    
    // Atualizar modo
    indicator.className = 'mode-indicator';
    
    if (inputMode === 'color') {
        indicator.className += ' mode-color';
        indicator.textContent = 'Modo: Mudança de Cor (0-9)';
    } else if (inputMode === 'thickness') {
        indicator.className += ' mode-thickness';
        indicator.textContent = 'Modo: Mudança de Espessura (1-9)';
    } else if (inputMode === 'radius') {
        indicator.className += ' mode-radius';
        indicator.textContent = 'Modo: Mudança de Raio (1-9)';
    } else if (currentMode === 'line') {
        indicator.className += ' mode-line';
        indicator.textContent = 'Modo: Desenhar Retas';
    } else if (currentMode === 'triangle') {
        indicator.className += ' mode-triangle';
        indicator.textContent = 'Modo: Desenhar Triângulos';
    } else if (currentMode === 'circle') {
        indicator.className += ' mode-circle';
        indicator.textContent = 'Modo: Desenhar Circunferências (Bresenham)';
    }
}

function clearCanvas() {
    vertices = [];
    colors = [];
    lineWidths = [];
    clickedPoints = [];
    drawScene();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    if (!initWebGL()) {
        return;
    }

    const canvas = document.getElementById('webgl-canvas');
    
    // Clique no canvas
    canvas.addEventListener('click', function(event) {
        if (inputMode !== 'draw') {
            return;
        }
        
        const [webglX, webglY] = canvasToWebGL(canvas, event.clientX, event.clientY);
        clickedPoints.push([webglX, webglY]);
        
        if (currentMode === 'line' && clickedPoints.length === 2) {
            // Desenhar linha
            const [x1, y1] = clickedPoints[0];
            const [x2, y2] = clickedPoints[1];
            addLine(x1, y1, x2, y2);
            clickedPoints = [];
            drawScene();
        } else if (currentMode === 'triangle' && clickedPoints.length === 3) {
            // Desenhar triângulo
            const [x1, y1] = clickedPoints[0];
            const [x2, y2] = clickedPoints[1];
            const [x3, y3] = clickedPoints[2];
            addTriangle(x1, y1, x2, y2, x3, y3);
            clickedPoints = [];
            drawScene();
        } else if (currentMode === 'circle' && clickedPoints.length === 1) {
            // Desenhar circunferência
            const [centerX, centerY] = clickedPoints[0];
            addCircle(centerX, centerY, currentRadius);
            clickedPoints = [];
            drawScene();
        }
    });

    // Botões de controle
    document.getElementById('line-mode').addEventListener('click', function() {
        currentMode = 'line';
        clickedPoints = [];
        inputMode = 'draw';
        document.getElementById('line-mode').classList.add('active');
        document.getElementById('triangle-mode').classList.remove('active');
        document.getElementById('circle-mode').classList.remove('active');
        updateModeIndicator();
    });

    document.getElementById('triangle-mode').addEventListener('click', function() {
        currentMode = 'triangle';
        clickedPoints = [];
        inputMode = 'draw';
        document.getElementById('triangle-mode').classList.add('active');
        document.getElementById('line-mode').classList.remove('active');
        document.getElementById('circle-mode').classList.remove('active');
        updateModeIndicator();
    });

    document.getElementById('circle-mode').addEventListener('click', function() {
        currentMode = 'circle';
        clickedPoints = [];
        inputMode = 'draw';
        document.getElementById('circle-mode').classList.add('active');
        document.getElementById('line-mode').classList.remove('active');
        document.getElementById('triangle-mode').classList.remove('active');
        updateModeIndicator();
    });

    document.getElementById('clear-canvas').addEventListener('click', clearCanvas);

    // Controles de teclado
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();
        
        if (key === 'k') {
            inputMode = inputMode === 'color' ? 'draw' : 'color';
            updateModeIndicator();
        } else if (key === 'e') {
            inputMode = inputMode === 'thickness' ? 'draw' : 'thickness';
            updateModeIndicator();
        } else if (key === 'r') {
            inputMode = inputMode === 'radius' ? 'draw' : 'radius';
            updateModeIndicator();
        } else if (inputMode === 'color' && key >= '0' && key <= '9') {
            currentColorIndex = parseInt(key);
            updateModeIndicator();
        } else if (inputMode === 'thickness' && key >= '1' && key <= '9') {
            currentThickness = parseInt(key);
            updateModeIndicator();
        } else if (inputMode === 'radius' && key >= '1' && key <= '9') {
            currentRadius = parseInt(key) * 10; // Raio de 10 a 90 pixels
            updateModeIndicator();
        }
    });

    // Inicializar interface
    updateModeIndicator();
    drawScene();
});