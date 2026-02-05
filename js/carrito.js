

class Carrito {
    constructor() {

        this.items = this.cargarCarrito();
    }


    cargarCarrito() {
        try {
            const carritoGuardado = localStorage.getItem('carrito');
            return carritoGuardado ? JSON.parse(carritoGuardado) : [];
        } catch (error) {
            return [];
        }
    }


    guardarCarrito() {
        try {
            localStorage.setItem('carrito', JSON.stringify(this.items));
        } catch (error) {

        }
    }


    agregarItem(producto) {

        const itemExistente = this.items.find(item => item.id === producto.id);
        
        if (itemExistente) {

            if (itemExistente.cantidad >= producto.stock) {
                return {
                    success: false,
                    mensaje: `No hay más stock disponible de ${producto.nombre}`
                };
            }
            itemExistente.cantidad++;
        } else {

            this.items.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                juego: producto.juego,
                imagen: producto.imagen,
                codigo: producto.codigo,
                stockDisponible: producto.stock,
                cantidad: 1
            });
        }
        
        this.guardarCarrito();
        this.actualizarContador();
        
        return {
            success: true,
            mensaje: `${producto.nombre} agregado al carrito`
        };
    }


    eliminarItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.guardarCarrito();
        this.actualizarContador();
    }


    aumentarCantidad(itemId) {
        const item = this.items.find(item => item.id === itemId);
        
        if (item) {

            if (item.cantidad >= item.stockDisponible) {
                return {
                    success: false,
                    mensaje: `Stock máximo alcanzado (${item.stockDisponible} unidades)`
                };
            }
            
            item.cantidad++;
            this.guardarCarrito();
            
            return {
                success: true,
                mensaje: 'Cantidad actualizada'
            };
        }
        
        return {
            success: false,
            mensaje: 'Producto no encontrado en el carrito'
        };
    }


    disminuirCantidad(itemId) {
        const item = this.items.find(item => item.id === itemId);
        
        if (item) {
            if (item.cantidad > 1) {
                item.cantidad--;
                this.guardarCarrito();
            } else {

                this.eliminarItem(itemId);
            }
        }
    }


    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }


    obtenerPrecioTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.precio * item.cantidad);
        }, 0);
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
            

            if (total > 0) {
                contador.style.display = 'flex';

                contador.classList.add('pulse');
                setTimeout(() => contador.classList.remove('pulse'), 300);
            } else {
                contador.style.display = 'none';
            }
        }
    }


    estaVacio() {
        return this.items.length === 0;
    }


    obtenerResumen() {
        return {
            cantidadItems: this.items.length,
            cantidadTotal: this.obtenerCantidadTotal(),
            precioTotal: this.obtenerPrecioTotal()
        };
    }
}


const carritoCompras = new Carrito();
