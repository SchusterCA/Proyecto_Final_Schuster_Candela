

class Auth {
    constructor() {

        this.usuarioActual = this.obtenerUsuarioActual();
    }


    estaLogueado() {
        return this.usuarioActual !== null;
    }


    obtenerUsuarioActual() {
        try {
            const usuario = localStorage.getItem('usuarioActual');
            return usuario ? JSON.parse(usuario) : null;
        } catch (error) {
            return null;
        }
    }


    iniciarSesion(email, password) {

        const usuarios = this.obtenerUsuarios();
        

        const usuario = usuarios.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );
        
        if (usuario) {

            const sesion = {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                fechaLogin: new Date().toISOString()
            };
            

            localStorage.setItem('usuarioActual', JSON.stringify(sesion));
            this.usuarioActual = sesion;
            
            return {
                success: true,
                mensaje: `¡Bienvenido/a ${usuario.nombre}!`
            };
        }
        
        return {
            success: false,
            mensaje: 'Email o contraseña incorrectos'
        };
    }


    registrarUsuario(nombre, email, password) {

        if (!nombre || nombre.trim().length < 2) {
            return {
                success: false,
                mensaje: 'El nombre debe tener al menos 2 caracteres'
            };
        }
        
        if (!this.validarEmail(email)) {
            return {
                success: false,
                mensaje: 'El formato del email no es válido'
            };
        }
        
        if (password.length < 6) {
            return {
                success: false,
                mensaje: 'La contraseña debe tener al menos 6 caracteres'
            };
        }
        
        const usuarios = this.obtenerUsuarios();
        

        if (usuarios.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return {
                success: false,
                mensaje: 'Este email ya está registrado'
            };
        }
        

        const nuevoUsuario = {
            id: this.generarId(),
            nombre: nombre.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            fechaRegistro: new Date().toISOString()
        };
        

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        return {
            success: true,
            mensaje: '¡Registro exitoso! Ya podés iniciar sesión'
        };
    }


    cerrarSesion() {
        localStorage.removeItem('usuarioActual');
        this.usuarioActual = null;
    }


    obtenerUsuarios() {
        try {
            const usuarios = localStorage.getItem('usuarios');
            return usuarios ? JSON.parse(usuarios) : [];
        } catch (error) {
            return [];
        }
    }


    obtenerNombreUsuario() {
        return this.usuarioActual ? this.usuarioActual.nombre : null;
    }


    obtenerEmailUsuario() {
        return this.usuarioActual ? this.usuarioActual.email : null;
    }


    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }


    generarId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }


    sesionValida(maxHoras = 24) {
        if (!this.usuarioActual || !this.usuarioActual.fechaLogin) {
            return false;
        }
        
        const fechaLogin = new Date(this.usuarioActual.fechaLogin);
        const ahora = new Date();
        const horasTranscurridas = (ahora - fechaLogin) / (1000 * 60 * 60);
        
        return horasTranscurridas < maxHoras;
    }
}


const auth = new Auth();
