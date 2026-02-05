document.addEventListener('DOMContentLoaded', function() {
    if (auth.estaLogueado()) {
        document.getElementById('nombre-usuario').textContent = auth.obtenerNombreUsuario();
        document.getElementById('btn-logout').style.display = 'inline-block';
    }
    

    renderizarCarrito();
});


function cerrarSesion() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        auth.cerrarSesion();
        window.location.href = 'login.html';
    }
}


function renderizarCarrito() {
    const contenedor = document.getElementById('items-carrito');
    const carritoVacio = document.getElementById('carrito-vacio');
    
    if (carritoCompras.items.length === 0) {
        contenedor.style.display = 'none';
        carritoVacio.style.display = 'block';
        document.getElementById('btn-comprar').disabled = true;
    } else {
        contenedor.style.display = 'block';
        carritoVacio.style.display = 'none';
        document.getElementById('btn-comprar').disabled = false;
        
        contenedor.innerHTML = '';
        
        carritoCompras.items.forEach(item => {
            const itemHTML = `
                <div class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <h5 class="mb-1">${item.nombre}</h5>
                                <p class="text-muted mb-0">${item.juego}</p>
                            </div>
                            <div class="col-md-2 text-center">
                                <p class="mb-0"><strong>$${item.precio.toLocaleString()}</strong></p>
                            </div>
                            <div class="col-md-2">
                                <div class="input-group input-group-sm">
                                    <button class="btn btn-outline-secondary" onclick="disminuir('${item.nombre}')">
                                        <i class="bi bi-dash"></i>
                                    </button>
                                    <input type="text" class="form-control text-center" value="${item.cantidad}" readonly>
                                    <button class="btn btn-outline-secondary" onclick="aumentar('${item.nombre}')">
                                        <i class="bi bi-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-2 text-end">
                                <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito('${item.nombre}')">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            contenedor.innerHTML += itemHTML;
        });
    }
    
    actualizarTotales();
}


function actualizarTotales() {
    const total = carritoCompras.obtenerPrecioTotal();
    document.getElementById('subtotal').textContent = `$${total.toLocaleString()}`;
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}


function aumentar(nombreCarta) {
    const resultado = carritoCompras.aumentarCantidad(nombreCarta);
    
    if (!resultado.success && resultado.mensaje) {

        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${resultado.mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
    
    renderizarCarrito();
}


function disminuir(nombreCarta) {
    carritoCompras.disminuirCantidad(nombreCarta);
    renderizarCarrito();
}


function eliminarDelCarrito(nombreCarta) {
    if (confirm('¿Estás seguro de eliminar esta carta del carrito?')) {
        carritoCompras.eliminarItem(nombreCarta);
        renderizarCarrito();
    }
}


function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
        carritoCompras.vaciarCarrito();
        renderizarCarrito();
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-comprar').addEventListener('click', function() {

        if (!auth.estaLogueado()) {
            alert('Debes iniciar sesión para realizar la compra');

            localStorage.setItem('urlRetorno', window.location.href);
            window.location.href = 'login.html';
            return;
        }


        if (carritoCompras.items.length > 0) {
            const total = carritoCompras.obtenerPrecioTotal();
            alert(`¡Gracias por tu compra, ${auth.obtenerNombreUsuario()}!\nTotal: $${total.toLocaleString()}`);
            carritoCompras.vaciarCarrito();
            renderizarCarrito();
        }
    });
});