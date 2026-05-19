// =======================================
// 🔐 USUARIOS PREDEFINIDOS
// =======================================

const usuarios = [

    {
        nombre: "Administrador",
        correo: "admin@gmail.com",
        password: "123",
        rol: "admin"
    },

    {
        nombre: "Cajero",
        correo: "cajero@gmail.com",
        password: "123",
        rol: "cajero"
    },

    {
        nombre: "Almacen",
        correo: "almacen@gmail.com",
        password: "123",
        rol: "almacen"
    },

    {
        nombre: "Cliente",
        correo: "cliente@gmail.com",
        password: "123",
        rol: "cliente"
    }

];


// =======================================
// 🔥 LOGIN
// =======================================

function login(e){

    e.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    if(correo === "" || password === ""){

        alert("Completa todos los campos");
        return;
    }

    const usuario = usuarios.find(u =>
        u.correo === correo &&
        u.password === password
    );

    if(!usuario){

        alert("Credenciales incorrectas");
        return;
    }

    // ✅ GUARDAR SESIÓN
    localStorage.setItem("usuario", JSON.stringify(usuario));

    // 🚀 REDIRECCIÓN
    window.location.href = "../index.html";
}


// =======================================
// 👤 OBTENER USUARIO
// =======================================

function obtenerUsuario(){

    return JSON.parse(localStorage.getItem("usuario"));
}


// =======================================
// 🚪 LOGOUT
// =======================================

function logout(){

    localStorage.removeItem("usuario");

    window.location.href = "pages/login.html";
}


// =======================================
// 🚀 IR LOGIN
// =======================================

function irLogin(){

    window.location.href = "pages/login.html";
}


// =======================================
// 🔒 VERIFICAR ROL
// =======================================

function verificarRol(rolesPermitidos){

    const usuario = obtenerUsuario();

    if(!usuario){

        window.location.href = "../pages/login.html";
        return;
    }

    if(!rolesPermitidos.includes(usuario.rol)){

        alert("No tienes permiso");

        window.location.href = "../index.html";
    }
}


