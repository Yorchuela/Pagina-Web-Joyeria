function login(e){

    e.preventDefault();

    const correo =

    document.getElementById(
        "correo"
    ).value;

    const password =

    document.getElementById(
        "password"
    ).value;

    /* USUARIOS SIMULADOS */

    const usuarios = [

        {

            id_cliente:1,

            correo:
            "admin@gmail.com",

            password:"123",

            rol:
            "Administrador",

            usuario:
            "Administrador"

        },

        {

            id_cliente:2,

            correo:
            "cajero@gmail.com",

            password:"123",

            rol:
            "Vendedor",

            usuario:
            "Cajero"

        },

        {

            id_cliente:3,

            correo:
            "almacen@gmail.com",

            password:"123",

            rol:
            "Inventario",

            usuario:
            "Almacén"

        },

        {

            id_cliente:4,

            correo:
            "cliente@gmail.com",

            password:"123",

            rol:
            "Cliente",

            usuario:
            "Cliente"

        }

    ];

    const usuario = usuarios.find(

        u =>

        u.correo === correo

        &&

        u.password === password

    );

    if(!usuario){

        alert(
            "Credenciales incorrectas"
        );

        return;

    }

    /* GUARDAR SESIÓN */

    localStorage.setItem(

        "rol",

        usuario.rol

    );

    localStorage.setItem(

        "usuario",

        usuario.usuario

    );

    localStorage.setItem(

        "id_cliente",

        usuario.id_cliente

    );

    alert(
        "Inicio de sesión correcto"
    );

    /* REDIRECCIÓN */

    window.location.href =
    "../index.html";

}