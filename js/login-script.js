document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');
    const contenedorLogin = document.getElementById('contenedor-login');
    const contenedorRegistro = document.getElementById('contenedor-registro');
    const linkRegistro = document.getElementById('link-registro');
    const linkLogin = document.getElementById('link-login');


    if (auth.estaLogueado()) {
        window.location.href = 'cartas.html';
    }


    linkRegistro.addEventListener('click', function(e) {
        e.preventDefault();
        contenedorLogin.style.display = 'none';
        contenedorRegistro.style.display = 'block';
        document.getElementById('mensaje-error').classList.add('d-none');
    });


    linkLogin.addEventListener('click', function(e) {
        e.preventDefault();
        contenedorRegistro.style.display = 'none';
        contenedorLogin.style.display = 'block';
        document.getElementById('mensaje-registro').classList.add('d-none');
    });


    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('exampleInputEmail1').value;
        const password = document.getElementById('exampleInputPassword1').value;
        const mensajeError = document.getElementById('mensaje-error');

        if (auth.iniciarSesion(email, password)) {

            window.location.href = 'cartas.html';
        } else {

            mensajeError.textContent = 'Email o contraseña incorrectos';
            mensajeError.classList.remove('d-none');
        }
    });


    formRegistro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre-registro').value;
        const email = document.getElementById('email-registro').value;
        const password = document.getElementById('password-registro').value;
        const mensajeRegistro = document.getElementById('mensaje-registro');

        const resultado = auth.registrarUsuario(nombre, email, password);
        
        mensajeRegistro.textContent = resultado.mensaje;
        mensajeRegistro.classList.remove('d-none');
        
        if (resultado.success) {
            mensajeRegistro.classList.remove('alert-danger');
            mensajeRegistro.classList.add('alert-success');
            

            formRegistro.reset();
            

            setTimeout(function() {
                contenedorRegistro.style.display = 'none';
                contenedorLogin.style.display = 'block';
                mensajeRegistro.classList.add('d-none');
            }, 2000);
        } else {
            mensajeRegistro.classList.remove('alert-success');
            mensajeRegistro.classList.add('alert-danger');
        }
    });
});