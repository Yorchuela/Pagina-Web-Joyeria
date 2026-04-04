function registrar(e) {
    e.preventDefault();

    const correo = document.getElementById("correo").value;
    const nombre = document.getElementById("nombre").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    // 🔐 Validación básica
    if (password !== confirm) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // 🔴 Simulación de BD
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // verificar si ya existe
    const existe = usuarios.find(u => u.correo === correo);

    if (existe) {
        alert("El usuario ya existe");
        return;
    }

    // guardar usuario
    const nuevoUsuario = {
        correo,
        nombre,
        password,
        rol: "cliente"
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cuenta creada correctamente");

    // redirigir a login
    window.location.href = "login.html";
}