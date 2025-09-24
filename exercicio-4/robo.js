function main() {

    const canvas = document.getElementById('glCanvas1');
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
        gl.clearColor(0.8, 0.8, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);


        //=============================== LINHAS ================================

        let linhaVertices = [];     //[xVertice1, yVertice1, xVertice2, yVertice2]
        let linhaCores = [];        // rgb

        //Antena esquerda
        linhaVertices.push(-0.1, 0.7, -0.1, 0.8);
        linhaCores.push(
            1.0, 0.0, 0.0,          // vermelho para vértice 1
            1.0, 0.0, 0.0           // vermelho para vértice 2
        );

        //Antena direita
        linhaVertices.push(0.1, 0.7, 0.1, 0.8);
        linhaCores.push(
            1.0, 0.0, 0.0,          // vermelho para vértice 1
            1.0, 0.0, 0.0           // vermelho para vértice 2
        );

        WebGLLib.createLine(gl, linhaVertices, linhaCores, program);

        //=======================================================================
        
        //============================== TRIANGULOS =============================
        
        let trianguloVertices = []; //[x1, y1, x2, y2, x3, y3]
        let trianguloCores = [];    //rgb para cada par x e y

        //Pé esquerdo
        trianguloVertices.push(
            -0.15, -0.6,                
            -0.1, -0.6,  
            -0.2,  -0.7
        );
        trianguloCores.push(
            0.0, 0.0, 1.0,          //Azul
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        );

        //Pé direito
        trianguloVertices.push(
            0.1, -0.6,
            0.15, -0.6,
            0.2,  -0.7
        );
        trianguloCores.push(
            0.0, 0.0, 1.0,          //Azul
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        );

        WebGLLib.createTriangule(gl, trianguloVertices, trianguloCores, program);

        //=======================================================================

        //============================== QUADRADOS ==============================
        
        let quadradoVertices = [];  //[xVerticeInferiorEsquerda, yVerticeInferiorEsquerda, largura, altura]
        let quadradoCores = [];

        //Corpo
        quadradoVertices.push(-0.3, -0.3, 0.6, 0.6);    
        quadradoCores.push(
            0.41, 0.41, 0.41,       //Cinza: r, g, b (105/255 ≈ 0.41)
            0.41, 0.41, 0.41,
            0.41, 0.41, 0.41,
            0.41, 0.41, 0.41,
            0.41, 0.41, 0.41,
            0.41, 0.41, 0.41
        );
        
        //Cabeça
        quadradoVertices.push(-0.15, 0.4, 0.3, 0.3);    
        quadradoCores.push(
            0.41, 0.41, 0.41,       //Cinza
            0.41, 0.41, 0.41,
            0.41, 0.41, 0.41,
            0.41, 0.41, 0.41,
            0.41, 0.41, 0.41,
            0.41, 0.41, 0.41
        );

        //Pescoço
        quadradoVertices.push(-0.015, 0.3, 0.03, 0.1);    
        quadradoCores.push(
            1.0, 0.0, 0.0,          //Vermelho
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        );

        //Braço direito
        quadradoVertices.push(0.3, 0.1, 0.25, 0.05);    
        quadradoCores.push(
            1.0, 0.0, 0.0,          //Vermelho
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        );

        //Braço direito (Antebraço)
        quadradoVertices.push(0.5, -0.1, 0.05, 0.2);    
        quadradoCores.push(
            1.0, 0.0, 0.0,          //Vermelho
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        );

        //Braço esquerdo
        quadradoVertices.push(-0.55, 0.1, 0.25, 0.05);    
        quadradoCores.push(
            1.0, 0.0, 0.0,          //Vermelho
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        );

        //Braço esquerdo (Antebraço)
        quadradoVertices.push(-0.55, -0.1, 0.05, 0.2);    
        quadradoCores.push(
            1.0, 0.0, 0.0,          //Vermelho
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        );

        //Perna esquerda
        quadradoVertices.push(-0.15, -0.6, 0.05, 0.3);    
        quadradoCores.push(
            1.0, 0.0, 0.0,          //Vermelho
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        );

        //Perna direita
        quadradoVertices.push(0.1, -0.6, 0.05, 0.3);    
        quadradoCores.push(
            1.0, 0.0, 0.0,          //Vermelho
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        );
        
        //Boca
        quadradoVertices.push(-0.1, 0.45, 0.2, 0.015);    
        quadradoCores.push(
            0.0, 0.0, 0.0,          //Preto
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0
        );
        
        //Barriga
        quadradoVertices.push(-0.15, -0.15, 0.3, 0.3);    
        quadradoCores.push(
            1.0, 0.0, 0.0,          //Vermelho
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 1.0           //Azul
        );

        WebGLLib.createSquare(gl, quadradoVertices, quadradoCores, program);

        //=======================================================================

        //============================== CIRCULOS ===============================

        let circuloVertices = [];   //[centroX, centroY, raio]
        let circuloCores = [];

        //Mão direita
        circuloVertices = [0.525, -0.12, 0.05]; 
        circuloCores = [0.0, 0.0, 1.0]; //Verde
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Circulo preto (para dar a impressão de garra na mão)
        circuloVertices = [0.525, -0.16, 0.05];
        circuloCores = [0.8, 0.8, 0.8]; //Preto
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Mão esquerda
        circuloVertices = [-0.525, -0.12, 0.05];
        circuloCores = [0.0, 0.0, 1.0]; //Azul
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Circulo preto (para dar a impressão de garra na mão)
        circuloVertices = [-0.525, -0.16, 0.05];
        circuloCores = [0.8, 0.8, 0.8]; //Preto
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Olho esquerdo
        circuloVertices = [-0.075, 0.6, 0.03];
        circuloCores = [0.0, 0.0, 1.0]; //Azul
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Olho esquerdo (pupíla)
        circuloVertices = [-0.075, 0.6, 0.01];
        circuloCores = [0.0, 0.0, 0.0]; //Preto
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Olho direito
        circuloVertices = [0.075, 0.6, 0.03];
        circuloCores = [0.0, 0.0, 1.0]; //Azul
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Olho direito (pupíla)
        circuloVertices = [0.075, 0.6, 0.01];
        circuloCores = [0.0, 0.0, 0.0]; //Preto
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        //Círculo do peito
        circuloVertices = [-0.0, 0.0, 0.1];
        circuloCores = [0.41, 0.41, 0.41]; //Cinza
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);
    
        //=======================================================================
    } catch (error) {
        console.log('Erro ao executar exemplo: Robô');
        console.log('Erro detalhado:', error);
    }
    
}

// Start the application when the page loads
window.addEventListener('load', main);