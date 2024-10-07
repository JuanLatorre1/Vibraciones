// Función para calcular el momento de inercia I
function calcularMomentoInercia(m, M, L, R) {
    return (1 / 3) * m * L ** 2 + M * (L + R) ** 2 + (2 / 5) * M * R ** 2;
}

// Función para calcular gamma
function calcularGamma(b, I, L, R) {
    return b / (2 * I);
}

// Función para calcular la amplitud A
function calcularAmplitud(theta0, thetaDot0, omega_d, gamma) {
    return Math.sqrt(theta0 ** 2 + ((thetaDot0 + gamma * theta0) / omega_d) ** 2);
}

// Función para calcular la fase inicial φ
function calcularFase(theta0, thetaDot0, A, omega_d, gamma) {
    let phi = Math.atan2(-(thetaDot0 + gamma * theta0) / omega_d, theta0);

    if (phi < 0) {
        phi += 2 * Math.PI;
    }

    return phi;
}

// Función para calcular omega_d (frecuencia amortiguada)
function calcularOmegaD(omega0, gamma) {
    return Math.sqrt(omega0 ** 2 - gamma ** 2);
}

// Función para calcular omega0 (frecuencia natural no amortiguada)
function calcularOmega0(m, M, L, R, g) {
    const numerador = (m * (L) / 2) + M * (L + R);
    const denominador = (m * (L ** 2) / 3) + (2 / 5) * M * (R ** 2) + M * (L + R) ** 2;
    return Math.sqrt((numerador * g) / denominador);
}

// Variables globales
const g = 9.81;  // Gravedad
let intervalID;   // Para detener la simulación

// Función para simular el péndulo amortiguado
function simularPendulo() {

    // Obtener los valores de los inputs
    const theta0 = parseFloat(document.getElementById('theta0').value);
    const thetaDot0 = parseFloat(document.getElementById('thetaDot0').value);
    const m = parseFloat(document.getElementById('masaBarra').value);
    const M = parseFloat(document.getElementById('masaEsfera').value);
    const L = parseFloat(document.getElementById('longitudBarra').value);
    const R = parseFloat(document.getElementById('radioEsfera').value);
    const b = parseFloat(document.getElementById('amortiguamiento').value); // coeficiente de amortiguamiento

    // Cálculo del momento de inercia y gamma
    const I = calcularMomentoInercia(m, M, L, R);
    const gamma = calcularGamma(b, I, L, R);

    // Cálculo de frecuencias
    const omega0 = calcularOmega0(m, M, L, R, g);
    const omega_d = calcularOmegaD(omega0, gamma);

    // Determinar el tipo de amortiguamiento
    let tipoAmortiguamiento;
    if (gamma < omega0) {
        tipoAmortiguamiento = 'subamortiguado';
    } else if (gamma > omega0) {
        tipoAmortiguamiento = 'sobreamortiguado';
    } else {
        tipoAmortiguamiento = 'critico';
    }
    
    // Cálculo de la amplitud y fase

    let A, phi;

    switch (tipoAmortiguamiento) {
        case 'subamortiguado':
            A = calcularAmplitud(theta0, thetaDot0, omega_d, gamma);
            phi = calcularFase(theta0, thetaDot0, A, omega_d, gamma);
            break;
        case 'sobreamortiguado':
            A = theta0;  // Amplitud inicial es theta0, no hay oscilaciones
            phi = 0;  // No hay fase porque no oscila
            break;
        case 'critico':
            A = theta0;  // Amplitud inicial es theta0
            phi = 0;  // Similar al caso sobreamortiguado
            break;
    }

    

    // Mostrar resultados
    document.getElementById('tipoAmortiguamiento').textContent = tipoAmortiguamiento;
    document.getElementById('omegaZero').textContent = omega0.toFixed(3);
    document.getElementById('amplitude').textContent = A.toFixed(3);
    document.getElementById('phase').textContent = phi.toFixed(3);
    document.getElementById('gamma').textContent = gamma.toFixed(3);
    document.getElementById('I').textContent = I.toFixed(3);
    // Iniciar la simulación
    const canvas = document.getElementById('pendulumCanvas');
    const ctx = canvas.getContext('2d');

    let time = 0;  // Tiempo inicial
    let startTime = Date.now();
    clearInterval(intervalID);

    intervalID = setInterval(function () {
        // Calcular la posición del péndulo en el tiempo
        const theta = A * Math.exp(-gamma * time) * Math.cos(omega_d * time + phi);

        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar el péndulo
        const x = canvas.width / 2;
        const y = 100;
        const length = 200;

        const pendulumX = x + length * Math.sin(theta);
        const pendulumY = y + length * Math.cos(theta);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(pendulumX, pendulumY);
        ctx.lineWidth = 10;  // Hacer la barra del péndulo más gruesa
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pendulumX, pendulumY, 20, 0, 2 * Math.PI);  // Esfera del péndulo
        ctx.fillStyle = 'green';
        ctx.fill();

        // Actualizar el tiempo transcurrido
        time = (Date.now() - startTime) / 1000;
        document.getElementById('timeElapsed').textContent = time.toFixed(2);
    }, 1000 / 60);  // Actualizar 60 veces por segundo
}

// Evento al presionar el botón de simulación
document.getElementById('simulateBtn').addEventListener('click', simularPendulo);

