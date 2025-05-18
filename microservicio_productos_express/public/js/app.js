// Variables globales
const API_URL = '/api';
let currentSection = 'productos';
let itemToDelete = null;

// Elementos DOM
const sectionTitulo = document.getElementById('seccion-titulo');
const btnNuevoItem = document.getElementById('btn-nuevo-item');
const mensajeEstado = document.getElementById('mensaje-estado');

// Modales
let modalProducto, modalCategoria, modalPromocion, modalConfirmar;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando...');
    
    // Inicializar modales de Bootstrap
    modalProducto = new bootstrap.Modal(document.getElementById('modal-producto'));
    modalCategoria = new bootstrap.Modal(document.getElementById('modal-categoria'));
    modalPromocion = new bootstrap.Modal(document.getElementById('modal-promocion'));
    modalConfirmar = new bootstrap.Modal(document.getElementById('modal-confirmar'));
    
    // Cargar datos iniciales
    cargarProductos();
    cargarCategorias(true);
    
    // Navigation
    document.getElementById('btn-mostrar-productos').addEventListener('click', () => cambiarSeccion('productos'));
    document.getElementById('btn-mostrar-categorias').addEventListener('click', () => cambiarSeccion('categorias'));
    document.getElementById('btn-mostrar-promociones').addEventListener('click', () => cambiarSeccion('promociones'));
    
    // Botones de acción
    btnNuevoItem.addEventListener('click', mostrarModalNuevo);
    document.getElementById('btn-guardar-producto').addEventListener('click', guardarProducto);
    document.getElementById('btn-guardar-categoria').addEventListener('click', guardarCategoria);
    document.getElementById('btn-guardar-promocion').addEventListener('click', guardarPromocion);
    document.getElementById('btn-confirmar-eliminar').addEventListener('click', confirmarEliminar);
    
    // Búsqueda
    document.getElementById('btn-buscar').addEventListener('click', buscarProductos);
    document.getElementById('buscar-producto').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscarProductos();
    });
    document.getElementById('btn-mostrar-en-stock').addEventListener('click', mostrarProductosEnStock);

    console.log('Inicialización completada');
});

// Funciones de navegación
function cambiarSeccion(seccion) {
    console.log(`Cambiando a sección: ${seccion}`);
    currentSection = seccion;
    
    // Ocultar todas las secciones
    document.getElementById('seccion-productos').classList.add('d-none');
    document.getElementById('seccion-categorias').classList.add('d-none');
    document.getElementById('seccion-promociones').classList.add('d-none');
    
    // Mostrar la sección seleccionada
    document.getElementById(`seccion-${seccion}`).classList.remove('d-none');
    
    // Actualizar título y botón
    switch(seccion) {
        case 'productos':
            sectionTitulo.textContent = 'Productos';
            btnNuevoItem.textContent = 'Nuevo Producto';
            cargarProductos();
            break;
        case 'categorias':
            sectionTitulo.textContent = 'Categorías';
            btnNuevoItem.textContent = 'Nueva Categoría';
            cargarCategorias();
            break;
        case 'promociones':
            sectionTitulo.textContent = 'Promociones';
            btnNuevoItem.textContent = 'Nueva Promoción';
            cargarPromociones();
            break;
    }
}

// Funciones para mostrar modales
function mostrarModalNuevo() {
    switch(currentSection) {
        case 'productos':
            document.getElementById('modal-producto-titulo').textContent = 'Nuevo Producto';
            document.getElementById('form-producto').reset();
            document.getElementById('producto-id').value = '';
            modalProducto.show();
            break;
        case 'categorias':
            document.getElementById('modal-categoria-titulo').textContent = 'Nueva Categoría';
            document.getElementById('form-categoria').reset();
            document.getElementById('categoria-id').value = '';
            modalCategoria.show();
            break;
        case 'promociones':
            document.getElementById('modal-promocion-titulo').textContent = 'Nueva Promoción';
            document.getElementById('form-promocion').reset();
            document.getElementById('promocion-id').value = '';
            cargarProductosParaSelect('promocion-producto-id');
            
            // Establecer fecha de inicio hoy y fin en un mes
            const hoy = new Date();
            const finMes = new Date();
            finMes.setMonth(finMes.getMonth() + 1);
            
            document.getElementById('promocion-fecha-inicio').value = formatDate(hoy);
            document.getElementById('promocion-fecha-fin').value = formatDate(finMes);
            
            modalPromocion.show();
            break;
    }
}

