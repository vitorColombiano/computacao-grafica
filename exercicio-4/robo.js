let posDir = 1;
let posEsq = 1;
let posDirMao = 0;
let posEsqMao = 0;

// Variáveis para piscar
let olhosFechados = false;
let tempoUltimoPiscar = Date.now();
const intervaloPiscar = 2000; // pisca a cada 2 segundos
const duracaoPiscar = 200;    // duração do piscar (ms)

function DesenharRobo(gl, program, angulo) {
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //=============================== LINHAS ================================
    let linhaVertices = [];
    let linhaCores = [];
    linhaVertices.push(-0.1, 0.7, -0.1, 0.8);
    linhaCores.push(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    linhaVertices.push(0.1, 0.7, 0.1, 0.8);
    linhaCores.push(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    WebGLLib.createLine(gl, linhaVertices, linhaCores, program);

    //============================== TRIANGULOS =============================
    let trianguloVertices = [];
    let trianguloCores = [];
    trianguloVertices.push(-0.15, -0.6, -0.1, -0.6, -0.2, -0.7);
    trianguloCores.push(0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0);
    trianguloVertices.push(0.1, -0.6, 0.15, -0.6, 0.2, -0.7);
    trianguloCores.push(0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0);
    WebGLLib.createTriangule(gl, trianguloVertices, trianguloCores, program);

    //============================== QUADRADOS ==============================
    let quadradoVertices = [];
    let quadradoCores = [];
    quadradoVertices.push(-0.3, -0.3, 0.6, 0.6);
    quadradoCores.push(
        0.41, 0.41, 0.41, 0.41, 0.41, 0.41,
        0.41, 0.41, 0.41, 0.41, 0.41, 0.41,
        0.41, 0.41, 0.41, 0.41, 0.41, 0.41
    );
    quadradoVertices.push(-0.15, 0.4, 0.3, 0.3);
    quadradoCores.push(
        0.41, 0.41, 0.41, 0.41, 0.41, 0.41,
        0.41, 0.41, 0.41, 0.41, 0.41, 0.41,
        0.41, 0.41, 0.41, 0.41, 0.41, 0.41
    );
    quadradoVertices.push(-0.015, 0.3, 0.03, 0.1);
    quadradoCores.push(
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0
    );
    quadradoVertices.push(0.3, 0.1, 0.25, 0.05);
    quadradoCores.push(
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0
    );
    quadradoVertices.push(0.5, -0.1 * posDir, 0.05, 0.2);
    quadradoCores.push(
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0
    );
    quadradoVertices.push(-0.55, 0.1, 0.25, 0.05);
    quadradoCores.push(
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0
    );
    quadradoVertices.push(-0.55, -0.1 * posEsq, 0.05, 0.2);
    quadradoCores.push(
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0
    );
    quadradoVertices.push(-0.15, -0.6, 0.05, 0.3);
    quadradoCores.push(
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0
    );
    quadradoVertices.push(0.1, -0.6, 0.05, 0.3);
    quadradoCores.push(
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0
    );
    quadradoVertices.push(-0.1, 0.45, 0.2, 0.015);
    quadradoCores.push(
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    );
    quadradoVertices.push(-0.15, -0.15, 0.3, 0.3);
    quadradoCores.push(
        1.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0, 0.0, 0.0
    );
    WebGLLib.createSquare(gl, quadradoVertices, quadradoCores, program);

    //============================== CIRCULOS ===============================
    let circuloVertices = [];
    let circuloCores = [];

    // Mão direita
    circuloVertices = [0.525, (-0.12 * posDir) + posDirMao, 0.05];
    circuloCores = [0.0, 0.0, 1.0];
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

    // Circulo preto (garra)
    circuloVertices = [0.525, (-0.16 * posDir) + posDirMao, 0.05];
    circuloCores = [0.8, 0.8, 0.8];
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

    // Mão esquerda
    circuloVertices = [-0.525, (-0.12 * posEsq) + posEsqMao, 0.05];
    circuloCores = [0.0, 0.0, 1.0];
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

    // Circulo preto (garra)
    circuloVertices = [-0.525, (-0.16 * posEsq) + posEsqMao, 0.05];
    circuloCores = [0.8, 0.8, 0.8];
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

    // Olhos (piscar)
    if (!olhosFechados) {
        // Olho esquerdo aberto
        circuloVertices = [-0.075, 0.6, 0.03];
        circuloCores = [0.0, 0.0, 1.0];
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        // Pupila esquerda
        circuloVertices = [-0.075, 0.6, 0.01];
        circuloCores = [0.0, 0.0, 0.0];
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        // Olho direito aberto
        circuloVertices = [0.075, 0.6, 0.03];
        circuloCores = [0.0, 0.0, 1.0];
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        // Pupila direita
        circuloVertices = [0.075, 0.6, 0.01];
        circuloCores = [0.0, 0.0, 0.0];
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);
    } else {
        // Olhos fechados (círculo preto)
        circuloVertices = [-0.075, 0.6, 0.03];
        circuloCores = [0.0, 0.0, 0.0];
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);

        circuloVertices = [0.075, 0.6, 0.03];
        circuloCores = [0.0, 0.0, 0.0];
        WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);
    }

    // Círculo do peito
    circuloVertices = [0.0, 0.0, 0.1];
    circuloCores = [0.41, 0.41, 0.41];
    WebGLLib.createCircle(gl, circuloVertices, circuloCores, program);
}

function main() {
    const canvas = document.getElementById('glCanvas1');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }
    const vertexShader = WebGLLib.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = WebGLLib.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
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

        // Controle do piscar
        const agora = Date.now();
        if (!olhosFechados && agora - tempoUltimoPiscar > intervaloPiscar) {
            olhosFechados = true;
            setTimeout(() => {
                olhosFechados = false;
                tempoUltimoPiscar = Date.now();
            }, duracaoPiscar);
        }

        DesenharRobo(gl, program, angulo);
        requestAnimationFrame(animate);
    }
    animate();
}

window.addEventListener('keydown', function(event){
    if (event.key === 'd') {
        posDir *= -1;
        posDirMao = (-0.12 * posDir) + 0.14;
    }
    if (event.key === 'a') {
        posEsq *= -1;
        posEsqMao = (-0.12 * posEsq) + 0.14;
    }
});

window.addEventListener('load', main);
