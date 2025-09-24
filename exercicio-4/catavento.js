function DesenhaCatavento(gl, program, angulo) {
    // Limpar canvas
    gl.clearColor(0.53, 0.81, 0.92, 1.0); // Azul céu
    gl.clear(gl.COLOR_BUFFER_BIT);

    //============================== QUADRADOS ==============================
    
    let quadradoVertices = [];  //[xVerticeInferiorEsquerda, yVerticeInferiorEsquerda, largura, altura]
    let quadradoCores = [];

    //Poste do catavento
    quadradoVertices.push(-0.02, -0.8, 0.04, 1.2);    
    quadradoCores.push(
        0.6, 0.3, 0.1,          // Marrom
        0.6, 0.3, 0.1,
        0.6, 0.3, 0.1,
        0.6, 0.3, 0.1,
        0.6, 0.3, 0.1,
        0.6, 0.3, 0.1
    );

    //Base do catavento
    quadradoVertices.push(-0.1, -0.8, 0.2, 0.05);    
    quadradoCores.push(
        0.4, 0.2, 0.1,          // Marrom escuro
        0.4, 0.2, 0.1,
        0.4, 0.2, 0.1,
        0.4, 0.2, 0.1,
        0.4, 0.2, 0.1,
        0.4, 0.2, 0.1
    );

    WebGLLib.createSquare(gl, quadradoVertices, quadradoCores, program);

    //=======================================================================

    //============================== CIRCULOS ===============================

    let circuloVertices = [];   //[centroX, centroY, raio]
    let circuloCores = [];

    //Eixo central do catavento
    circuloVertices = [0.0, 0.2, 0.03];
    circuloCores = [0.3, 0.3, 0.3]; // Cinza escuro
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

    //=======================================================================

    //============================== TRIANGULOS =============================
    
    let trianguloVertices = []; //[x1, y1, x2, y2, x3, y3]
    let trianguloCores = [];    //rgb para cada par x e y

    const centro = [0.0, 0.2];
    const cos = Math.cos(angulo);
    const sin = Math.sin(angulo);

    function rotacionarPonto(x,y) {
        let dx = x - centro[0];
        let dy = y - centro[1];
        let xRot = dx * cos - dy * sin + centro[0];
        let yRot = dx * sin + dy * cos + centro[1];
        return [xRot, yRot];
    }

    //Pá 1 (Vermelha - direita)
    let [x1, y1] = rotacionarPonto(0.0, 0.2);
    let [x2, y2] = rotacionarPonto(0.3, 0.2);
    let [x3, y3] = rotacionarPonto(0.15, 0.35);
    
    let trianguloVertices1 = [x1, y1, x2, y2, x3, y3];
    let trianguloCores1 = [1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0];
    WebGLLib.createTriangule(gl, trianguloVertices1, trianguloCores1, program);

    //Pá 2 (Azul - cima)
    [x1, y1] = rotacionarPonto(0.0, 0.2);
    [x2, y2] = rotacionarPonto(0.0, 0.5);
    [x3, y3] = rotacionarPonto(-0.15, 0.35);
    
    let trianguloVertices2 = [x1, y1, x2, y2, x3, y3];
    let trianguloCores2 = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0];
    WebGLLib.createTriangule(gl, trianguloVertices2, trianguloCores2, program);

    //Pá 3 (Verde - esquerda)
    [x1, y1] = rotacionarPonto(0.0, 0.2);
    [x2, y2] = rotacionarPonto(-0.3, 0.2);
    [x3, y3] = rotacionarPonto(-0.15, 0.05);

    let trianguloVertices3 = [x1, y1, x2, y2, x3, y3];
    let trianguloCores3 = [0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0];
    WebGLLib.createTriangule(gl, trianguloVertices3, trianguloCores3, program);

    //Pá 4 (Amarela - baixo)
    [x1, y1] = rotacionarPonto(0.0, 0.2);
    [x2, y2] = rotacionarPonto(0.0, -0.1);
    [x3, y3] = rotacionarPonto(0.15, 0.05);
    
    let trianguloVertices4 = [x1, y1, x2, y2, x3, y3];
    let trianguloCores4 = [1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0];
    WebGLLib.createTriangule(gl, trianguloVertices4, trianguloCores4, program);
}

function main() {
    const canvas = document.getElementById('glCanvas4');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    // Criar shaders usando a biblioteca
    const vertexShader = WebGLLib.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = WebGLLib.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    // Criar programa usando a biblioteca
    const program = WebGLLib.createProgram(gl, vertexShader, fragmentShader);

    if (!vertexShader || !fragmentShader) {
        console.log('Erro ao criar shaders');
        return;
    }   

    if (!program) {
        console.log('Erro ao criar programa');
        return;
    }

    let angulo = 0;
    function animate() {
        angulo += 0.01;
        DesenhaCatavento(gl, program, angulo);
        requestAnimationFrame(animate);
    }
    animate();
}
 
// Start the application when the page loads
window.addEventListener('load', main);
