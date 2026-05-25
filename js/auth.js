async function login(event) {

    alert("1");

    event.preventDefault();

    const correo =
        document.getElementById('correo').value.trim();

    const password =
        document.getElementById('password').value.trim();

    alert("2");

    if (!correo || !password) {

        alert("Complete todos los campos");
        return;

    }

    try {

        alert("3");

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

        alert("4");

        const data = await response.json();

        alert("5");

        console.log(data);

        if (data.success) {

            alert("6");

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

        console.error(error);

        alert('Error servidor');

    }

}

app.post('/login', (req, res) => {
    console.log("🔥 LOGIN LLEGÓ");

    res.json({
        success: true,
        usuario: { nombre: "test", nombre_rol: "admin" }
    });
});