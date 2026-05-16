// 👤 OBTENER USUARIO
function getUsuario() {
    return JSON.parse(localStorage.getItem("usuario"));
}


// 🔒 VERIFICAR LOGIN
function verificarLogin() {

    let user = getUsuario();

    if (!user) {

        window.location.href = "/pages/login.html";
    }
}


// 🔐 VERIFICAR ROL
function verificarRol(rolesPermitidos) {

    let user = getUsuario();

    if (!user) {

        window.location.href = "/pages/login.html";
        return;
    }

    if (!rolesPermitidos.includes(user.rol)) {

        alert("No tienes permiso");

        window.location.href = "/pages/dashboard.html";
    }
}


// 🚪 LOGOUT
function logout() {

    localStorage.removeItem("usuario");

    window.location.href = "/pages/login.html";
}