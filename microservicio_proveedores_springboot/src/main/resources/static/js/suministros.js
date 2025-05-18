// Variables globales
const API_URL = '/api/suministros';
const API_PROVEEDORES = '/api/proveedores';
let editando = false;
let proveedores = [];

// Elementos del DOM
const btnNuevoSuministro = document.getElementById('btnNuevoSuministro');
const btnCancelar = document.getElementById('btnCancelar');
const formContainer = document.getElementById('formContainer');
const tablaContainer = document.getElementById('tablaContainer');
const formTitle = document.getElementById('formTitle');
const suministroForm = document.getElementById('suministroForm');
const mensaje = document.getElementById('mensaje');

// Event Listeners
document.addEventListener('DOMContentLoaded', inicializar);
btnNuevoSuministro.addEventListener('click', mostrarFormularioNuevo);
btnCancelar.addEventListener('click', ocultarFormulario);
suministroForm.addEventListener('submit', guardarSuministro);

// Funciones
function inicializar() {
    cargarProveedores();
    cargarSuministros();
}

function cargarProveedores() {
    fetch(API_PROVEEDORES)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los proveedores');
            }
            return response.json();
        })
        .then(data => {
            console.log('Proveedores cargados:', data);
            proveedores = data;
            const selectProveedor = document.getElementById('proveedorId');
            selectProveedor.innerHTML = '<option value="">Seleccione un proveedor</option>';
            
            data.forEach(proveedor => {
                const option = document.createElement('option');
                option.value = proveedor.id;
                option.textContent = proveedor.nombreEmpresa;
                selectProveedor.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar proveedores:', error);
            mostrarMensaje('Error al cargar los proveedores. Intente nuevamente.', 'error');
        });
}

function cargarSuministros() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los suministros');
            }
            return response.json();
        })
        .then(data => {
            console.log('Suministros cargados:', data);
            const tabla = document.getElementById('tablaSuministros').getElementsByTagName('tbody')[0];
            tabla.innerHTML = '';
            
            data.forEach(suministro => {
                const row = tabla.insertRow();
                
                row.insertCell(0).textContent = suministro.id;
                
                // Buscar el nombre del proveedor
                const proveedorNombre = proveedores.find(p => p.id === suministro.proveedorId)?.nombreEmpresa || suministro.proveedorId;
                row.insertCell(1).textContent = proveedorNombre;
                
                row.insertCell(2).textContent = suministro.productoNombre;
                row.insertCell(3).textContent = suministro.productoCodigo;
                row.insertCell(4).textContent = `$${suministro.precioUnitario}`;
                row.insertCell(5).textContent = `${suministro.tiempoEntregaDias} días`;
                
                const accionesCell = row.insertCell(6);
                accionesCell.className = 'acciones';
                
                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.className = 'button';
                btnEditar.onclick = () => mostrarFormularioEditar(suministro);
                
                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.className = 'button danger';
                btnEliminar.onclick = () => eliminarSuministro(suministro.id);
                
                accionesCell.appendChild(btnEditar);
                accionesCell.appendChild(btnEliminar);
            });
        })
        .catch(error => {
            console.error('Error al cargar suministros:', error);
            mostrarMensaje('Error al cargar los suministros. Intente nuevamente.', 'error');
        });
}

function mostrarFormularioNuevo() {
    limpiarFormulario();
    formTitle.textContent = 'Nuevo Suministro';
    formContainer.style.display = 'block';
    tablaContainer.style.display = 'none';
    editando = false;
}

function mostrarFormularioEditar(suministro) {
    document.getElementById('id').value = suministro.id;
    document.getElementById('proveedorId').value = suministro.proveedorId;
    document.getElementById('productoNombre').value = suministro.productoNombre;
    document.getElementById('productoCodigo').value = suministro.productoCodigo;
    document.getElementById('precioUnitario').value = suministro.precioUnitario;
    document.getElementById('tiempoEntregaDias').value = suministro.tiempoEntregaDias;
    
    formTitle.textContent = 'Editar Suministro';
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
    suministroForm.reset();
    document.getElementById('id').value = '';
}

function guardarSuministro(e) {
    e.preventDefault();
    
    const id = document.getElementById('id').value;
    const suministro = {
        proveedorId: parseInt(document.getElementById('proveedorId').value),
        productoNombre: document.getElementById('productoNombre').value,
        productoCodigo: document.getElementById('productoCodigo').value,
        precioUnitario: parseFloat(document.getElementById('precioUnitario').value),
        tiempoEntregaDias: parseInt(document.getElementById('tiempoEntregaDias').value)
    };
    
    // Solo incluir el ID si estamos editando
    if (editando) {
        suministro.id = parseInt(id);
    }
    
    console.log('Enviando datos:', suministro);
    console.log('URL:', editando ? `${API_URL}/${id}` : API_URL);
    console.log('Método:', editando ? 'PUT' : 'POST');
    
    fetch(editando ? `${API_URL}/${id}` : API_URL, {
        method: editando ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(suministro)
    })
    .then(response => {
        console.log('Respuesta recibida:', response);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error('Error al guardar el suministro: ' + text);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Suministro guardado:', data);
        ocultarFormulario();
        cargarSuministros();
        mostrarMensaje(`Suministro ${editando ? 'actualizado' : 'creado'} correctamente`, 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje(`Error al guardar el suministro: ${error.message}`, 'error');
    });
}

function eliminarSuministro(id) {
    if (confirm('¿Está seguro que desea eliminar este suministro?')) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el suministro');
            }
            cargarSuministros();
            mostrarMensaje('Suministro eliminado correctamente', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al eliminar el suministro. Intente nuevamente.', 'error');
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