// =======================================
// 🎨 CARGA GENERAL
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    const usuario = obtenerUsuario();

    const btnLogin = document.getElementById("btnLogin");
    const btnLogout = document.getElementById("btnLogout");
    const rolUsuario = document.getElementById("rolUsuario");

    const menu = document.getElementById("menu");
    const panel = document.getElementById("panelOpciones");
    const titulo = document.getElementById("tituloPanel");


    // ===================================
    // 🔐 BOTONES LOGIN / LOGOUT
    // ===================================

    if(btnLogin && btnLogout){

        if(usuario){

            btnLogin.style.display = "none";
            btnLogout.style.display = "inline-block";

            if(rolUsuario){

                rolUsuario.textContent =
                    usuario.nombre + " (" + usuario.rol + ")";
            }
        }

        else{

            btnLogin.style.display = "inline-block";
            btnLogout.style.display = "none";

            if(rolUsuario){

                rolUsuario.textContent = "";
            }
        }
    }


    // ===================================
    // ⚠ SI NO EXISTEN ELEMENTOS
    // ===================================

    if(!menu || !panel || !titulo){

        return;
    }


    // ===================================
    // 🏪 VISITA NORMAL
    // ===================================

    if(!usuario){

        menu.innerHTML = `
            <a href="index.html">Inicio</a>
            <a href="#">Categorías</a>
            <a href="#">Productos</a>
            <a href="#">Ofertas</a>
        `;

        titulo.textContent = "💎 Productos Destacados";

        panel.innerHTML = `

            <div class="card-panel">
                <h3>💍 Anillos</h3>
                <p>Elegancia premium</p>
            </div>

            <div class="card-panel">
                <h3>📿 Collares</h3>
                <p>Diseños exclusivos</p>
            </div>

            <div class="card-panel">
                <h3>🪄 Pulseras</h3>
                <p>Nuevas colecciones</p>
            </div>

        `;

        return;
    }


    // ===================================
    // 👑 ADMIN
    // ===================================

    if(usuario.rol === "admin"){

        menu.innerHTML = `
            <a href="index.html">Inicio</a>
            <a href="pages/dashboard.html">Dashboard</a>
            <a href="pages/clientes.html">Clientes</a>
            <a href="pages/productos.html">Productos</a>
            <a href="pages/inventario.html">Inventario</a>
            <a href="pages/ventas.html">Ventas</a>
            <a href="pages/reportes.html">Reportes</a>
        `;

        titulo.textContent = "👑 Panel Administrador";

        panel.innerHTML = `

            <div class="card-panel"
                 onclick="window.location.href='pages/dashboard.html'">

                <h3>📊 Dashboard</h3>
                <p>Resumen general del sistema</p>
            </div>

            <div class="card-panel"
                 onclick="window.location.href='pages/ventas.html'">

                <h3>💰 Ventas</h3>
                <p>Registrar y consultar ventas</p>
            </div>

            <div class="card-panel"
                 onclick="window.location.href='pages/inventario.html'">

                <h3>📦 Inventario</h3>
                <p>Control de stock</p>
            </div>

            <div class="card-panel"
                 onclick="window.location.href='pages/clientes.html'">

                <h3>👤 Clientes</h3>
                <p>Administrar clientes</p>
            </div>

            <div class="card-panel"
                 onclick="window.location.href='pages/reportes.html'">

                <h3>📊 Reportes</h3>
                <p>Ventas y caja</p>
            </div>

        `;
    }


    // ===================================
    // 💰 CAJERO
    // ===================================

    else if(usuario.rol === "cajero"){

        menu.innerHTML = `
            <a href="index.html">Inicio</a>
            <a href="pages/dashboard_cajero.html">Dashboard</a>
            <a href="pages/ventas.html">Ventas</a>
            <a href="pages/clientes.html">Clientes</a>
            <a href="pages/devoluciones.html">Devoluciones</a>
        `;

        titulo.textContent = "💰 Panel Cajero";

        panel.innerHTML = `

            <div class="card-panel"
                 onclick="window.location.href='pages/dashboard_cajero.html'">

                <h3>📊 Dashboard</h3>
                <p>Resumen de caja y ventas</p>
            </div>

            <div class="card-panel"
                 onclick="window.location.href='pages/ventas.html'">

                <h3>🛒 Nueva Venta</h3>
                <p>Registrar ventas</p>
            </div>

            <div class="card-panel"
                 onclick="window.location.href='pages/devoluciones.html'">

                <h3>🔄 Devoluciones</h3>
                <p>Registrar devoluciones</p>
            </div>

            <div class="card-panel"
                 onclick="window.location.href='pages/clientes.html'">

                <h3>👤 Clientes</h3>
                <p>Consultar historial</p>
            </div>

        `;
    }


    // ===================================
    // 📦 ALMACÉN
    // ===================================

    else if(usuario.rol === "almacen"){

        menu.innerHTML = `
            <a href="index.html">Inicio</a>
            <a href="pages/dashboard_almacen.html">Dashboard</a>
            <a href="pages/inventario.html">Inventario</a>
            <a href="pages/productos.html">Productos</a>
            <a href="pages/movimientos.html">Movimientos</a>
        `;

        titulo.textContent = "📦 Panel Almacén";

        panel.innerHTML = `

            <div class="card-panel"
                 onclick="window.location.href='pages/dashboard_almacen.html'">

                <h3>📊 Dashboard</h3>
                <p>Estado del inventario</p>
            </div>

            <div class="card-panel"
                 onclick="window.location.href='pages/movimientos.html'">

                <h3>📥 Entradas</h3>
                <p>Registrar entradas</p>
            </div>

            <div class="card-panel"
                 onclick="window.location.href='pages/movimientos.html'">

                <h3>📤 Movimientos</h3>
                <p>Control de inventario</p>
            </div>

            <div class="card-panel"
                 onclick="window.location.href='pages/inventario.html'">

                <h3>⚠ Stock Bajo</h3>
                <p>Productos críticos</p>
            </div>

        `;
    }


    // ===================================
    // 🛍 CLIENTE
    // ===================================

    else{

        menu.innerHTML = `
            <a href="index.html">Inicio</a>
            <a href="#">Categorías</a>
            <a href="#">Productos</a>
            <a href="#">Carrito</a>
            <a href="#">Mi Cuenta</a>
        `;

        titulo.textContent = "🛍 Bienvenido";

        panel.innerHTML = `

            <div class="card-panel">
                <h3>💎 Anillos</h3>
                <p>Modelos exclusivos</p>
            </div>

            <div class="card-panel">
                <h3>📿 Collares</h3>
                <p>Joyas premium</p>
            </div>

            <div class="card-panel">
                <h3>🎁 Ofertas</h3>
                <p>Promociones especiales</p>
            </div>

        `;
    }

});