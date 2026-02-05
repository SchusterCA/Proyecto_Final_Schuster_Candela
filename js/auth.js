class Auth {
    constructor() {
        this.usuarioActual = this.obtenerUsuarioActual();
    }


    estaLogueado() {
        return this.usuarioActual !== null;
    }


    obtenerUsuarioActual() {
        const usuario = localStorage.getItem('usuarioActual');
        return usuario ? JSON.parse(usuario) : null;
    }


    iniciarSesion(email, password) {

        const usuarios = this.obtenerUsuarios();
        

        const usuario = usuarios.find(u => u.email === email && u.password === password);
        
        if (usuario) {

            const sesion = {
                nombre: usuario.nombre,
                email: usuario.email,
                fechaLogin: new Date().toISOString()
            };
            localStorage.setItem('usuarioActual', JSON.stringify(sesion));
            this.usuarioActual = sesion;
            return true;
        }
        
        return false;
    }


    registrarUsuario(nombre, email, password) {
        const usuarios = this.obtenerUsuarios();
        

        if (usuarios.find(u => u.email === email)) {
            return { success: false, mensaje: 'El email ya está registrado' };
        }


        const nuevoUsuario = {
            nombre,
            email,
            password,
            fechaRegistro: new Date().toISOString()
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        return { success: true, mensaje: 'Usuario registrado exitosamente' };
    }


    cerrarSesion() {
        localStorage.removeItem('usuarioActual');
        this.usuarioActual = null;
    }


    obtenerUsuarios() {
        const usuarios = localStorage.getItem('usuarios');
        return usuarios ? JSON.parse(usuarios) : [];
    }


    obtenerNombreUsuario() {
        return this.usuarioActual ? this.usuarioActual.nombre : null;
    }
}


const auth = new Auth();
