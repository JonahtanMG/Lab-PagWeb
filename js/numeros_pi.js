document.addEventListener('DOMContentLoaded', function() {
    const PI_DIGITOS = "1415926535897932384626433832795028841971";
    const input = document.getElementById('digitosPi');
    const btn = document.getElementById('verificarBtn');
    const resultado = document.getElementById('resultadoContainer');
    
    input.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    btn.addEventListener('click', function() {
        const digitosUsuario = input.value;
        
        if (!digitosUsuario) {
            resultado.innerHTML = '<p style="color:#e74c3c">Ingresa dígitos primero</p>';
            return;
        }
        
        const max = Math.min(digitosUsuario.length, PI_DIGITOS.length);
        let correctos = 0;
        let html = '<div class="digitos-resultado">';
        
        for (let i = 0; i < max; i++) {
            const esCorrecto = digitosUsuario[i] === PI_DIGITOS[i];
            if (esCorrecto) correctos++;
            
            const clase = esCorrecto ? 'correcto' : 'incorrecto';
            html += `<div class="digito ${clase}">${digitosUsuario[i]}</div>`;
        }
        
        html += '</div>';
        html += `<p class="contador">Correctos: ${correctos} de ${max}</p>`;
        
        resultado.innerHTML = html;
    });
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            btn.click();
        }
    });
});