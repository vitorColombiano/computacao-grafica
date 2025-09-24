/**
 * Biblioteca WebGL para criação de formas geométricas básicas
 * 
 * Esta biblioteca fornece funções utilitárias para:
 * - Criação e compilação de shaders
 * - Criação e linkagem de programas
 * - Desenho de triângulos, quadrados e círculos
 * - Desenho 2D com estrutura 4D (z=0, w=1 automaticamente)
 * 
 * 
 * @example
 * // Triângulo 2D: [x1, y1, x2, y2, x3, y3]
 * WebGLLib.createTriangule(gl, [-0.5, -0.5, 0.5, -0.5, 0.0, 0.5], [1, 0, 0, 0, 1, 0, 0, 0, 1], program);
 * 
 * @example
 * // Círculo 2D: [centroX, centroY, raio]
 * WebGLLib.createCircle(gl, [0.0, 0.0, 0.3], [1, 0, 0], program);
 */

// Criar namespace global para evitar conflitos
window.WebGLLib = window.WebGLLib || {};

// Vertex shader source code
const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main() {
        gl_Position = a_position;
        v_color = a_color;
    }
`;

// Fragment shader source code
const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
        gl_FragColor = v_color;
    }
`;


/**
 * Cria e compila um shader WebGL
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {number} type - Tipo do shader (gl.VERTEX_SHADER ou gl.FRAGMENT_SHADER)
 * @param {string} source - Código fonte do shader
 * @returns {WebGLShader|null} Shader compilado ou null em caso de erro
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

/**
 * Cria e linka um programa WebGL
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {WebGLShader} vertexShader - Shader de vértice
 * @param {WebGLShader} fragmentShader - Shader de fragmento
 * @returns {WebGLProgram|null} Programa linkado ou null em caso de erro
 */
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

WebGLLib.createLine = function(gl, vertices, colors, program){

    // Get attribute location
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');

    const aux_vert = new Float32Array(vertices);
    const aux_color = new Float32Array(colors);
    
    // Create buffer and bind vertex data
    const VertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, aux_vert, gl.STATIC_DRAW);

    // Create buffer and bind color data
    const ColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, aux_color, gl.STATIC_DRAW);

    // Use shader program
    gl.useProgram(program);


    // Enable and set up the position attribute (2D)
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Enable and set up the color attribute (3D)
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    // Draw separate lines
    gl.drawArrays(gl.LINES, 0, vertices.length / 2);
};


/**
 * Cria e desenha um triângulo
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {number[]} vertices - Array de coordenadas 2D [x1, y1, x2, y2, ..., xn, yn]
 * @param {number[]} colors - Array de cores RGB [r1, g1, b1, r2, g2, b2, ..., rn, gn, bn]
 * @param {WebGLProgram} program - Programa shader compilado
 */
WebGLLib.createTriangule = function(gl, vertices, colors, program){

    // Get attribute location
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');

    const aux_vert = new Float32Array(vertices);
    const aux_color = new Float32Array(colors);
    
    // Create buffer and bind vertex data
    const VertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, aux_vert, gl.STATIC_DRAW);

    // Create buffer and bind vertex data
    const ColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, aux_color, gl.STATIC_DRAW);

     // Use shader program
     gl.useProgram(program);

     // Enable and set up the position attribute (4D)
     gl.enableVertexAttribArray(positionLocation);
     gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
     gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
 
     // Enable and set up the color attribute (4D)
     gl.enableVertexAttribArray(colorLocation);
     gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
     gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
 
     // Draw the triangles
     gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
};

/**
 * Cria e desenha um quadrado
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {number[]} vertices - Array com coordenadas e dimensões [x, y, width, height]
 * @param {number[]} colors - Array de cores RGB para cada vértice
 * @param {WebGLProgram} program - Programa shader compilado
 */
WebGLLib.createSquare = function(gl, vertices, colors, program) {

    let count = 0;
    let points = [];
    let width  = 0;
    let length = 0;

    for(let i = 0; i < vertices.length; i++){

        if(count < 2){
            points.push(vertices[i]);
        }
        else if(count == 2){
            width = vertices[i];
            length = vertices[i+1];

            points.push(vertices[i-2] + width);
            points.push(vertices[i-1]);

            points.push(vertices[i-2]);
            points.push(vertices[i-1] + length);

            points.push(vertices[i-2] + width);
            points.push(vertices[i-1]);

            points.push(vertices[i-2]);
            points.push(vertices[i-1] + length);

            points.push(vertices[i-2] + width);
            points.push(vertices[i-1] + length);

        }
        else if(count == 3){
            count = -1;
        }

        count++;
    }

    WebGLLib.createTriangule(gl, points, colors, program);
};

function circleVertices(cx, cy, radius) {
    const vertices = [];
    const numSides = 50;

    // Center point of the circle
    vertices.push(cx, cy);

    // Rim vertices (repeat first rim vertex at end to close the fan)
    for (let i = 0; i <= numSides; i++) {
        const angle = i * 2 * Math.PI / numSides;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        vertices.push(x, y);
    }

    return new Float32Array(vertices);
}

/**
 * Cria e desenha um círculo usando WebGL (2D com estrutura 4D)
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {number[]} data - Array com dados do círculo [centroX, centroY, raio]
 * @param {number[]} colors - Array com cor RGB [r, g, b]
 * @param {WebGLProgram} program - Programa shader compilado
 */
WebGLLib.createCircle = function(gl, data, colors, program){

	const vertexBuffer = gl.createBuffer();
	const colorBuffer = gl.createBuffer();

	// Use shader program
	gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');

	// Expect data as [cx, cy, radius]
	const cx = data[0];
	const cy = data[1];
	const radius = data[2];

    const points = circleVertices(cx, cy, radius);
    
    // Criar array de cores para cada vértice
    const colorsArray = [];
    for (let i = 0; i < points.length / 2; i++) {
        colorsArray.push(colors[0], colors[1], colors[2]);
    }

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsArray), gl.STATIC_DRAW);

	gl.enableVertexAttribArray(positionLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	gl.enableVertexAttribArray(colorLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 2);
};