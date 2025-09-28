let posX = 0.0;

function DesenharCarro(gl, program, angulo) {
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //============================== QUADRADOS ==============================
    
    let quadradoVertices = [];  //[xVerticeInferiorEsquerda, yVerticeInferiorEsquerda, largura, altura]
    let quadradoCores = [];

    //Corpo principal do carro
    quadradoVertices.push(-0.4 + posX, -0.2, 0.8, 0.3);    
    quadradoCores.push(
        0.0, 0.0, 1.0,          // Azul
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0
    );

    //Teto do carro
    quadradoVertices.push(-0.2 + posX, 0.1, 0.4, 0.2);    
    quadradoCores.push(
        0.0, 0.0, 1.0,          // Azul
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0
    );

    //Para-choque dianteiro
    quadradoVertices.push(0.35 + posX, -0.15, 0.05, 0.1);    
    quadradoCores.push(
        0.5, 0.5, 0.5,          // Cinza
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5
    );

    //Para-choque traseiro
    quadradoVertices.push(-0.4 + posX, -0.15, 0.05, 0.1);    
    quadradoCores.push(
        0.5, 0.5, 0.5,          // Cinza
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5
    );

    WebGLLib.createSquare(gl, quadradoVertices, quadradoCores, program);

    //=======================================================================

    //============================== CIRCULOS ===============================

    let circuloVertices = [];   //[centroX, centroY, raio]
    let circuloCores = [];

    //Pneu dianteiro
    circuloVertices = [0.25 + posX, -0.25, 0.1];
    circuloCores = [0.2, 0.2, 0.2]; // Cinza escuro
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program, angulo);

    //Calota dianteira       
    circuloVertices = [0.25 + posX, -0.25, 0.05];
    circuloCores = [0.5, 0.5, 0.5]; // Cinza claro
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program, angulo);
    
    //Pneu traseiro
    circuloVertices = [-0.25 + posX, -0.25, 0.1];
    circuloCores = [0.2, 0.2, 0.2]; // Cinza escuro
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program, angulo);

    //Calota traseira
    circuloVertices = [-0.25 + posX, -0.25, 0.05];
    circuloCores = [0.5, 0.5, 0.5]; // Cinza claro
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program, angulo);

    //Farol dianteiro direito
    circuloVertices = [0.4 + posX, 0.0, 0.03];
    circuloCores = [1.0, 1.0, 0.0]; // Amarelo
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

    //Luz traseira direita
    circuloVertices = [-0.4 + posX, 0.0, 0.02];
    circuloCores = [1.0, 0.0, 0.0]; // Vermelho
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

    //=======================================================================

    //============================== TRIANGULOS =============================
    
    let trianguloVertices = []; //[x1, y1, x2, y2, x3, y3]
    let trianguloCores = [];    //rgb para cada par x e y

    //Janela dianteira
    trianguloVertices.push(
        0.2 + posX, 0.1,
        0.2 + posX, 0.3,
        0.3 + posX, 0.1
    );
    trianguloCores.push(
        0.7, 0.9, 1.0,          // Azul claro
        0.7, 0.9, 1.0,
        0.7, 0.9, 1.0
    );

    //Janela traseira
    trianguloVertices.push(
        -0.2 + posX, 0.1,
        -0.2 + posX, 0.3,
        -0.3 + posX, 0.1
    );
    trianguloCores.push(
        0.7, 0.9, 1.0,          // Azul claro
        0.7, 0.9, 1.0,
        0.7, 0.9, 1.0
    );

    WebGLLib.createTriangule(gl, trianguloVertices, trianguloCores, program);

    //=======================================================================

    //=============================== LINHAS ================================

    let linhaVertices = [];     //[xVertice1, yVertice1, xVertice2, yVertice2]
    let linhaCores = [];        // rgb

    //Maçaneta da porta dianteira
    linhaVertices.push(0.05 + posX, -0.05, 0.1 + posX, -0.05);
    linhaCores.push(
        0.0, 0.0, 0.0,          // Preto para vértice 1
        0.0, 0.0, 0.0           // Preto para vértice 2
    );

    WebGLLib.createLine(gl, linhaVertices, linhaCores, program);
    
}

function main() {
    const canvas = document.getElementById('glCanvas3');
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
        DesenharCarro(gl, program, angulo);
        requestAnimationFrame(animate);
    }
    animate();
}
window.addEventListener('keydown', function(event){
    if (event.key === 'd') {
        posX += 0.1;
    }
    if (event.key === 'a') {
        posX -= 0.1;
    }
});
// Start the application when the page loads
window.addEventListener('load', main);