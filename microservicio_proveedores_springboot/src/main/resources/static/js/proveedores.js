// Variables globales
const API_URL = '/api/proveedores';
let editando = false;

// Elementos del DOM
const btnNuevoProveedor = document.getElementById('btnNuevoProveedor');
const btnCancelar = document.getElementById('btnCancelar');
const formContainer = document.getElementById('formContainer');
const tablaContainer = document.getElementById('tablaContainer');
const formTitle = document.getElementById('formTitle');
const proveedorForm = document.getElementById('proveedorForm');
const mensaje = document.getElementById('mensaje');

// Event Listeners
document.addEventListener('DOMContentLoaded', cargarProveedores);
btnNuevoProveedor.addEventListener('click', mostrarFormularioNuevo);
btnCancelar.addEventListener('click', ocultarFormulario);
proveedorForm.addEventListener('submit', guardarProveedor);

// Funciones
function cargarProveedores() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los proveedores');
            }
            return response.json();
        })
        .then(data => {
            console.log('Proveedores cargados:', data);
            const tabla = document.getElementById('tablaProveedores').getElementsByTagName('tbody')[0];
            tabla.innerHTML = '';
            
            data.forEach(proveedor => {
                const row = tabla.insertRow();
                
                row.insertCell(0).textContent = proveedor.id;
                row.insertCell(1).textContent = proveedor.nombreEmpresa;
                row.insertCell(2).textContent = proveedor.contactoNombre;
                row.insertCell(3).textContent = proveedor.contactoEmail;
                row.insertCell(4).textContent = proveedor.telefono;
                
                const estadoCell = row.insertCell(5);
                estadoCell.textContent = proveedor.activo ? 'Activo' : 'Inactivo';
                estadoCell.className = proveedor.activo ? 'estado-activo' : 'estado-inactivo';
                
                const accionesCell = row.insertCell(6);
                accionesCell.className = 'acciones';
                
                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.className = 'button';
                btnEditar.onclick = () => mostrarFormularioEditar(proveedor);
                
                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.className = 'button danger';
                btnEliminar.onclick = () => eliminarProveedor(proveedor.id);
                
                accionesCell.appendChild(btnEditar);
                accionesCell.appendChild(btnEliminar);
            });
        })
        .catch(error => {
            console.error('Error al cargar proveedores:', error);
            mostrarMensaje('Error al cargar los proveedores. Intente nuevamente.', 'error');
        });
}

function mostrarFormularioNuevo() {
    limpiarFormulario();
    formTitle.textContent = 'Nuevo Proveedor';
    formContainer.style.display = 'block';
    tablaContainer.style.display = 'none';
    editando = false;
}

function mostrarFormularioEditar(proveedor) {
    document.getElementById('id').value = proveedor.id;
    document.getElementById('nombreEmpresa').value = proveedor.nombreEmpresa;
    document.getElementById('contactoNombre').value = proveedor.contactoNombre;
    document.getElementById('contactoEmail').value = proveedor.contactoEmail;
    document.getElementById('telefono').value = proveedor.telefono;
    document.getElementById('direccion').value = proveedor.direccion || '';
    document.getElementById('activo').checked = proveedor.activo;
    
    formTitle.textContent = 'Editar Proveedor';
    formContainer.style.display = 'block';
    tablaContainer.style.display = 'none';
    editando = true;
}

function ocultarFormulario() {
    formContainer.style.display = 'none';
    tablaContainer.style.display = 'block';
    limpiarFormulario();
}

function limpiarFormulario() {
    proveedorForm.reset();
    document.getElementById('id').value = '';
}

function guardarProveedor(e) {
    e.preventDefault();
    
    const id = document.getElementById('id').value;
    const proveedor = {
        nombreEmpresa: document.getElementById('nombreEmpresa').value,
        contactoNombre: document.getElementById('contactoNombre').value,
        contactoEmail: document.getElementById('contactoEmail').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        activo: document.getElementById('activo').checked
    };
    
    // Solo incluir el ID si estamos editando
    if (editando) {
        proveedor.id = parseInt(id);
    }
    
    console.log('Enviando datos:', proveedor);
    console.log('URL:', editando ? `${API_URL}/${id}` : API_URL);
    console.log('Método:', editando ? 'PUT' : 'POST');
    
    fetch(editando ? `${API_URL}/${id}` : API_URL, {
        method: editando ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedor)
    })
    .then(response => {
        console.log('Respuesta recibida:', response);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error('Error al guardar el proveedor: ' + text);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Proveedor guardado:', data);
        ocultarFormulario();
        cargarProveedores();
        mostrarMensaje(`Proveedor ${editando ? 'actualizado' : 'creado'} correctamente`, 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje(`Error al guardar el proveedor: ${error.message}`, 'error');
    });
}

function eliminarProveedor(id) {
    if (confirm('¿Está seguro que desea eliminar este proveedor?')) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el proveedor');
            }
            cargarProveedores();
            mostrarMensaje('Proveedor eliminado correctamente', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al eliminar el proveedor. Intente nuevamente.', 'error');
        });
    }
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
    
    // Hacer visible el mensaje
    mensaje.style.display = 'block';
    
    setTimeout(() => {
        mensaje.className = 'mensaje';
        mensaje.style.display = 'none';
    }, 5000);
}