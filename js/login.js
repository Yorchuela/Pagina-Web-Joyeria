// 🔥 LOGIN
function login(e) {
    e.preventDefault();

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    if(correo === "" || password === ""){
        alert("Completa todos los campos");
        return;
    }

    // 🔴 SIMULACIÓN DE BD
    const usuarios = [
        { nombre: "Admin", correo: "admin@gmail.com", password: "123", rol: "admin" },
        { nombre: "Cajero", correo: "cajero@gmail.com", password: "123", rol: "cajero" },
        { nombre: "Almacen", correo: "almacen@gmail.com", password: "123", rol: "almacen" },
        { nombre: "Cliente", correo: "cliente@gmail.com", password: "123", rol: "cliente" }
    ];

    const usuario = usuarios.find(u => 
        u.correo === correo && u.password === password
    );

    if (!usuario) {
        alert("Credenciales incorrectas");
        return;
    }

    // ✅ GUARDAR USUARIO COMPLETO (MEJOR)
    localStorage.setItem("usuario", JSON.stringify(usuario));

    // 🔥 REDIRECCIÓN SEGÚN ROL
    redirigirPorRol(usuario.rol);
}

// 🔥 REDIRECCIÓN INTELIGENTE
function redirigirPorRol(rol){

    if(rol === "admin"){
        window.location.href = "dashboard.html";
    }
    else if(rol === "cajero"){
        window.location.href = "ventas.html";
    }
    else if(rol === "almacen"){
        window.location.href = "inventario.html";
    }
    else{
        window.location.href = "dashboard.html";
    }
}