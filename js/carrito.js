
class Carrito {
    constructor() {
        this.items = this.cargarCarrito();
    }

    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carrito');
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }


    agregarItem(carta) {
        const itemExistente = this.items.find(item => item.nombre === carta.nombre);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            this.items.push({
                nombre: carta.nombre,
                precio: carta.precio,
                juego: carta.juego,
                cantidad: 1
            });
        }
        
        this.guardarCarrito();
        this.actualizarContador();
    }


    eliminarItem(nombreCarta) {
        this.items = this.items.filter(item => item.nombre !== nombreCarta);
        this.guardarCarrito();
        this.actualizarContador();
    }


    aumentarCantidad(nombreCarta) {
        const item = this.items.find(item => item.nombre === nombreCarta);
        if (item) {
            item.cantidad++;
            this.guardarCarrito();
        }
    }


    disminuirCantidad(nombreCarta) {
        const item = this.items.find(item => item.nombre === nombreCarta);
        if (item && item.cantidad > 1) {
            item.cantidad--;
            this.guardarCarrito();
        } else if (item && item.cantidad === 1) {
            this.eliminarItem(nombreCarta);
        }
    }


    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }


    obtenerPrecioTotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }


    vaciarCarrito() {
        this.items = [];
        this.guardarCarrito();
        this.actualizarContador();
    }


    actualizarContador() {
        const contador = document.getElementById('contador-carrito');
        if (contador) {
            const total = this.obtenerCantidadTotal();
            contador.textContent = total;
            contador.style.display = total > 0 ? 'inline-block' : 'none';
        }
    }
}


const carritoCompras = new Carrito();