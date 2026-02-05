const cartas = [
    { nombre: "Charizard", precio: 250, juego: "Pokémon", stock: 5, imagen: "../img/charizard.jpg" },
    { nombre: "Black Lotus", precio: 15000, juego: "Magic: The Gathering", stock: 0, imagen: "../img/blacklotus.webp" },
    { nombre: "Dragón Blanco de Ojos Azules", precio: 120, juego: "Yu-Gi-Oh!", stock: 3, imagen: "../img/dragonblanco.jpg" }
];


function renderizarCartas() {
    const contenedor = document.getElementById('contenedor-cartas');
    
    cartas.forEach(carta => {

        let stockBadge = '';
        let botonEstado = '';
        
        if (carta.stock === 0) {
            stockBadge = 'bg-danger';
            botonEstado = 'disabled';
        } else if (carta.stock <= 2) {
            stockBadge = 'bg-warning text-dark';
            botonEstado = '';
        } else {
            stockBadge = 'bg-success';
            botonEstado = '';
        }
        
        const cardHTML = `
            <div class="col-md-4">
                <div class="card h-100 shadow-sm ${carta.stock === 0 ? 'opacity-75' : ''}">
                    <img src="${carta.imagen}" class="card-img-top" alt="${carta.nombre}" style="height: 400px; object-fit: cover;">
                    ${carta.stock === 0 ? '<div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style="background: rgba(0,0,0,0.5);"><span class="badge bg-danger fs-4">AGOTADO</span></div>' : ''}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${carta.nombre}</h5>
                        <p class="card-text text-muted">${carta.juego}</p>
                        <div class="mb-3">
                            <p class="mb-1"><strong>Precio:</strong> <span class="text-success fs-4">$${carta.precio.toLocaleString()}</span></p>
                            <p class="mb-0">
                                <strong>Stock disponible:</strong> 
                                <span class="badge ${stockBadge}">${carta.stock} unidad${carta.stock !== 1 ? 'es' : ''}</span>
                            </p>
                        </div>
                        <button class="btn btn-primary mt-auto" onclick="agregarAlCarrito('${carta.nombre}')" ${botonEstado}>
                            <i class="bi bi-cart-plus"></i> ${carta.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        contenedor.innerHTML += cardHTML;
    });
}


function agregarAlCarrito(nombreCarta) {
    const carta = cartas.find(c => c.nombre === nombreCarta);
    
    if (carta) {

        if (carta.stock === 0) {
            mostrarMensaje(`${carta.nombre} no tiene stock disponible`, 'danger');
            return;
        }

        const resultado = carritoCompras.agregarItem(carta, carta.stock);
        
        if (resultado.success) {
            mostrarMensaje(resultado.mensaje, 'success');
        } else {
            mostrarMensaje(resultado.mensaje, 'warning');
        }
    }
}


function mostrarMensaje(mensaje, tipo) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}


document.addEventListener('DOMContentLoaded', function() {
    renderizarCartas();
    carritoCompras.actualizarContador();
});
