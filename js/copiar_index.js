const pi = "3.1415926535897932";
const boton = document.getElementById('botonCopiarPi');
const mensaje = document.getElementById('mensajeCopiado');

boton.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(pi);
        mostrarFeedback();
    } catch (error) {
        // Método alternativo
        const textarea = document.createElement('textarea');
        textarea.value = pi;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy'); // ← ESTA LÍNEA FALTABA
        document.body.removeChild(textarea);
        
        mostrarFeedback();
    }
});

function mostrarFeedback() {
    boton.classList.add('copiando');
    mensaje.textContent = '¡Copiado!';
    mensaje.classList.add('mostrar');
    
    setTimeout(() => {
        boton.classList.remove('copiando');
        mensaje.classList.remove('mostrar');
    }, 2000);
}