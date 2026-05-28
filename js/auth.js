async function login(event) {

    event.preventDefault();

    const correo =
        document.getElementById('correo').value.trim();

    const password =
        document.getElementById('password').value.trim();

    /* VALIDAR */

    if (!correo || !password) {

        alert("Complete todos los campos");

        return;
    }

    try {

        const response =

            await fetch('http://localhost:3000/login', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    correo,
                    password
                })

            });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem(
                "rol",
                data.usuario.nombre_rol
            );

            localStorage.setItem(

                "usuario",

                JSON.stringify({

                    id_usuario:
                        data.usuario.id_usuario,


                    nombre:
                        data.usuario.nombre,

                    rol:
                        data.usuario.nombre_rol

                })

            );

            alert('Login correcto');

            window.location.href = '../index.html';

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

        alert('Error servidor');

    }

}
/* RECUPERAR PASSWORD */

/* VARIABLES */

let pasoRecuperacion = 1;

let correoTemporal = "";

/* ABRIR MODAL */

function recuperarPassword() {

    pasoRecuperacion = 1;

    document.getElementById(

        "modalPassword"

    ).classList.add(

        "active"

    );

    document.getElementById(

        "tituloModal"

    ).textContent =

        "Recuperar Contraseña";

    document.getElementById(

        "textoModal"

    ).textContent =

        "Ingresa tu correo electrónico";

    document.getElementById(

        "inputRecuperacion"

    ).value = "";

    document.getElementById(

        "inputRecuperacion"

    ).type = "email";

}

/* CERRAR MODAL */

function cerrarModalPassword() {

    document.getElementById(

        "modalPassword"

    ).classList.remove(

        "active"

    );

}

/* CONTINUAR */

async function continuarRecuperacion() {

    const input =

        document.getElementById(

            "inputRecuperacion"

        );

    const valor = input.value.trim();

    /* PASO 1 */

    if (pasoRecuperacion === 1) {

        if (!valor) {

            alert("Ingrese su correo");

            return;
        }

        try {

            const response =

                await fetch(

                    'http://localhost:3000/recover-password',

                    {

                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify({

                            correo: valor

                        })

                    }

                );

            const data =

                await response.json();

            alert(data.message);

            if (!data.success) {

                return;
            }

            correoTemporal = valor;

            pasoRecuperacion = 2;

            document.getElementById(

                "tituloModal"

            ).textContent =

                "Código de Verificación";

            document.getElementById(

                "textoModal"

            ).textContent =

                "Ingresa el código enviado";

            input.value = "";

            input.type = "text";

        }

        catch (error) {

            console.log(error);

            alert("Error servidor");

        }

    }

    /* PASO 2 */

    else if (pasoRecuperacion === 2) {

        if (!valor) {

            alert("Ingrese el código");

            return;
        }

        try {

            const validar =

                await fetch(

                    'http://localhost:3000/validar-codigo',

                    {

                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify({

                            codigo: valor

                        })

                    }

                );

            const dataValidar =

                await validar.json();

            if (!dataValidar.success) {

                alert(dataValidar.message);

                return;
            }

            pasoRecuperacion = 3;

            document.getElementById(

                "tituloModal"

            ).textContent =

                "Nueva Contraseña";

            document.getElementById(

                "textoModal"

            ).textContent =

                "Ingrese su nueva contraseña";

            input.value = "";

            input.type = "password";

        }

        catch (error) {

            console.log(error);

            alert("Error servidor");

        }

    }

    /* PASO 3 */

    else if (pasoRecuperacion === 3) {

        if (!valor) {

            alert("Ingrese la nueva contraseña");

            return;
        }

        try {

            const responseReset =

                await fetch(

                    'http://localhost:3000/reset-password',

                    {

                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify({

                            correo: correoTemporal,

                            nuevaPassword: valor

                        })

                    }

                );

            const dataReset =

                await responseReset.json();

            alert(dataReset.message);

            cerrarModalPassword();

        }

        catch (error) {

            console.log(error);

            alert("Error servidor");

        }

    }

}
function verificarRol(rolesPermitidos) {

    const rol = localStorage.getItem("rol");

    if (!rolesPermitidos.includes(rol)) {

        alert("Acceso denegado");

        window.location.href = "../pages/login.html";

    }

}