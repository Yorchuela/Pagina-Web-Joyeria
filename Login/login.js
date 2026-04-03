if (!localStorage.getItem("rol")) {
    window.location.href = "login.html";
}

function login(e) {
    e.preventDefault(); // evita recarga

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    // 🔴 SIMULACIÓN DE BD
    const usuarios = [
        { correo: "admin@gmail.com", password: "123", rol: "admin" },
        { correo: "cajero@gmail.com", password: "123", rol: "cajero" },
        { correo: "almacen@gmail.com", password: "123", rol: "almacen" },
        { correo: "cliente@gmail.com", password: "123", rol: "cliente" }
    ];

    const usuario = usuarios.find(u => 
        u.correo === correo && u.password === password
    );

    if (!usuario) {
        alert("Credenciales incorrectas");
        return;
    }

    // ✅ guardar rol (simula sesión)
    localStorage.setItem("rol", usuario.rol);

    // ✅ redirigir al sistema
    window.location.href = "index.html";
}