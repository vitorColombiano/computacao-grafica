function DesenharFlor(gl, program, angulo) {
    // Limpar canvas
    gl.clearColor(0.53, 0.81, 0.92, 1.0); // Azul céu
    gl.clear(gl.COLOR_BUFFER_BIT);

    //============================== QUADRADOS ==============================
    
    let quadradoVertices = [];  //[xVerticeInferiorEsquerda, yVerticeInferiorEsquerda, largura, altura]
    let quadradoCores = [];

    //Caule
    quadradoVertices.push(-0.05, -1.0, 0.1, 0.8);    
    quadradoCores.push(
        0.0, 1.0, 0.0,          // verde
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    );

    WebGLLib.createSquare(gl, quadradoVertices, quadradoCores, program);

    //=======================================================================

    // Meio da flor
    let circuloVertices_meioFlor = [0.0, 0.0, 0.2];
    let circuloCores_meioFlor = [1.0, 1.0, 0.0]; //Amarelo
    WebGLLib.createCircle(gl, circuloVertices_meioFlor, circuloCores_meioFlor, program);

    // Dados das pétalas (posições originais)
    const petalasVertices = [
        [0.35, 0.0],    // Pétala 1 (Direita)
        [-0.35, 0.0],   // Pétala 2 (Esquerda)
        [0.0, 0.35],    // Pétala 3 (Cima)
        [0.0, -0.35],   // Pétala 4 (Baixo)
        [0.25, 0.25],   // Pétala 5 (Canto Superior Direito)
        [-0.25, 0.25],  // Pétala 6 (Canto Superior Esquerdo)
        [-0.25, -0.25], // Pétala 7 (Canto Inferior Esquerdo)
        [0.25, -0.25]   // Pétala 8 (Canto Inferior Direito)
    ];
    
    const raioPetala = 0.21;
    const corPetala = [1.0, 0.0, 0.0]; //Vermelho

    // Desenhar pétalas com rotação
    for (let i = 0; i < petalasVertices.length; i++) {
        let [x, y] = petalasVertices[i];
        let cosA = Math.cos(angulo);
        let sinA = Math.sin(angulo);
        let xRotacionado = x * cosA - y * sinA;
        let yRotacionado = x * sinA + y * cosA;
        let circuloVertices_petala = [xRotacionado, yRotacionado, raioPetala];
        WebGLLib.createCircle(gl, circuloVertices_petala, corPetala, program);
    }

    //Folhas
    let circuloVertices_folhaEsquerda = [-0.1, -0.7, 0.1];
    let circuloCores_folhaEsquerda = [0.0, 1.0, 0.0]; //Verde
    WebGLLib.createCircle(gl, circuloVertices_folhaEsquerda, circuloCores_folhaEsquerda, program);

    let circuloVertices_folhaDireita = [0.1, -0.8, 0.1];
    let circuloCores_folhaDireita = [0.0, 1.0, 0.0]; //Verde
    WebGLLib.createCircle(gl, circuloVertices_folhaDireita, circuloCores_folhaDireita, program);

    //Centro da flor (pequeno círculo preto)
    let circuloVertices_centroFlor = [0.0, 0.0, 0.03];
    let circuloCores_centroFlor = [0.0, 0.0, 0.0]; //Preto
    WebGLLib.createCircle(gl, circuloVertices_centroFlor, circuloCores_centroFlor, program);
}

function main() {
    const canvas = document.getElementById('glCanvas2');
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
        DesenharFlor(gl, program, angulo);
        requestAnimationFrame(animate);
    }
    animate();
}

// Start the application when the page loads
window.addEventListener('load', main);
