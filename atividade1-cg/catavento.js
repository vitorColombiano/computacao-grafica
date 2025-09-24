function main() {

    const canvas = document.getElementById('glCanvas4');
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

        //Pá 1 (Vermelha - direita)
        trianguloVertices.push(
            0.0, 0.2,                
            0.3, 0.2,  
            0.15, 0.35
        );
        trianguloCores.push(
            1.0, 0.0, 0.0,          // Vermelho
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        );

        //Pá 2 (Azul - cima)
        trianguloVertices.push(
            0.0, 0.2,
            0.0, 0.5,
            -0.15, 0.35
        );
        trianguloCores.push(
            0.0, 0.0, 1.0,          // Azul
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        );

        //Pá 3 (Verde - esquerda)
        trianguloVertices.push(
            0.0, 0.2,
            -0.3, 0.2,
            -0.15, 0.05
        );
        trianguloCores.push(
            0.0, 1.0, 0.0,          // Verde
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0
        );

        //Pá 4 (Amarela - baixo)
        trianguloVertices.push(
            0.0, 0.2,
            0.0, -0.1,
            0.15, 0.05
        );
        trianguloCores.push(
            1.0, 1.0, 0.0,          // Amarelo
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0
        );

        WebGLLib.createTriangule(gl, trianguloVertices, trianguloCores, program);

        //=======================================================================

    } catch (error) {
        console.log('Erro ao executar exemplo: Catavento');
        console.log('Erro detalhado:', error);
    }
    
}

// Start the application when the page loads
window.addEventListener('load', main);