// Variables globales
const API_URL = '/api/compras';
const API_CLIENTES = '/api/clientes';
let editando = false;
let clientes = [];

// Elementos del DOM
document.addEventListener('DOMContentLoaded', () => {
    const btnNuevaCompra = document.getElementById('btnNuevaCompra');
    const btnCancelar = document.getElementById('btnCancelar');
    const formContainer = document.getElementById('formContainer');
    const tablaContainer = document.getElementById('tablaContainer');
    const formTitle = document.getElementById('formTitle');
    const compraForm = document.getElementById('compraForm');
    const mensaje = document.getElementById('mensaje');

    // Event Listeners
    btnNuevaCompra.addEventListener('click', mostrarFormularioNuevo);
    btnCancelar.addEventListener('click', ocultarFormulario);
    compraForm.addEventListener('submit', guardarCompra);

    // Cargar datos iniciales
    inicializar();
});

// Funciones
function inicializar() {
    // Verificar si hay un clienteId en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('clienteId');

    cargarClientes().then(() => {
        cargarCompras();
        
        // Si hay un clienteId, preseleccionar ese cliente al crear una nueva compra
        if (clienteId) {
            mostrarFormularioNuevo();
            document.getElementById('cliente_id').value = clienteId;
        }
    });
}

function cargarClientes() {
    return fetch(API_CLIENTES)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los clientes');
            }
            return response.json();
        })
        .then(data => {
            console.log('Clientes cargados:', data);
            clientes = data;
            const selectCliente = document.getElementById('cliente_id');
            selectCliente.innerHTML = '<option value="">Seleccione un cliente</option>';
            
            data.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = `${cliente.nombre} ${cliente.apellido}`;
                selectCliente.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar clientes:', error);
            mostrarMensaje('Error al cargar los clientes. Intente nuevamente.', 'error');
        });
}

function cargarCompras() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar las compras');
            }
            return response.json();
        })
        .then(data => {
            console.log('Compras cargadas:', data);
            const tabla = document.getElementById('tablaCompras').getElementsByTagName('tbody')[0];
            tabla.innerHTML = '';
            
            data.forEach(compra => {
                const row = tabla.insertRow();
                
                row.insertCell(0).textContent = compra.id;
                
                // Buscar el nombre del cliente
                const clienteNombre = clientes.find(c => c.id === compra.cliente_id) ? 
                    `${clientes.find(c => c.id === compra.cliente_id).nombre} ${clientes.find(c => c.id === compra.cliente_id).apellido}` : 
                    compra.cliente_id;
                row.insertCell(1).textContent = clienteNombre;
                
                // Formatear fecha
                const fecha = new Date(compra.fecha_compra);
                row.insertCell(2).textContent = fecha.toLocaleString();
                
                // Formatear total
                row.insertCell(3).textContent = `$${compra.total}`;
                
                const estadoCell = row.insertCell(4);
                estadoCell.textContent = compra.completada ? 'Completada' : 'Pendiente';
                estadoCell.className = compra.completada ? 'estado-completado' : 'estado-pendiente';
                
                const accionesCell = row.insertCell(5);
                accionesCell.className = 'acciones';
                
                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.className = 'button';
                btnEditar.onclick = () => mostrarFormularioEditar(compra);
                
                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.className = 'button danger';
                btnEliminar.onclick = () => eliminarCompra(compra.id);
                
                const btnCompletar = document.createElement('button');
                btnCompletar.textContent = 'Marcar Completada';
                btnCompletar.className = 'button success';
                btnCompletar.style.display = compra.completada ? 'none' : 'inline-block';
                btnCompletar.onclick = () => completarCompra(compra.id);
                
                accionesCell.appendChild(btnEditar);
                accionesCell.appendChild(btnEliminar);
                accionesCell.appendChild(btnCompletar);
            });
        })
        .catch(error => {
            console.error('Error al cargar compras:', error);
            mostrarMensaje('Error al cargar las compras. Intente nuevamente.', 'error');
        });
}

function mostrarFormularioNuevo() {
    limpiarFormulario();
    formTitle.textContent = 'Nueva Compra';
    formContainer.style.display = 'block';
    tablaContainer.style.display = 'none';
    editando = false;
}

function mostrarFormularioEditar(compra) {
    document.getElementById('id').value = compra.id;
    document.getElementById('cliente_id').value = compra.cliente_id;
    document.getElementById('total').value = compra.total;
    document.getElementById('completada').checked = compra.completada;
    
    formTitle.textContent = 'Editar Compra';
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
    document.getElementById('compraForm').reset();
    document.getElementById('id').value = '';
}

function guardarCompra(e) {
    e.preventDefault();
    
    // Deshabilitar el botón para evitar múltiples envíos
    const submitButton = document.querySelector('#compraForm button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';
    
    const id = document.getElementById('id').value;
    const compra = {
        cliente_id: parseInt(document.getElementById('cliente_id').value),
        total: parseFloat(document.getElementById('total').value),
        completada: document.getElementById('completada').checked
    };
    
    console.log('Enviando datos:', compra);
    
    const url = editando ? `${API_URL}/${id}` : API_URL;
    const method = editando ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compra)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error('Error al guardar la compra: ' + text);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Compra guardada:', data);
        ocultarFormulario();
        cargarCompras();
        mostrarMensaje(`Compra ${editando ? 'actualizada' : 'creada'} correctamente`, 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje(`Error al guardar la compra: ${error.message}`, 'error');
    })
    .finally(() => {
        // Re-habilitar el botón
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar';
    });
}

function eliminarCompra(id) {
    if (confirm('¿Está seguro que desea eliminar esta compra?')) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la compra');
            }
            cargarCompras();
            mostrarMensaje('Compra eliminada correctamente', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al eliminar la compra. Intente nuevamente.', 'error');
        });
    }
}

function completarCompra(id) {
    fetch(`${API_URL}/${id}/completar`, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al completar la compra');
        }
        return response.json();
    })
    .then(data => {
        cargarCompras();
        mostrarMensaje('Compra marcada como completada', 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error al completar la compra. Intente nuevamente.', 'error');
    });
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