async function registrar(e){

    e.preventDefault();

    const correo =
        document.getElementById("correo").value.trim();

    const nombre =
        document.getElementById("nombre").value.trim();

    const apellido_paterno =
        document.getElementById("ap").value.trim();

    const apellido_materno =
        document.getElementById("am").value.trim();

    const telefono =
        document.getElementById("telefono").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const confirm =
        document.getElementById("confirmPassword").value.trim();

    /* VALIDAR CAMPOS VACÍOS */

    if(
        !correo ||
        !nombre ||
        !apellido_paterno ||
        !password ||
        !confirm
    ){

        alert("Complete todos los campos obligatorios");

        return;
    }

    /* VALIDAR CORREO */

    if(!correo.includes("@")){

        alert("Ingrese un correo válido");

        return;
    }


    /* VALIDAR TELÉFONO */
        const soloNumeros = /^[0-9]+$/;

    if(!soloNumeros.test(telefono)){

        alert("El teléfono solo debe contener números");

        return;

    }

    /* EXACTAMENTE 10 DÍGITOS */

    if(telefono.length !== 10){

        alert("El teléfono debe tener exactamente 10 dígitos");

        return;

    }

    /* VALIDAR CONTRASEÑA SEGURA */

    const passwordSegura =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;

    if(!passwordSegura.test(password)){

        alert(
            `La contraseña debe tener:

            • mínimo 8 caracteres
            • una mayúscula
            • un número
            • un carácter especial`
            );

        return;
    }

    /* VALIDAR CONFIRMACIÓN */

    if(password !== confirm){

        alert("Las contraseñas no coinciden");

        return;
    }

    try{

        const response =
            await fetch('http://localhost:3000/register', {

            method:'POST',

            headers:{
                'Content-Type':'application/json'
            },

            body: JSON.stringify({

                correo,
                nombre,
                apellido_paterno,
                apellido_materno,
                telefono,
                password

            })

        });

        const data = await response.json();

        if(data.success){

            alert('Cuenta creada correctamente');

            window.location.href =
                '../../pages/login.html';

        } else {

            alert(data.message);

        }

    } catch(error){

        console.log(error);

        alert('Error al registrar');

    }

}