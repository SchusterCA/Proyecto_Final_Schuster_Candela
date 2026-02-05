
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const contenedorLogin = document.getElementById('contenedor-login');
const contenedorRegistro = document.getElementById('contenedor-registro');
const linkRegistro = document.getElementById('link-registro');
const linkLogin = document.getElementById('link-login');


document.addEventListener('DOMContentLoaded', function() {

    if (auth.estaLogueado()) {
        redirigirUsuarioLogueado();
        return;
    }
    

    registrarUsuarioDemo();
    

    configurarEventos();
});


function registrarUsuarioDemo() {
    const usuarios = auth.obtenerUsuarios();
    const existeDemo = usuarios.find(u => u.email === 'duelista@grieta.com');
    
    if (!existeDemo) {
        auth.registrarUsuario('Duelista Demo', 'duelista@grieta.com', '123456');
    }
}


function configurarEventos() {

    linkRegistro.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarFormulario('registro');
    });


    linkLogin.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarFormulario('login');
    });


    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        procesarLogin();
    });


    formRegistro.addEventListener('submit', function(e) {
        e.preventDefault();
        procesarRegistro();
    });
}


function mostrarFormulario(tipo) {
    if (tipo === 'registro') {
        contenedorLogin.style.display = 'none';
        contenedorRegistro.style.display = 'block';
        limpiarMensajes();
    } else {
        contenedorRegistro.style.display = 'none';
        contenedorLogin.style.display = 'block';
        limpiarMensajes();
    }
}


function procesarLogin() {
    const email = document.getElementById('email-login').value.trim();
    const password = document.getElementById('password-login').value;
    const mensajeError = document.getElementById('mensaje-error');
    

    if (!email || !password) {
        mostrarError(mensajeError, 'Completá todos los campos');
        return;
    }
    

    const resultado = auth.iniciarSesion(email, password);
    
    if (resultado.success) {
        Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: resultado.mensaje,
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            redirigirUsuarioLogueado();
        });
    } else {
        mostrarError(mensajeError, resultado.mensaje);
        

        formLogin.classList.add('shake');
        setTimeout(() => formLogin.classList.remove('shake'), 500);
    }
}


function procesarRegistro() {
    const nombre = document.getElementById('nombre-registro').value.trim();
    const email = document.getElementById('email-registro').value.trim();
    const password = document.getElementById('password-registro').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const mensajeRegistro = document.getElementById('mensaje-registro');
    

    if (password !== passwordConfirm) {
        mostrarError(mensajeRegistro, 'Las contraseñas no coinciden');
        return;
    }
    

    const resultado = auth.registrarUsuario(nombre, email, password);
    
    if (resultado.success) {

        Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Ya podés iniciar sesión con tu cuenta',
            confirmButtonColor: '#00b894'
        }).then(() => {

            mostrarFormulario('login');
            

            document.getElementById('email-login').value = email;
            document.getElementById('password-login').value = '';
            document.getElementById('password-login').focus();
        });
    } else {

        mostrarError(mensajeRegistro, resultado.mensaje);
    }
}


function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.classList.remove('d-none', 'alert-success');
    elemento.classList.add('alert-danger');
}


function limpiarMensajes() {
    const mensajeError = document.getElementById('mensaje-error');
    const mensajeRegistro = document.getElementById('mensaje-registro');
    
    if (mensajeError) {
        mensajeError.classList.add('d-none');
    }
    if (mensajeRegistro) {
        mensajeRegistro.classList.add('d-none');
    }
}


function redirigirUsuarioLogueado() {

    const urlRetorno = localStorage.getItem('urlRetorno');
    
    if (urlRetorno) {
        localStorage.removeItem('urlRetorno');
        window.location.href = urlRetorno;
    } else {
        window.location.href = '../index.html';
    }
}
