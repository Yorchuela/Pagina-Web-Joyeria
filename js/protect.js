/* OBTENER ROL */

const rol = localStorage.getItem("rol");

/* SI NO HAY SESION */

if(!rol){

    alert("Debes iniciar sesión");

    window.location.href = "../pages/login.html";

}

/* FUNCION PROTEGER POR ROL */

function protegerPagina(rolesPermitidos){

    if(!rolesPermitidos.includes(rol)){

        alert("No tienes permisos para entrar");

        window.location.href = "../index.html";

    }

}
