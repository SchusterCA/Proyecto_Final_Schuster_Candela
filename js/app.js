
class Tienda {
    constructor() {

        this.productos = [];
        this.categorias = [];
        this.productosFiltrados = [];
        this.categoriaActual = 'todos';
        this.terminoBusqueda = '';
        this.ordenActual = 'default';
        

        this.contenedorProductos = document.getElementById('contenedor-productos');
        this.contenedorFiltros = document.getElementById('filtros-categorias');
        this.inputBusqueda = document.getElementById('input-busqueda');
        this.formBusqueda = document.getElementById('form-busqueda');
        this.selectOrdenar = document.getElementById('ordenar-select');
        this.tituloSeccion = document.getElementById('titulo-seccion');
        this.loadingElement = document.getElementById('loading');
        this.sinResultados = document.getElementById('sin-resultados');
        this.btnLimpiarBusqueda = document.getElementById('btn-limpiar-busqueda');
    }


    async inicializar() {
        try {

            this.mostrarLoading(true);
            

            await this.cargarProductos();
            

            this.renderizarFiltros();
            this.aplicarFiltrosYOrden();
            

            this.configurarEventos();
            

            this.actualizarHeaderUsuario();
            

            carritoCompras.actualizarContador();
            
        } catch (error) {
            this.mostrarError('Error al cargar la tienda. Por favor, recargá la página.');
        } finally {
            this.mostrarLoading(false);
        }
    }


