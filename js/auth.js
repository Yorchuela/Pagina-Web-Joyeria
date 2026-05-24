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
                data.usuario.nombre
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

async function recuperarPassword() {

    const correo =
        prompt("Ingrese su correo");

    if (!correo) {

        return;

    }

    try {

        /* ENVIAR CÓDIGO */

        const response =
            await fetch(
                'http://localhost:3000/recover-password',
                {

                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        correo
                    })

                });

        const data = await response.json();

        alert(data.message);

        /* SI NO EXISTE CORREO */

        if (!data.success) {

            return;

        }

        /* PEDIR CÓDIGO */

        const codigo =
            prompt("Ingrese el código enviado");

        /* VALIDAR CÓDIGO */

        let codigoCorrecto = false;

        while (!codigoCorrecto) {

            const codigo =
                prompt("Ingrese el código enviado");

            /* SI CANCELA */

            if (codigo === null) {
                alert("Recuperación cancelada");
                return;

            }

            const validar =
                await fetch(
                    'http://localhost:3000/validar-codigo',
                    {

                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify({
                            codigo
                        })

                    });

            const dataValidar =
                await validar.json();

            /* CÓDIGO CORRECTO */

            if (dataValidar.success) {

                codigoCorrecto = true;

            } else {

                alert(dataValidar.message);

            }

        }

        /* NUEVA PASSWORD */

        const nuevaPassword =
            prompt("Ingrese nueva contraseña");

        /* CAMBIAR PASSWORD */

        const responseReset =
            await fetch(
                'http://localhost:3000/reset-password',
                {

                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({

                        correo,
                        nuevaPassword

                    })

                });

        const dataReset =
            await responseReset.json();

        alert(dataReset.message);

    } catch (error) {

        console.log(error);

        alert('Error servidor');

    }

}