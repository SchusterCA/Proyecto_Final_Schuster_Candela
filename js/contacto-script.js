

document.addEventListener('DOMContentLoaded', function() {

    carritoCompras.actualizarContador();
    

    precargarDatosUsuario();
    

    configurarFormulario();
    

    configurarBusqueda();
});


function precargarDatosUsuario() {
    if (auth.estaLogueado()) {
        const nombreInput = document.getElementById('nombre');
        const emailInput = document.getElementById('email');
        
        nombreInput.value = auth.obtenerNombreUsuario();
        emailInput.value = auth.obtenerEmailUsuario();
    }
}


function configurarFormulario() {
    const form = document.getElementById('form-contacto');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        enviarFormulario();
    });
}


function enviarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const pedido = document.getElementById('pedido').value.trim();
    const producto = document.getElementById('producto').value.trim();
    const tipoConsulta = document.getElementById('tipo-consulta').value;
    const mensaje = document.getElementById('mensaje').value.trim();
    

    if (!nombre || !email || !tipoConsulta || !mensaje) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor completá todos los campos obligatorios',
            confirmButtonColor: '#00b894'
        });
        return;
    }
    

    Swal.fire({
        title: 'Enviando consulta...',
        html: 'Por favor esperá un momento',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    

    setTimeout(() => {

        const numeroTicket = generarNumeroTicket();
        

        guardarConsulta({
            ticket: numeroTicket,
            nombre,
            email,
            pedido,
            producto,
            tipoConsulta,
            mensaje,
            fecha: new Date().toISOString()
        });
        
        Swal.fire({
            icon: 'success',
            title: '¡Consulta enviada!',
            html: `
                <p>Gracias por contactarnos, <strong>${nombre}</strong></p>
                <p>Tu número de ticket es: <strong>#${numeroTicket}</strong></p>
                <p class="text-muted">Te responderemos a ${email} en las próximas 24-48 horas.</p>
            `,
            confirmButtonColor: '#00b894',
            confirmButtonText: 'Entendido'
        }).then(() => {

            document.getElementById('form-contacto').reset();
            

            precargarDatosUsuario();
        });
    }, 1500);
}


function generarNumeroTicket() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `TK-${timestamp}-${random}`;
}


function guardarConsulta(consulta) {
    try {
        const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
        consultas.push(consulta);
        localStorage.setItem('consultas', JSON.stringify(consultas));
    } catch (error) {

    }
}


function configurarBusqueda() {
    const formBusqueda = document.getElementById('form-busqueda');
    const inputBusqueda = document.getElementById('input-busqueda');
    
    if (formBusqueda) {
        formBusqueda.addEventListener('submit', function(e) {
            e.preventDefault();
            const termino = inputBusqueda.value.trim();
            if (termino) {

                window.location.href = `../index.html?buscar=${encodeURIComponent(termino)}`;
            }
        });
    }
}
