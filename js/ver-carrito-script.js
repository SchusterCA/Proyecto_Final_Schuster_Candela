
document.addEventListener('DOMContentLoaded', function() {

    actualizarEstadoUsuario();
    

    renderizarCarrito();
    

    configurarBotonCompra();
});


function actualizarEstadoUsuario() {
    const nombreUsuarioNav = document.getElementById('nombre-usuario-nav');
    const btnLogout = document.getElementById('btn-logout');
    
    if (auth.estaLogueado()) {
        nombreUsuarioNav.textContent = `Hola, ${auth.obtenerNombreUsuario()}`;
        btnLogout.style.display = 'inline-block';
    } else {
        nombreUsuarioNav.textContent = '';
        btnLogout.style.display = 'none';
    }
}


function cerrarSesion() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Tendrás que iniciar sesión nuevamente para comprar',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#00b894',
        cancelButtonColor: '#d63031',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            auth.cerrarSesion();
            
            Toastify({
                text: "Sesión cerrada correctamente",
                duration: 2000,
                gravity: 'top',
                position: 'right',
                style: {
                    background: 'linear-gradient(to right, #00b894, #00cec9)',
                    borderRadius: '10px'
                }
            }).showToast();
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    });
}


function renderizarCarrito() {
    const contenedor = document.getElementById('items-carrito');
    const carritoVacio = document.getElementById('carrito-vacio');
    const btnComprar = document.getElementById('btn-comprar');
    const btnVaciar = document.getElementById('btn-vaciar');
    

    if (carritoCompras.items.length === 0) {
        contenedor.style.display = 'none';
        carritoVacio.style.display = 'block';
        btnComprar.disabled = true;
        btnVaciar.disabled = true;
    } else {
        contenedor.style.display = 'block';
        carritoVacio.style.display = 'none';
        btnComprar.disabled = false;
        btnVaciar.disabled = false;
        

        contenedor.innerHTML = '';
        
        carritoCompras.items.forEach(item => {
            const itemHTML = crearItemCarritoHTML(item);
            contenedor.innerHTML += itemHTML;
        });
    }
    

    actualizarTotales();
}


function crearItemCarritoHTML(item) {
    const subtotalItem = item.precio * item.cantidad;
    
    return `
        <div class="card mb-3 shadow-sm item-carrito" data-item-id="${item.id}">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.imagen}" alt="${item.nombre}" class="img-fluid rounded" style="max-height: 80px; object-fit: cover;">
                    </div>
                    <div class="col-md-4">
                        <h5 class="mb-1">${item.nombre}</h5>
                        <p class="text-muted mb-0 small">${item.juego} - ${item.codigo}</p>
                    </div>
                    <div class="col-md-2 text-center">
                        <p class="mb-0 precio-unitario"><strong>$${formatearPrecio(item.precio)}</strong></p>
                        <small class="text-muted">c/u</small>
                    </div>
                    <div class="col-md-2">
                        <div class="input-group input-group-sm cantidad-control">
                            <button class="btn btn-outline-secondary" onclick="disminuirCantidad(${item.id})" title="Disminuir cantidad">
                                <i class="bi bi-dash"></i>
                            </button>
                            <input type="text" class="form-control text-center" value="${item.cantidad}" readonly>
                            <button class="btn btn-outline-secondary" onclick="aumentarCantidad(${item.id})" title="Aumentar cantidad">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                        <small class="text-muted d-block text-center mt-1">Max: ${item.stockDisponible}</small>
                    </div>
                    <div class="col-md-2 text-end">
                        <p class="mb-1 fw-bold text-success">$${formatearPrecio(subtotalItem)}</p>
                        <button class="btn btn-outline-danger btn-sm" onclick="confirmarEliminarItem(${item.id}, '${item.nombre}')" title="Eliminar del carrito">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function formatearPrecio(precio) {
    return precio.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


function actualizarTotales() {
    const total = carritoCompras.obtenerPrecioTotal();
    document.getElementById('subtotal').textContent = `$${formatearPrecio(total)}`;
    document.getElementById('total').textContent = `$${formatearPrecio(total)}`;
}


function aumentarCantidad(itemId) {
    const resultado = carritoCompras.aumentarCantidad(itemId);
    
    if (!resultado.success) {
        Toastify({
            text: resultado.mensaje,
            duration: 3000,
            gravity: 'top',
            position: 'right',
            style: {
                background: 'linear-gradient(to right, #fdcb6e, #e17055)',
                borderRadius: '10px'
            }
        }).showToast();
    }
    
    renderizarCarrito();
}


function disminuirCantidad(itemId) {
    const item = carritoCompras.items.find(i => i.id === itemId);
    
    if (item && item.cantidad === 1) {

        confirmarEliminarItem(itemId, item.nombre);
    } else {
        carritoCompras.disminuirCantidad(itemId);
        renderizarCarrito();
    }
}


function confirmarEliminarItem(itemId, nombreItem) {
    Swal.fire({
        title: '¿Eliminar producto?',
        text: `¿Querés eliminar "${nombreItem}" del carrito?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d63031',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carritoCompras.eliminarItem(itemId);
            renderizarCarrito();
            
            Toastify({
                text: "Producto eliminado del carrito",
                duration: 2000,
                gravity: 'top',
                position: 'right',
                style: {
                    background: 'linear-gradient(to right, #00b894, #00cec9)',
                    borderRadius: '10px'
                }
            }).showToast();
        }
    });
}


