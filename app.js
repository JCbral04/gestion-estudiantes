// ============================================
// CONFIGURACIÓN
// ============================================
// URL del backend (localhost para desarrollo)
const API_URL = 'https://gestion-estudiantes-api-14x6.onrender.com/api';

// Elementos del DOM
const form = document.getElementById('formEstudiante');
const tabla = document.getElementById('tablaEstudiantes');
const tbody = document.getElementById('tbodyEstudiantes');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const totalEstudiantes = document.getElementById('totalEstudiantes');
const btnGuardar = document.getElementById('btnGuardar');

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const container = document.getElementById('notificaciones');
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    notificacion.innerHTML = `
        <i class="fas ${iconos[tipo]}"></i>
        <span>${mensaje}</span>
    `;
    
    container.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Formatear fecha
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Mostrar/ocultar loading
function toggleLoading(mostrar) {
    loading.classList.toggle('hidden', !mostrar);
    tabla.classList.toggle('hidden', mostrar);
    emptyState.classList.add('hidden');
}

// ============================================
// CRUD OPERACIONES
// ============================================

// Obtener todos los estudiantes (READ)
async function cargarEstudiantes() {
    toggleLoading(true);
    
    try {
        const response = await fetch(`${API_URL}/estudiantes`);
        
        if (!response.ok) throw new Error('Error al cargar estudiantes');
        
        const estudiantes = await response.json();
        mostrarEstudiantes(estudiantes);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar los estudiantes', 'error');
        toggleLoading(false);
    }
}

// Mostrar estudiantes en la tabla
function mostrarEstudiantes(estudiantes) {
    toggleLoading(false);
    
    if (estudiantes.length === 0) {
        tabla.classList.add('hidden');
        emptyState.classList.remove('hidden');
        totalEstudiantes.textContent = '0 estudiantes';
        return;
    }
    
    emptyState.classList.add('hidden');
    tabla.classList.remove('hidden');
    
    tbody.innerHTML = estudiantes.map(est => `
        <tr data-id="${est._id}">
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); 
                                border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                                color: white; font-weight: 600; font-size: 0.875rem;">
                        ${est.nombre.charAt(0).toUpperCase()}
                    </div>
                    <span style="font-weight: 500;">${est.nombre}</span>
                </div>
            </td>
            <td>${est.correo}</td>
            <td>
                <span style="background: #e0e7ff; color: #4338ca; padding: 0.25rem 0.75rem; 
                           border-radius: 12px; font-size: 0.75rem; font-weight: 500;">
                    ${est.programa}
                </span>
            </td>
            <td style="color: #6b7280;">${formatearFecha(est.fechaRegistro)}</td>
            <td>
                <button class="btn btn-danger" onclick="eliminarEstudiante('${est._id}')" title="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    totalEstudiantes.textContent = `${estudiantes.length} estudiante${estudiantes.length !== 1 ? 's' : ''}`;
}

// Crear estudiante (CREATE)
async function guardarEstudiante(event) {
    event.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        programa: document.getElementById('programa').value
    };
    
    // Validación en cliente
    if (!formData.nombre || !formData.correo || !formData.programa) {
        mostrarNotificacion('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
        mostrarNotificacion('Por favor ingresa un correo válido', 'error');
        return;
    }
    
    // Deshabilitar botón
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    
    try {
        const response = await fetch(`${API_URL}/estudiantes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al guardar');
        }
        
        mostrarNotificacion('¡Estudiante registrado exitosamente!', 'success');
        form.reset();
        cargarEstudiantes();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(error.message, 'error');
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Estudiante';
    }
}

// Eliminar estudiante (DELETE)
async function eliminarEstudiante(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/estudiantes/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al eliminar');
        }
        
        // Animación de eliminación
        const fila = document.querySelector(`tr[data-id="${id}"]`);
        fila.style.transition = 'all 0.3s ease';
        fila.style.opacity = '0';
        fila.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            mostrarNotificacion('Estudiante eliminado correctamente', 'success');
            cargarEstudiantes();
        }, 300);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion(error.message, 'error');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar estudiantes al iniciar
    cargarEstudiantes();
    
    // Manejar envío del formulario
    form.addEventListener('submit', guardarEstudiante);
});

// Exponer función global para los botones de eliminar
window.eliminarEstudiante = eliminarEstudiante;