/* =========================
   OBTENER DATOS
========================= */

const rol = localStorage.getItem("rol") || "Invitado";

const nombreUsuario =
    localStorage.getItem("usuario") || "";

console.log("ROL ACTUAL:", rol);

/* =========================
   DETECTAR UBICACION
========================= */

const estaEnPages =
    window.location.pathname.includes("/pages/");

/* =========================
   ELEMENTOS DOM
========================= */

const dashboard =
    document.getElementById("dashboard");

const categorias =
    document.getElementById("categorias");

const container =
    document.getElementById("cardsContainer");

const menu =
    document.getElementById("menu");

const tituloHero =
    document.getElementById("tituloHero");

const textoHero =
    document.getElementById("textoHero");

const btnHero =
    document.getElementById("btnHero");

const bienvenida =
    document.getElementById("bienvenida");

const btnLogin =
    document.getElementById("btnLogin");

const btnLogout =
    document.getElementById("btnLogout");

const rolUsuario =
    document.getElementById("rolUsuario");

/* =========================
   MOSTRAR USUARIO
========================= */

if (rolUsuario) {

    rolUsuario.textContent =
        rol === "Invitado"
            ? "Invitado"
            : `${nombreUsuario} | ${rol}`;
}

/* =========================
   FUNCION CREAR CARD
========================= */

function card(icono, titulo, descripcion, link){

    const div = document.createElement("div");

    div.className = "card-admin";

    div.innerHTML = `
        <div class="icono">
            ${icono}
        </div>

        <h3>
            ${titulo}
        </h3>

        <p>
            ${descripcion}
        </p>

        <a href="${link}">
            Entrar
        </a>
    `;

    return div;
}

/* =========================
   CLIENTE / INVITADO
========================= */

if (rol === "Invitado" || rol === "Cliente") {

    menu.innerHTML = `
        <a href="${estaEnPages ? '../index.html' : 'index.html'}">
            Inicio
        </a>

        <a href="${
            estaEnPages
                ? './categorias.html'
                : './pages/categorias.html'
        }">
            Categorías
        </a>

        <a href="${
            estaEnPages
                ? './catalogo.html'
                : './pages/catalogo.html'
        }">
            Productos
        </a>

        <a href="${
            estaEnPages
                ? './carrito.html'
                : './pages/carrito.html'
        }">
            Carrito 🛒
        </a>
    `;

    /* BOTONES */

    btnLogin.style.display =
        rol === "Invitado"
            ? "inline-block"
            : "none";

    btnLogout.style.display =
        rol === "Cliente"
            ? "inline-block"
            : "none";

    /* MOSTRAR / OCULTAR */

    if (dashboard) {
        dashboard.style.display = "none";
    }

    if (categorias) {
        categorias.style.display = "grid";
    }

    /* HERO */

    if (tituloHero) {
        tituloHero.textContent =
            "Bienvenido a Joyeria Yorch";
    }

    if (textoHero) {
        textoHero.textContent =
            "Explora nuestros productos";
    }

    if (btnHero) {
        btnHero.textContent =
            "Comprar ahora";
    }
}

/* =========================
   ADMINISTRACION
========================= */

else {

    if (dashboard) {
        dashboard.style.display = "block";
    }

    if (categorias) {
        categorias.style.display = "none";
    }

    btnLogin.style.display = "none";

    btnLogout.style.display = "inline-block";

    /* MENU */

    menu.innerHTML = `
        <a href="index.html">
            Inicio
        </a>

        <a href="./pages/clientes.html"
           id="clientes">
            Clientes
        </a>

        <a href="./pages/productos.html"
           id="productos">
            Productos
        </a>

        <a href="./pages/reporte_ventas.html"
           id="ventas">
            Ventas
        </a>

        <a href="./pages/Reportes.html"
           id="reportes">
            Reportes
        </a>
    `;

    /* =========================
       ADMINISTRADOR
    ========================= */

    if (rol === "Administrador") {
        menu.innerHTML += `

        <a href="./pages/dashboard.html">

            Panel Administrador

        </a>

    `;

        if (bienvenida) {
            bienvenida.textContent =
                "Panel de Administrador";
        }

        container.appendChild(
            card(
                "💰",
                "Ventas",
                "Controla ventas y movimientos del sistema.",
                "./pages/reporte_ventas.html"
            )
        );

        container.appendChild(
            card(
                "📦",
                "Inventario",
                "Administra productos y stock disponible.",
                "./pages/movimientos.html"
            )
        );

        container.appendChild(
            card(
                "👤",
                "Clientes",
                "Consulta clientes registrados y compras.",
                "./pages/clientes.html"
            )
        );

        container.appendChild(
            card(
                "📊",
                "Reportes",
                "Visualiza estadísticas y reportes del negocio.",
                "./pages/Reportes.html"
            )
        );

        container.appendChild(
            card(
                "⚙️",
                "Usuarios",
                "Gestiona permisos y usuarios del sistema.",
                "./pages/usuarios.html"
            )
        );

        container.appendChild(
            card(
                "🛍️",
                "Productos",
                "Gestiona el catálogo de productos.",
                "./pages/productos.html"
            )
        );
    }

    /* =========================
       VENDEDOR
    ========================= */

    if (rol === "Vendedor") {

        menu.innerHTML += `
            <a href="./pages/dashboard_cajero.html">
                Panel Cajero
            </a>
        `;

        const reportes =
            document.getElementById("reportes");

        if (reportes) {
            reportes.style.display = "none";
        }
    }

    /* =========================
       INVENTARIO
    ========================= */

    if (rol === "Inventario") {

        menu.innerHTML += `
            <a href="./pages/dashboard_almacen.html">
                Panel Almacén
            </a>
        `;

        setTimeout(() => {

            const ventas =
                document.getElementById("ventas");

            const clientes =
                document.getElementById("clientes");

            const reportes =
                document.getElementById("reportes");

            if (ventas) {
                ventas.style.display = "none";
            }

            if (clientes) {
                clientes.style.display = "none";
            }

            if (reportes) {
                reportes.style.display = "none";
            }

        }, 0);
    }
}

/* =========================
   LOGIN
========================= */

function irLogin(){

    if (estaEnPages) {

        window.location.href =
            "./login.html";

    } else {

        window.location.href =
            "./pages/login.html";
    }
}

/* =========================
   LOGOUT
========================= */

function logout(){

    localStorage.removeItem("rol");

    localStorage.removeItem("usuario");

    alert("Sesión cerrada");

    window.location.href =
        estaEnPages
            ? "../index.html"
            : "index.html";

            
}



