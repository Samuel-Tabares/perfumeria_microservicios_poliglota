// Variables globales
const API_URL = '/api/clientes';
let editando = false;

// Elementos del DOM
document.addEventListener('DOMContentLoaded', () => {
    const btnNuevoCliente = document.getElementById('btnNuevoCliente');
    const btnCancelar = document.getElementById('btnCancelar');
    const formContainer = document.getElementById('formContainer');
    const tablaContainer = document.getElementById('tablaContainer');
    const formTitle = document.getElementById('formTitle');
    const clienteForm = document.getElementById('clienteForm');
    const mensaje = document.getElementById('mensaje');

    // Event Listeners
    btnNuevoCliente.addEventListener('click', mostrarFormularioNuevo);
    btnCancelar.addEventListener('click', ocultarFormulario);
    clienteForm.addEventListener('submit', guardarCliente);

    // Cargar datos iniciales
    cargarClientes();
});

// Funciones
function cargarClientes() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los clientes');
            }
            return response.json();
        })
        .then(data => {
            console.log('Clientes cargados:', data);
            const tabla = document.getElementById('tablaClientes').getElementsByTagName('tbody')[0];
            tabla.innerHTML = '';
            
            data.forEach(cliente => {
                const row = tabla.insertRow();
                
                row.insertCell(0).textContent = cliente.id;
                row.insertCell(1).textContent = cliente.nombre;
                row.insertCell(2).textContent = cliente.apellido;
                row.insertCell(3).textContent = cliente.email;
                row.insertCell(4).textContent = cliente.telefono || '-';
                
                const estadoCell = row.insertCell(5);
                estadoCell.textContent = cliente.activo ? 'Activo' : 'Inactivo';
                estadoCell.className = cliente.activo ? 'estado-activo' : 'estado-inactivo';
                
                const accionesCell = row.insertCell(6);
                accionesCell.className = 'acciones';
                
                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.className = 'button';
                btnEditar.onclick = () => mostrarFormularioEditar(cliente);
                
                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.className = 'button danger';
                btnEliminar.onclick = () => eliminarCliente(cliente.id);
                
                const btnVerCompras = document.createElement('button');
                btnVerCompras.textContent = 'Ver Compras';
                btnVerCompras.className = 'button secondary';
                btnVerCompras.onclick = () => window.location.href = `/static/compras.html?clienteId=${cliente.id}`;
                
                accionesCell.appendChild(btnEditar);
                accionesCell.appendChild(btnEliminar);
                accionesCell.appendChild(btnVerCompras);
            });
        })
        .catch(error => {
            console.error('Error al cargar clientes:', error);
            mostrarMensaje('Error al cargar los clientes. Intente nuevamente.', 'error');
        });
}

function mostrarFormularioNuevo() {
    limpiarFormulario();
    formTitle.textContent = 'Nuevo Cliente';
    formContainer.style.display = 'block';
    tablaContainer.style.display = 'none';
    editando = false;
}

function mostrarFormularioEditar(cliente) {
    document.getElementById('id').value = cliente.id;
    document.getElementById('nombre').value = cliente.nombre;
    document.getElementById('apellido').value = cliente.apellido;
    document.getElementById('email').value = cliente.email;
    document.getElementById('telefono').value = cliente.telefono || '';
    document.getElementById('direccion').value = cliente.direccion || '';
    document.getElementById('activo').checked = cliente.activo;
    
    formTitle.textContent = 'Editar Cliente';
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
    document.getElementById('clienteForm').reset();
    document.getElementById('id').value = '';
}

function guardarCliente(e) {
    e.preventDefault();
    
    // Deshabilitar el botón para evitar múltiples envíos
    const submitButton = document.querySelector('#clienteForm button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';
    
    const id = document.getElementById('id').value;
    const cliente = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value || null,
        direccion: document.getElementById('direccion').value || null,
        activo: document.getElementById('activo').checked
    };
    
    console.log('Enviando datos:', cliente);
    
    const url = editando ? `${API_URL}/${id}` : API_URL;
    const method = editando ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error('Error al guardar el cliente: ' + text);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Cliente guardado:', data);
        ocultarFormulario();
        cargarClientes();
        mostrarMensaje(`Cliente ${editando ? 'actualizado' : 'creado'} correctamente`, 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje(`Error al guardar el cliente: ${error.message}`, 'error');
    })
    .finally(() => {
        // Re-habilitar el botón
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar';
    });
}

function eliminarCliente(id) {
    if (confirm('¿Está seguro que desea eliminar este cliente? Se eliminarán también todas sus compras.')) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el cliente');
            }
            cargarClientes();
            mostrarMensaje('Cliente eliminado correctamente', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al eliminar el cliente. Intente nuevamente.', 'error');
        });
    }
}

function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
    
    // Hacer visible el mensaje
    mensaje.style.display = 'block';
    
    setTimeout(() => {
        mensaje.className = 'mensaje';
        mensaje.style.display = 'none';
    }, 5000);
}