document.addEventListener('DOMContentLoaded', function () {
    for (let i = 1; i <= 5; i++) {
        const contenido = document.getElementById(`aplicacion-${i}`);
        if (contenido) {
            contenido.style.maxHeight = '0';
            contenido.style.opacity = '0';
            contenido.style.overflow = 'hidden';
            contenido.style.transition = 'max-height 0.5s ease, opacity 0.5s ease';
        }
    }

    // Configurar animaciones para imágenes
    const imagenes = document.querySelectorAll('.imagen-aplicacion img');
    imagenes.forEach(img => {
        img.addEventListener('mouseenter', function () {
            this.style.transition = 'transform 0.3s ease';
        });
    });
});

// Función para alternar contenido de aplicaciones
function toggleAplicacion(numero) {
    const contenido = document.getElementById(`aplicacion-${numero}`);
    if (!contenido) return;

    const isOpen = contenido.style.maxHeight && contenido.style.maxHeight !== '0px';

    if (isOpen) {
        // Cerrar
        contenido.style.maxHeight = '0';
        contenido.style.opacity = '0';
        contenido.style.paddingTop = '0';
        contenido.style.paddingBottom = '0';
        contenido.style.marginTop = '0';
        contenido.style.marginBottom = '0';
    } else {
        // Abrir
        contenido.style.maxHeight = contenido.scrollHeight + 'px';
        contenido.style.opacity = '1';
        contenido.style.paddingTop = '1rem';
        contenido.style.paddingBottom = '1rem';
        contenido.style.marginTop = '0.5rem';
        contenido.style.marginBottom = '0.5rem';
    }
}

// Variables para la simulación de Buffon
let totalLanzamientos = 0;
let totalCruces = 0;
let piEstimado = 0;

// Simulación del problema de la aguja de Buffon
function simularLanzamientos(numLanzamientos) {
    const longitudAguja = 1; // Longitud de la aguja
    const distanciaLineas = 2; // Distancia entre líneas 

    let crucesEnEsteLote = 0;

    for (let i = 0; i < numLanzamientos; i++) {
        // Posición aleatoria del centro de la aguja
        const distanciaCentro = Math.random() * (distanciaLineas / 2);

        // Ángulo aleatorio de la aguja 
        const angulo = Math.random() * Math.PI / 2;

        // La aguja cruza una línea si: distanciaCentro <= (longitudAguja/2) * sin(angulo)
        const distanciaMinimaParaCruce = (longitudAguja / 2) * Math.sin(angulo);

        if (distanciaCentro <= distanciaMinimaParaCruce) {
            crucesEnEsteLote++;
        }
    }

    totalLanzamientos += numLanzamientos;
    totalCruces += crucesEnEsteLote;

    // Fórmula: π ≈ (2 * longitudAguja * totalLanzamientos) / (totalCruces * distanciaLineas)
    if (totalCruces > 0) {
        piEstimado = (2 * longitudAguja * totalLanzamientos) / (totalCruces * distanciaLineas);
    }

    actualizarResultadoSimulacion(numLanzamientos, crucesEnEsteLote);
}

// Actualizar la visualización de resultados 
function actualizarResultadoSimulacion(lanzamientosRecientes, crucesRecientes) {
    const resultadoDiv = document.getElementById('simulacionResultado');
    const estadisticasDiv = document.getElementById('estadisticasSimulacion');

    if (!resultadoDiv) return;

    let html = '';

    if (totalLanzamientos === 0) {
        html = '<p>Haz clic en un botón para comenzar la simulación.</p>';
    } else {
        const error = Math.abs(Math.PI - piEstimado);
        const errorPorcentaje = ((error / Math.PI) * 100).toFixed(2);
        const porcentajePiEstimado = Math.min(100, (piEstimado / 4) * 100);
        const porcentajePiReal = (Math.PI / 4) * 100;

        html = `
                <h3 style="color:white; margin-top:0;">Resultados de la simulación:</h3>
                <p><strong>Lanzamientos recientes:</strong> ${lanzamientosRecientes.toLocaleString()}</p>
                <p><strong>Total de lanzamientos:</strong> ${totalLanzamientos.toLocaleString()}</p>
                <p><strong>Total de cruces:</strong> ${totalCruces.toLocaleString()}</p>
                <p><strong>π estimado:</strong> ${piEstimado.toFixed(10)}</p>
                <p><strong>π real:</strong> ${Math.PI.toFixed(10)}</p>                
                <div style="margin-top:1rem;">
                    <div style="display:flex; align-items:center; margin-bottom:0.5rem;">
                        <div style="width:100px; margin-right:1rem; font-size:0.9rem;">π estimado:</div>
                        <div style="flex:1; background:#ccc; height:20px; border-radius:10px; overflow:hidden;">
                            <div style="width:${porcentajePiEstimado}%; background:#2ecc71; height:100%;"></div>
                        </div>
                        <span style="margin-left:1rem; font-weight:bold;">${piEstimado.toFixed(4)}</span>
                    </div>
                    <div style="display:flex; align-items:center;">
                        <div style="width:100px; margin-right:1rem; font-size:0.9rem;">π real:</div>
                        <div style="flex:1; background:#ccc; height:20px; border-radius:10px; overflow:hidden;">
                            <div style="width:${porcentajePiReal}%; background:#3498db; height:100%;"></div>
                        </div>
                        <span style="margin-left:1rem; font-weight:bold;">${Math.PI.toFixed(4)}</span>
                    </div>
                </div>
            `;

        // Consejos basados en resultados
        let consejo = '';
        if (totalLanzamientos < 100) {
            consejo = 'Usa más lanzamientos para una mejor estimación.';
        } else if (errorPorcentaje < 1) {
            consejo = '¡Excelente precisión! La simulación está dando buenos resultados.';
        } else if (errorPorcentaje < 5) {
            consejo = 'Buena aproximación. Más lanzamientos mejorarían la precisión.';
        } else {
            consejo = 'La estimación puede mejorar con más lanzamientos.';
        }

        html += `<p style="margin-top:1rem; font-style:italic;">${consejo}</p>`;

        // Estadísticas
        if (estadisticasDiv) {
            estadisticasDiv.innerHTML = `
                    <p><strong>Probabilidad observada:</strong> ${(totalCruces / totalLanzamientos).toFixed(4)}</p>
                    <p><strong>Probabilidad teórica:</strong> ${(2 / (Math.PI * 2)).toFixed(4)}</p>
                `;
        }
    }

    resultadoDiv.innerHTML = html;
}

// Reiniciar la simulación
function reiniciarSimulacion() {
    totalLanzamientos = 0;
    totalCruces = 0;
    piEstimado = 0;

    const resultadoDiv = document.getElementById('simulacionResultado');
    const estadisticasDiv = document.getElementById('estadisticasSimulacion');

    if (resultadoDiv) {
        resultadoDiv.innerHTML = '<p>Simulación reiniciada. Haz clic en un botón para comenzar.</p>';
    }

    if (estadisticasDiv) {
        estadisticasDiv.innerHTML = '';
    }
}

// Efecto visual al pasar sobre títulos de aplicaciones
document.querySelectorAll('.aplicacion-titulo').forEach(titulo => {
    titulo.addEventListener('mouseenter', function () {
        this.style.transform = 'translateX(5px)';
        this.style.transition = 'transform 0.2s ease';
    });

    titulo.addEventListener('mouseleave', function () {
        this.style.transform = 'translateX(0)';
    });
});