function confirmarVaciarCarrito() {
    Swal.fire({
        title: '¿Vaciar carrito?',
        text: 'Se eliminarán todos los productos del carrito',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d63031',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, vaciar todo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carritoCompras.vaciarCarrito();
            renderizarCarrito();
            
            Swal.fire({
                icon: 'success',
                title: 'Carrito vacío',
                text: 'Se eliminaron todos los productos',
                confirmButtonColor: '#00b894'
            });
        }
    });
}


function configurarBotonCompra() {
    const btnComprar = document.getElementById('btn-comprar');
    
    btnComprar.addEventListener('click', function() {
        procesarCompra();
    });
}


function procesarCompra() {

    if (carritoCompras.items.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'Agregá productos antes de realizar la compra',
            confirmButtonColor: '#00b894'
        });
        return;
    }
    

    if (!auth.estaLogueado()) {
        Swal.fire({
            title: 'Iniciá sesión',
            text: 'Tenés que iniciar sesión para completar la compra',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#00b894',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ir a login',
            cancelButtonText: 'Seguir mirando'
        }).then((result) => {
            if (result.isConfirmed) {

                localStorage.setItem('urlRetorno', window.location.href);
                window.location.href = 'login.html';
            }
        });
        return;
    }
    

    const resumen = carritoCompras.obtenerResumen();
    const itemsHTML = carritoCompras.items.map(item => 
        `<li>${item.nombre} x${item.cantidad} - $${formatearPrecio(item.precio * item.cantidad)}</li>`
    ).join('');
    
    Swal.fire({
        title: 'Confirmar compra',
        html: `
            <div class="text-start">
                <p><strong>Hola ${auth.obtenerNombreUsuario()}</strong>, confirmá tu pedido:</p>
                <ul class="list-unstyled">${itemsHTML}</ul>
                <hr>
                <p class="text-end"><strong>Total: $${formatearPrecio(resumen.precioTotal)}</strong></p>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#00b894',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Confirmar compra',
        cancelButtonText: 'Revisar carrito',
        showLoaderOnConfirm: true,
        preConfirm: () => {

            return new Promise((resolve) => {
                setTimeout(resolve, 1500);
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {

            const numeroOrden = generarNumeroOrden();
            

            carritoCompras.vaciarCarrito();
            

            Swal.fire({
                icon: 'success',
                title: '¡Compra realizada!',
                html: `
                    <p>Gracias por tu compra, <strong>${auth.obtenerNombreUsuario()}</strong></p>
                    <p>Tu número de orden es: <strong>#${numeroOrden}</strong></p>
                    <p class="text-muted">Recibirás un email de confirmación en breve.</p>
                `,
                confirmButtonColor: '#00b894',
                confirmButtonText: 'Seguir comprando'
            }).then(() => {
                window.location.href = '../index.html';
            });
        }
    });
}


function generarNumeroOrden() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GD-${timestamp}-${random}`;
}
