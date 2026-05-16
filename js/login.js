// =======================================
// 🔐 USUARIOS PREDEFINIDOS
// =======================================

const usuarios = [

    {
        nombre: "Administrador",
        correo: "admin@gmail.com",
        password: "123",
        rol: "admin"
    },

    {
        nombre: "Cajero",
        correo: "cajero@gmail.com",
        password: "123",
        rol: "cajero"
    },

    {
        nombre: "Almacen",
        correo: "almacen@gmail.com",
        password: "123",
        rol: "almacen"
    },

    {
        nombre: "Cliente",
        correo: "cliente@gmail.com",
        password: "123",
        rol: "cliente"
    }

];


// =======================================
// 🔥 LOGIN
// =======================================

function login(e) {

    e.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    // ✅ VALIDAR CAMPOS
    if (correo === "" || password === "") {

        alert("Completa todos los campos");
        return;
    }

    // 🔍 BUSCAR USUARIO
    const usuario = usuarios.find(u =>
        u.correo === correo &&
        u.password === password
    );

    // ❌ ERROR
    if (!usuario) {

        alert("Credenciales incorrectas");
        return;
    }

    // ✅ GUARDAR SESIÓN
    localStorage.setItem("usuario", JSON.stringify(usuario));

    // 🚀 REDIRECCIÓN
    redirigirPorRol(usuario.rol);
}


// =======================================
// 🚀 REDIRECCIÓN SEGÚN ROL
// =======================================

function redirigirPorRol(rol) {

    if (rol === "admin") {

        window.location.href = "dashboard.html";
    }

    else if (rol === "cajero") {

        window.location.href = "dashboard_cajero.html";
    }

    else if (rol === "almacen") {

        window.location.href = "dashboard_almacen.html";
    }

    else if (rol === "cliente") {

        window.location.href = "../index.html";
    }

    else {

        window.location.href = "../index.html";
    }
}


// =======================================
// 🚪 CERRAR SESIÓN
// =======================================

function logout() {

    localStorage.removeItem("usuario");

    window.location.href = "pages/login.html";
}


// =======================================
// 👤 OBTENER USUARIO ACTUAL
// =======================================

function obtenerUsuario() {

    return JSON.parse(localStorage.getItem("usuario"));
}


// =======================================
// 🔒 VERIFICAR SESIÓN
// =======================================

function verificarSesion() {

    const usuario = obtenerUsuario();

    if (!usuario) {

        window.location.href = "login.html";
    }
}


// =======================================
// 🔐 VERIFICAR ROL
// =======================================

function verificarRol(rolesPermitidos) {

    const usuario = obtenerUsuario();

    // ❌ NO HAY SESIÓN
    if (!usuario) {

        window.location.href = "login.html";
        return;
    }

    // ❌ SIN PERMISOS
    if (!rolesPermitidos.includes(usuario.rol)) {

        alert("No tienes permiso para entrar aquí");

        // REDIRECCIÓN SEGÚN ROL
        redirigirPorRol(usuario.rol);
    }
}


// =======================================
// 🚀 IR A LOGIN
// =======================================

function irLogin() {

    window.location.href = "pages/login.html";
}


// =======================================
// 👤 MOSTRAR BOTONES LOGIN/LOGOUT
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    const usuario = obtenerUsuario();

    const btnLogin = document.getElementById("btnLogin");
    const btnLogout = document.getElementById("btnLogout");
    const rolUsuario = document.getElementById("rolUsuario");

    // ✅ SI EXISTEN LOS ELEMENTOS
    if (btnLogin && btnLogout) {

        if (usuario) {

            btnLogin.style.display = "none";
            btnLogout.style.display = "inline-block";

            // 👤 MOSTRAR ROL
            if (rolUsuario) {

                rolUsuario.textContent =
                    usuario.nombre + " (" + usuario.rol + ")";
            }

        }

        else {

            btnLogin.style.display = "inline-block";
            btnLogout.style.display = "none";

            if (rolUsuario) {

                rolUsuario.textContent = "";
            }
        }
    }

});