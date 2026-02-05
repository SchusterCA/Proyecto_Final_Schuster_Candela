const cartas = [
    { nombre: "Charizard", precio: 250, juego: "Pokémon", stock: 5 },
    { nombre: "Black Lotus", precio: 15000, juego: "Magic", stock: 1 },
    { nombre: "Dragón Blanco", precio: 120, juego: "Yu-Gi-Oh!", stock: 3 }
];

const usuarios = [];

function buscarCarta(nombreCarta) {
    for (let i = 0; i < cartas.length; i++) {
        if (cartas[i].nombre.toLowerCase() === nombreCarta.toLowerCase()) {
            return cartas[i];
        }
    }
    return null;
}

function mostrarCartasEnAlert() {
    let mensaje = "--- Cartas disponibles ---\n\n";
    for (let carta of cartas) {
        mensaje += `${carta.nombre}\n`;
        mensaje += `Juego: ${carta.juego}\n`;
        mensaje += `Precio: $${carta.precio}\n`;
        mensaje += `Stock: ${carta.stock}\n\n`;
    }
    alert(mensaje);
}

function mostrarUsuariosEnAlert() {
    let mensaje = "--- Usuarios registrados ---\n\n";
    for (let usuario of usuarios) {
        mensaje += `Nombre: ${usuario.nombre}\n`;
        mensaje += `Email: ${usuario.email}\n`;
        mensaje += `Fecha: ${usuario.fechaRegistro}\n\n`;
    }
    alert(mensaje);
}

function iniciarTienda() {
    const opcion = prompt(`¿Qué te gustaría hacer?
1. Ver todas las cartas
2. Buscar una carta específica
3. Registrarte como usuario
4. Salir`);

    if (opcion === "1") {
        window.location.href = "html/cartas.html";
        
    } else if (opcion === "2") {
        const nombreBuscado = prompt("Ingresa el nombre de la carta que buscas:");
        const cartaEncontrada = buscarCarta(nombreBuscado);
        
        if (cartaEncontrada) {
            let mensaje = `¡ENCONTRADA!\n\n`;
            mensaje += `Carta: ${cartaEncontrada.nombre}\n`;
            mensaje += `Juego: ${cartaEncontrada.juego}\n`;
            mensaje += `Precio: $${cartaEncontrada.precio}\n`;
            mensaje += `Stock: ${cartaEncontrada.stock}`;
            
            alert(mensaje);
            
            if (cartaEncontrada.stock > 0) {
                const comprar = confirm("¿Te gustaría comprar esta carta?");
                if (comprar) {
                    alert("¡Compra realizada con éxito!");
                }
            } else {
                alert("Lo sentimos, esta carta está agotada");
            }
        } else {
            alert("No encontramos esa carta en nuestro inventario");
        }
        iniciarTienda(); 
        
    } else if (opcion === "3") {
        window.location.href = "html/login.html";
        
    } else if (opcion === "4") {
        alert("¡Gracias por visitar nuestra tienda!");
    } else {
        alert("Opción no válida. Por favor, elige una opción del 1 al 4");
        iniciarTienda(); 
    }
}


iniciarTienda();