function mostrarModalEditar(id) {
    console.log(`Editando item con ID: ${id}`);
    switch(currentSection) {
        case 'productos':
            fetch(`${API_URL}/productos/${id}`)
                .then(response => response.json())
                .then(producto => {
                    console.log('Producto cargado:', producto);
                    document.getElementById('modal-producto-titulo').textContent = 'Editar Producto';
                    document.getElementById('producto-id').value = producto.id;
                    document.getElementById('producto-nombre').value = producto.nombre;
                    document.getElementById('producto-codigo').value = producto.codigo;
                    document.getElementById('producto-precio').value = producto.precio;
                    document.getElementById('producto-stock').value = producto.stock;
                    document.getElementById('producto-descripcion').value = producto.descripcion;
                    document.getElementById('producto-categoria-id').value = producto.categoriaId;
                    document.getElementById('producto-activo').checked = producto.activo;
                    modalProducto.show();
                })
                .catch(error => {
                    console.error('Error al cargar producto:', error);
                    mostrarError('Error al cargar el producto');
                });
            break;
        case 'categorias':
            fetch(`${API_URL}/categorias/${id}`)
                .then(response => response.json())
                .then(categoria => {
                    console.log('Categoría cargada:', categoria);
                    document.getElementById('modal-categoria-titulo').textContent = 'Editar Categoría';
                    document.getElementById('categoria-id').value = categoria.id;
                    document.getElementById('categoria-nombre').value = categoria.nombre;
                    document.getElementById('categoria-descripcion').value = categoria.descripcion;
                    modalCategoria.show();
                })
                .catch(error => {
                    console.error('Error al cargar categoría:', error);
                    mostrarError('Error al cargar la categoría');
                });
            break;
        case 'promociones':
            fetch(`${API_URL}/promociones/${id}`)
                .then(response => response.json())
                .then(promocion => {
                    console.log('Promoción cargada:', promocion);
                    cargarProductosParaSelect('promocion-producto-id');
                    document.getElementById('modal-promocion-titulo').textContent = 'Editar Promoción';
                    document.getElementById('promocion-id').value = promocion.id;
                    document.getElementById('promocion-nombre').value = promocion.nombre;
                    document.getElementById('promocion-descripcion').value = promocion.descripcion;
                    document.getElementById('promocion-producto-id').value = promocion.productoId;
                    document.getElementById('promocion-descuento').value = promocion.descuentoPorcentaje;
                    document.getElementById('promocion-fecha-inicio').value = formatDate(new Date(promocion.fechaInicio));
                    document.getElementById('promocion-fecha-fin').value = formatDate(new Date(promocion.fechaFin));
                    document.getElementById('promocion-activa').checked = promocion.activa;
                    modalPromocion.show();
                })
                .catch(error => {
                    console.error('Error al cargar promoción:', error);
                    mostrarError('Error al cargar la promoción');
                });
            break;
    }
}

function mostrarModalEliminar(id, tipo) {
    itemToDelete = { id, tipo };
    modalConfirmar.show();
}

