
function main() {

    const canvas = document.getElementById('glCanvas2');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    try{

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

        let circuloVertices = [];   //[centroX, centroY, raio]
        let circuloCores = [];

        //Meio da flor
        circuloVertices = [0.0, 0.0, 0.2];
        circuloCores = [1.0, 1.0, 0.0]; //Amarelo
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Pétala 1 (Direita)
        circuloVertices = [0.35, 0.0, 0.21];
        circuloCores = [1.0, 0.0, 0.0]; //Vermelho
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Pétala 2 (Esquerda)
        circuloVertices = [-0.35, 0.0, 0.21];
        circuloCores = [1.0, 0.0, 0.0]; //Vermelho
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Pétala 3 (Cima)
        circuloVertices = [0.0, 0.35, 0.21];
        circuloCores = [1.0, 0.0, 0.0]; //Vermelho
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Pétala 1 (Baixo)
        circuloVertices = [0.0, -0.35, 0.21];
        circuloCores = [1.0, 0.0, 0.0]; //Vermelho
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);
    
        //Pétala 5 (Canto Superior Direito)
        circuloVertices = [0.25, 0.25, 0.21];
        circuloCores = [1.0, 0.0, 0.0]; //Vermelho
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Pétala 6 (Canto Superior Esquerdo)
        circuloVertices = [-0.25, 0.25, 0.21];
        circuloCores = [1.0, 0.0, 0.0]; //Vermelho
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Pétala 7 (Canto Inferior Esquerdo)
        circuloVertices = [-0.25, -0.25, 0.21];
        circuloCores = [1.0, 0.0, 0.0]; //Vermelho
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Pétala 8 (Canto Inferior Direito)
        circuloVertices = [0.25, -0.25, 0.21];
        circuloCores = [1.0, 0.0, 0.0]; //Vermelho
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);
    
        //Folha esquerda
        circuloVertices = [-0.1, -0.7, 0.1];
        circuloCores = [0.0, 1.0, 0.0]; //Vermelho
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Folha direita
        circuloVertices = [0.1, -0.8, 0.1];
        circuloCores = [0.0, 1.0, 0.0]; //Vermelho
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);
    
        //Folha direita
        circuloVertices = [0.0, 0.0, 0.03];
        circuloCores = [0.0, 0.0, 0.0]; //Vermelho
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);
    
        //=======================================================================
    } catch (error) {
        console.log('Erro ao executar exemplo: Flor');
        console.log('Erro detalhado:', error);
    }
    
}

// Start the application when the page loads
window.addEventListener('load', main);