    async cargarProductos() {
        try {
            const response = await fetch('./data/productos.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.productos = data.productos;
            this.categorias = data.categorias;
            this.productosFiltrados = [...this.productos];
            
        } catch (error) {
            throw new Error('No se pudieron cargar los productos');
        }
    }

    renderizarFiltros() {
        this.contenedorFiltros.innerHTML = '';
        
        this.categorias.forEach(categoria => {
            const btnFiltro = document.createElement('button');
            btnFiltro.className = `btn-filtro ${categoria.id === this.categoriaActual ? 'activo' : ''}`;
            btnFiltro.dataset.categoria = categoria.id;
            btnFiltro.textContent = categoria.nombre;
            
            btnFiltro.addEventListener('click', () => this.filtrarPorCategoria(categoria.id));
            
            this.contenedorFiltros.appendChild(btnFiltro);
        });
    }



     
    renderizarProductos(productos) {
        this.contenedorProductos.innerHTML = '';
        
        if (productos.length === 0) {
            this.sinResultados.style.display = 'flex';
            return;
        }
        
        this.sinResultados.style.display = 'none';
        
        productos.forEach(producto => {
            const cardHTML = this.crearCardProducto(producto);
            this.contenedorProductos.innerHTML += cardHTML;
        });
        

        this.agregarEventosBotones();
    }


    crearCardProducto(producto) {
        const stockBadge = this.obtenerBadgeStock(producto.stock);
        const btnDisabled = producto.stock === 0 ? 'disabled' : '';
        const btnTexto = producto.stock === 0 ? 'Sin stock' : 'Añadir al carro';
        const cardOpacity = producto.stock === 0 ? 'opacity-50' : '';
        
        return `
            <div class="y-card ${cardOpacity}" data-producto-id="${producto.id}">
                <div class="card-img-container">
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                    ${producto.stock === 0 ? '<div class="agotado-overlay"><span>AGOTADO</span></div>' : ''}
                </div>
                
                <h4 class="cardtitle">${producto.nombre}</h4>
                
                <p class="edition">${producto.codigo}</p>
                
                <p class="description">${producto.descripcion}</p>
                
                <div class="stock-badge ${stockBadge.clase}">
                    ${stockBadge.texto}
                </div>
                
                <p class="price">$${this.formatearPrecio(producto.precio)} ARS</p>
                
                <button class="buy-btn" data-producto-id="${producto.id}" ${btnDisabled}>
                    ${btnTexto}
                </button>
            </div>
        `;
    }


    obtenerBadgeStock(stock) {
        if (stock === 0) {
            return { clase: 'stock-agotado', texto: 'Sin stock' };
        } else if (stock <= 3) {
            return { clase: 'stock-bajo', texto: `¡Últimas ${stock} unidades!` };
        } else {
            return { clase: 'stock-disponible', texto: `${stock} disponibles` };
        }
    }


    formatearPrecio(precio) {
        return precio.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }


    agregarEventosBotones() {
        const botones = document.querySelectorAll('.buy-btn:not([disabled])');
        
        botones.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productoId = parseInt(e.target.dataset.productoId);
                this.agregarAlCarrito(productoId);
            });
        });
    }


    agregarAlCarrito(productoId) {
        const producto = this.productos.find(p => p.id === productoId);
        
        if (!producto) {
            this.mostrarNotificacion('Producto no encontrado', 'error');
            return;
        }
        
        if (producto.stock === 0) {
            this.mostrarNotificacion(`${producto.nombre} no tiene stock disponible`, 'warning');
            return;
        }
        
        const resultado = carritoCompras.agregarItem(producto);
        
        if (resultado.success) {
            this.mostrarNotificacion(resultado.mensaje, 'success');
        } else {
            this.mostrarNotificacion(resultado.mensaje, 'warning');
        }
    }


    filtrarPorCategoria(categoriaId) {
        this.categoriaActual = categoriaId;
        

        document.querySelectorAll('.btn-filtro').forEach(btn => {
            btn.classList.toggle('activo', btn.dataset.categoria === categoriaId);
        });
        

        const categoria = this.categorias.find(c => c.id === categoriaId);
        this.tituloSeccion.textContent = categoria ? categoria.nombre : 'Todos los productos';
        
        this.aplicarFiltrosYOrden();
    }


    buscarProductos(termino) {
        this.terminoBusqueda = termino.toLowerCase().trim();
        this.aplicarFiltrosYOrden();
    }


    ordenarProductos(criterio) {
        this.ordenActual = criterio;
        this.aplicarFiltrosYOrden();
    }


    aplicarFiltrosYOrden() {

        let resultado = [...this.productos];
        

        if (this.categoriaActual !== 'todos') {
            resultado = resultado.filter(p => p.categoria === this.categoriaActual);
        }
        

        if (this.terminoBusqueda) {
            resultado = resultado.filter(p => 
                p.nombre.toLowerCase().includes(this.terminoBusqueda) ||
                p.descripcion.toLowerCase().includes(this.terminoBusqueda) ||
                p.codigo.toLowerCase().includes(this.terminoBusqueda) ||
                p.juego.toLowerCase().includes(this.terminoBusqueda)
            );
        }
        

        resultado = this.aplicarOrden(resultado);
        
        this.productosFiltrados = resultado;
        this.renderizarProductos(resultado);
    }


    aplicarOrden(productos) {
        const productosOrdenados = [...productos];
        
        switch (this.ordenActual) {
            case 'precio-asc':
                return productosOrdenados.sort((a, b) => a.precio - b.precio);
            case 'precio-desc':
                return productosOrdenados.sort((a, b) => b.precio - a.precio);
            case 'nombre-asc':
                return productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            case 'nombre-desc':
                return productosOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
            default:
                return productosOrdenados;
        }
    }

    limpiarFiltros() {
        this.categoriaActual = 'todos';
        this.terminoBusqueda = '';
        this.ordenActual = 'default';
        
        this.inputBusqueda.value = '';
        this.selectOrdenar.value = 'default';
        
        document.querySelectorAll('.btn-filtro').forEach(btn => {
            btn.classList.toggle('activo', btn.dataset.categoria === 'todos');
        });
        
        this.tituloSeccion.textContent = 'Todos los productos';
        this.aplicarFiltrosYOrden();
    }


    configurarEventos() {

        this.formBusqueda.addEventListener('submit', (e) => {
            e.preventDefault();
            this.buscarProductos(this.inputBusqueda.value);
        });
        

        let timeoutBusqueda;
        this.inputBusqueda.addEventListener('input', (e) => {
            clearTimeout(timeoutBusqueda);
            timeoutBusqueda = setTimeout(() => {
                this.buscarProductos(e.target.value);
            }, 300);
        });
        
        // Ordenamiento
        this.selectOrdenar.addEventListener('change', (e) => {
            this.ordenarProductos(e.target.value);
        });
        
        // Limpiar búsqueda
        this.btnLimpiarBusqueda.addEventListener('click', () => {
            this.limpiarFiltros();
        });
    }

    actualizarHeaderUsuario() {
        const nombreUsuarioSpan = document.getElementById('nombre-usuario-header');
        
        if (auth.estaLogueado()) {
            nombreUsuarioSpan.textContent = `Hola, ${auth.obtenerNombreUsuario()}`;
            nombreUsuarioSpan.style.display = 'inline';
        } else {
            nombreUsuarioSpan.style.display = 'none';
        }
    }


    mostrarLoading(mostrar) {
        if (this.loadingElement) {
            this.loadingElement.style.display = mostrar ? 'flex' : 'none';
        }
        if (this.contenedorProductos) {
            this.contenedorProductos.style.display = mostrar ? 'none' : 'grid';
        }
    }


    mostrarNotificacion(mensaje, tipo = 'success') {
        const colores = {
            success: 'linear-gradient(to right, #00b894, #00cec9)',
            error: 'linear-gradient(to right, #d63031, #e17055)',
            warning: 'linear-gradient(to right, #fdcb6e, #e17055)'
        };
        
        Toastify({
            text: mensaje,
            duration: 3000,
            gravity: 'top',
            position: 'right',
            style: {
                background: colores[tipo] || colores.success,
                borderRadius: '10px',
                fontFamily: 'Montserrat, sans-serif'
            },
            stopOnFocus: true
        }).showToast();
    }


    mostrarError(mensaje) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: mensaje,
            confirmButtonColor: '#00b894'
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {

    const tienda = new Tienda();
    tienda.inicializar();
    

    window.tienda = tienda;
});