// Funciones para cargar datos
function cargarProductos() {
    console.log('Cargando productos...');
    fetch(`${API_URL}/productos`)
        .then(response => {
            console.log('Respuesta de API productos:', response.status);
            return response.json();
        })
        .then(productos => {
            console.log('Productos cargados:', productos);
            const listaProductos = document.getElementById('lista-productos');
            listaProductos.innerHTML = '';
            
            productos.forEach(producto => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.codigo}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.categoria_nombre || 'Sin categoría'}</td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-info" onclick="mostrarModalEditar(${producto.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="mostrarModalEliminar(${producto.id}, 'productos')">Eliminar</button>
                    </td>
                `;
                listaProductos.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            mostrarError('Error al cargar los productos');
        });
}

function cargarCategorias(soloSelect = false) {
    console.log(`Cargando categorías, soloSelect=${soloSelect}`);
    fetch(`${API_URL}/categorias`)
        .then(response => {
            console.log('Respuesta de API categorías:', response.status);
            return response.json();
        })
        .then(categorias => {
            console.log('Categorías cargadas:', categorias);
            // Actualizar el select de categorías para el formulario de productos
            const selectCategorias = document.getElementById('producto-categoria-id');
            selectCategorias.innerHTML = '';
            
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.nombre;
                selectCategorias.appendChild(option);
            });
            
            // Si solo queremos actualizar el select, terminamos aquí
            if (soloSelect) return;
            
            // Actualizar la tabla de categorías
            const listaCategorias = document.getElementById('lista-categorias');
            listaCategorias.innerHTML = '';
            
            categorias.forEach(categoria => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${categoria.id}</td>
                    <td>${categoria.nombre}</td>
                    <td>${categoria.descripcion || ''}</td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-info" onclick="mostrarModalEditar(${categoria.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="mostrarModalEliminar(${categoria.id}, 'categorias')">Eliminar</button>
                        <button class="btn btn-sm btn-primary" onclick="verProductosCategoria(${categoria.id})">Ver Productos</button>
                    </td>
                `;
                listaCategorias.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al cargar las categorías:', error);
            mostrarError('Error al cargar las categorías');
        });
}

function cargarPromociones() {
    console.log('Cargando promociones...');
    fetch(`${API_URL}/promociones`)
        .then(response => {
            console.log('Respuesta de API promociones:', response.status);
            return response.json();
        })
        .then(promociones => {
            console.log('Promociones cargadas:', promociones);
            const listaPromociones = document.getElementById('lista-promociones');
            listaPromociones.innerHTML = '';
            
            promociones.forEach(promocion => {
                const fechaInicio = new Date(promocion.fechaInicio).toLocaleDateString();
                const fechaFin = new Date(promocion.fechaFin).toLocaleDateString();
                
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${promocion.id}</td>
                    <td>${promocion.nombre}</td>
                    <td>${promocion.producto ? promocion.producto.nombre : 'N/A'}</td>
                    <td>${promocion.descuentoPorcentaje}%</td>
                    <td>${fechaInicio} - ${fechaFin}</td>
                    <td>
                        <span class="badge ${promocion.activa ? 'bg-success' : 'bg-danger'}">
                            ${promocion.activa ? 'Activa' : 'Inactiva'}
                        </span>
                    </td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-info" onclick="mostrarModalEditar(${promocion.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="mostrarModalEliminar(${promocion.id}, 'promociones')">Eliminar</button>
                    </td>
                `;
                listaPromociones.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al cargar las promociones:', error);
            mostrarError('Error al cargar las promociones');
        });
}

function cargarProductosParaSelect(selectId) {
    console.log(`Cargando productos para select: ${selectId}`);
    fetch(`${API_URL}/productos`)
        .then(response => response.json())
        .then(productos => {
            console.log('Productos para select cargados:', productos);
            const select = document.getElementById(selectId);
            select.innerHTML = '';
            
            productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.id;
                option.textContent = `${producto.nombre} (${producto.codigo})`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar productos para select:', error);
            mostrarError('Error al cargar productos para el selector');
        });
}

// Funciones para operaciones CRUD
function guardarProducto() {
    const productoId = document.getElementById('producto-id').value;
    const esEdicion = productoId !== '';
    
    const producto = {
        nombre: document.getElementById('producto-nombre').value,
        codigo: document.getElementById('producto-codigo').value,
        descripcion: document.getElementById('producto-descripcion').value,
        precio: parseFloat(document.getElementById('producto-precio').value),
        stock: parseInt(document.getElementById('producto-stock').value),
        categoriaId: parseInt(document.getElementById('producto-categoria-id').value),
        activo: document.getElementById('producto-activo').checked
    };
    
    console.log('Guardando producto:', producto);
    
    const url = esEdicion 
        ? `${API_URL}/productos/${productoId}` 
        : `${API_URL}/productos`;
    
    const method = esEdicion ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la operación');
        }
        return response.json();
    })
    .then(data => {
        console.log('Producto guardado:', data);
        modalProducto.hide();
        mostrarMensaje(esEdicion ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
        cargarProductos();
    })
    .catch(error => {
        console.error('Error al guardar producto:', error);
        mostrarError('Error al guardar el producto');
    });
}

function guardarCategoria() {
    const categoriaId = document.getElementById('categoria-id').value;
    const esEdicion = categoriaId !== '';
    
    const categoria = {
        nombre: document.getElementById('categoria-nombre').value,
        descripcion: document.getElementById('categoria-descripcion').value
    };
    
    console.log('Guardando categoría:', categoria);
    
    const url = esEdicion 
        ? `${API_URL}/categorias/${categoriaId}` 
        : `${API_URL}/categorias`;
    
    const method = esEdicion ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la operación');
        }
        return response.json();
    })
    .then(data => {
        console.log('Categoría guardada:', data);
        modalCategoria.hide();
        mostrarMensaje(esEdicion ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente');
        cargarCategorias();
        // También actualizamos el select en el formulario de productos
        cargarCategorias(true);
    })
    .catch(error => {
        console.error('Error al guardar categoría:', error);
        mostrarError('Error al guardar la categoría');
    });
}

function guardarPromocion() {
    const promocionId = document.getElementById('promocion-id').value;
    const esEdicion = promocionId !== '';
    
    const promocion = {
        nombre: document.getElementById('promocion-nombre').value,
        descripcion: document.getElementById('promocion-descripcion').value,
        productoId: parseInt(document.getElementById('promocion-producto-id').value),
        descuentoPorcentaje: parseFloat(document.getElementById('promocion-descuento').value),
        fechaInicio: document.getElementById('promocion-fecha-inicio').value,
        fechaFin: document.getElementById('promocion-fecha-fin').value,
        activa: document.getElementById('promocion-activa').checked
    };
    
    console.log('Guardando promoción:', promocion);
    
    const url = esEdicion 
        ? `${API_URL}/promociones/${promocionId}` 
        : `${API_URL}/promociones`;
    
    const method = esEdicion ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(promocion)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la operación');
        }
        return response.json();
    })
    .then(data => {
        console.log('Promoción guardada:', data);
        modalPromocion.hide();
        mostrarMensaje(esEdicion ? 'Promoción actualizada correctamente' : 'Promoción creada correctamente');
        cargarPromociones();
    })
    .catch(error => {
        console.error('Error al guardar promoción:', error);
        mostrarError('Error al guardar la promoción');
    });
}

function confirmarEliminar() {
    if (!itemToDelete) return;
    
    const { id, tipo } = itemToDelete;
    const url = `${API_URL}/${tipo}/${id}`;
    
    console.log(`Eliminando ${tipo} con ID ${id}`);
    
    fetch(url, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar');
        }
        modalConfirmar.hide();
        mostrarMensaje('Elemento eliminado correctamente');
        
        // Recargar la lista correspondiente
        switch(tipo) {
            case 'productos':
                cargarProductos();
                break;
            case 'categorias':
                cargarCategorias();
                cargarCategorias(true);
                break;
            case 'promociones':
                cargarPromociones();
                break;
        }
    })
    .catch(error => {
        console.error('Error al eliminar:', error);
        modalConfirmar.hide();
        mostrarError('Error al eliminar el elemento');
    })
    .finally(() => {
        itemToDelete = null;
    });
}

// Funciones para búsqueda y filtros
function buscarProductos() {
    const termino = document.getElementById('buscar-producto').value.trim();
    
    if (!termino) {
        cargarProductos();
        return;
    }
    
    console.log(`Buscando productos con término: ${termino}`);
    
    fetch(`${API_URL}/productos/buscar?q=${encodeURIComponent(termino)}`)
        .then(response => response.json())
        .then(productos => {
            console.log('Resultados de búsqueda:', productos);
            const listaProductos = document.getElementById('lista-productos');
            listaProductos.innerHTML = '';
            
            if (productos.length === 0) {
                listaProductos.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center">No se encontraron productos con el término "${termino}"</td>
                    </tr>
                `;
                return;
            }
            
            productos.forEach(producto => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.codigo}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.categoria_nombre || 'Sin categoría'}</td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-info" onclick="mostrarModalEditar(${producto.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="mostrarModalEliminar(${producto.id}, 'productos')">Eliminar</button>
                    </td>
                `;
                listaProductos.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al buscar productos:', error);
            mostrarError('Error al buscar productos');
        });
}

function mostrarProductosEnStock() {
    console.log('Cargando productos en stock');
    fetch(`${API_URL}/productos/en_stock`)
        .then(response => response.json())
        .then(productos => {
            console.log('Productos en stock:', productos);
            const listaProductos = document.getElementById('lista-productos');
            listaProductos.innerHTML = '';
            
            if (productos.length === 0) {
                listaProductos.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center">No hay productos en stock</td>
                    </tr>
                `;
                return;
            }
            
            productos.forEach(producto => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.codigo}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.categoria_nombre || 'Sin categoría'}</td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-info" onclick="mostrarModalEditar(${producto.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="mostrarModalEliminar(${producto.id}, 'productos')">Eliminar</button>
                    </td>
                `;
                listaProductos.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al cargar productos en stock:', error);
            mostrarError('Error al cargar productos en stock');
        });
}

function verProductosCategoria(categoriaId) {
    console.log(`Viendo productos de categoría ${categoriaId}`);
    fetch(`${API_URL}/categorias/${categoriaId}/productos`)
        .then(response => response.json())
        .then(productos => {
            console.log('Productos de categoría:', productos);
            // Cambiar a la sección de productos
            cambiarSeccion('productos');
            
            // Mostrar los productos filtrados
            const listaProductos = document.getElementById('lista-productos');
            listaProductos.innerHTML = '';
            
            if (productos.length === 0) {
                listaProductos.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center">No hay productos en esta categoría</td>
                    </tr>
                `;
                return;
            }
            
            productos.forEach(producto => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.codigo}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.categoria_nombre || 'Sin categoría'}</td>
                    <td class="action-buttons">
                        <button class="btn btn-sm btn-info" onclick="mostrarModalEditar(${producto.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="mostrarModalEliminar(${producto.id}, 'productos')">Eliminar</button>
                    </td>
                `;
                listaProductos.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al cargar productos de categoría:', error);
            mostrarError('Error al cargar productos de la categoría');
        });
}

// Funciones de utilidad
function mostrarMensaje(mensaje) {
    mensajeEstado.textContent = mensaje;
    mensajeEstado.classList.remove('d-none', 'alert-danger');
    mensajeEstado.classList.add('alert-success', 'fade-in-out');
    
    setTimeout(() => {
        mensajeEstado.classList.add('d-none');
        mensajeEstado.classList.remove('fade-in-out');
    }, 4000);
}

function mostrarError(mensaje) {
    mensajeEstado.textContent = mensaje;
    mensajeEstado.classList.remove('d-none', 'alert-success');
    mensajeEstado.classList.add('alert-danger', 'fade-in-out');
    
    setTimeout(() => {
        mensajeEstado.classList.add('d-none');
        mensajeEstado.classList.remove('fade-in-out');
    }, 4000);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}