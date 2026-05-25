// 🔐 OBTENER ROL (si no hay, es Invitado)
const rol = localStorage.getItem("rol") || "Invitado";
console.log("ROL ACTUAL:", rol);

const nombreUsuario = localStorage.getItem("usuario") || "";
const estaEnPages = window.location.pathname.includes("/pages/");

// ELEMENTOS
const rolUsuario = document.getElementById("rolUsuario");
const dashboard = document.getElementById("dashboard");
const categorias = document.getElementById("categorias");
const container = document.getElementById("cardsContainer");
const menu = document.getElementById("menu");

const tituloHero = document.getElementById("tituloHero");
const textoHero = document.getElementById("textoHero");
const btnHero = document.getElementById("btnHero");

const bienvenida = document.getElementById("bienvenida");

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");

// MOSTRAR USUARIO
if (rolUsuario) {
    rolUsuario.textContent =
        rol === "Invitado"
            ? "Invitado"
            : `${nombreUsuario} | ${rol}`;
}

// FUNCIÓN TARJETA
function card(texto) {
    const div = document.createElement("div");
    div.className = "card-panel";
    div.textContent = texto;
    return div;
}

/* ========================= */
/* 🔵 TIENDA (CLIENTE) */
/* ========================= */

if (rol === "Invitado" || rol === "Cliente") {

    if (menu) {
        menu.innerHTML = `
            <a href="${estaEnPages ? "../index.html" : "index.html"}">
                Inicio
            </a>

            <a href="${estaEnPages ? "./categorias.html" : "./pages/categorias.html"}">
                Categorías
            </a>

            <a href="${estaEnPages ? "./catalogo.html" : "./pages/catalogo.html"}">
                Productos
            </a>

            <a href="#">
                Ofertas
            </a>

            <a href="${estaEnPages ? "./carrito.html" : "./pages/carrito.html"}">
                Carrito 🛒
            </a>
        `;
    }

    if (btnLogin) {
        btnLogin.style.display =
            rol === "Invitado"
                ? "inline-block"
                : "none";
    }

    if (btnLogout) {
        btnLogout.style.display =
            rol === "Cliente"
                ? "inline-block"
                : "none";
    }

    if (dashboard) {
        dashboard.style.display = "none";
    }

    if (categorias) {
        categorias.style.display = "flex";
    }

    if (tituloHero) {
        tituloHero.textContent = "Bienvenido a Joyeria Yorch";
    }

    if (textoHero) {
        textoHero.textContent = "Explora nuestros productos";
    }

    if (btnHero) {
        btnHero.textContent = "Comprar ahora";
    }
}

/* ========================= */
/* 🔴 ADMINISTRACIÓN */
/* ========================= */

else {

    if (dashboard) {
        dashboard.style.display = "block";
    }

    if (categorias) {
        categorias.style.display = "none";
    }

    if (btnLogin) {
        btnLogin.style.display = "none";
    }

    if (btnLogout) {
        btnLogout.style.display = "inline-block";
    }

    if (menu) {
        menu.innerHTML = `
            <a href="${estaEnPages ? "../index.html" : "index.html"}">
                Inicio
            </a>

            <a href="#" id="clientes">
                Clientes
            </a>

            <a href="${estaEnPages ? "./productos.html" : "./pages/productos.html"}" id="productos">
                Productos
            </a>

            <a href="#" id="ventas">
                Ventas
            </a>

            <a href="#" id="reportes">
                Reportes
            </a>
        `;
    }

    /* ========================= */
    /* ADMINISTRADOR */
    /* ========================= */

    if (rol === "Administrador") {

        if (bienvenida) {
            bienvenida.textContent = "Panel de Administrador";
        }

        if (container) {
            container.appendChild(card("💰 Ventas"));
            container.appendChild(card("📦 Inventario"));
            container.appendChild(card("👤 Clientes"));
            container.appendChild(card("📊 Reportes"));
            container.appendChild(card("⚙️ Usuarios"));
            container.appendChild(card("📦 Productos"));
        }
    }

    /* ========================= */
    /* VENDEDOR */
    /* ========================= */

    if (rol === "Vendedor") {

        if (bienvenida) {
            bienvenida.textContent = "Panel de Vendedor";
        }

        if (container) {
            container.appendChild(card("💰 Nueva Venta"));
            container.appendChild(card("🏷 Aplicar Descuento"));
            container.appendChild(card("🔄 Devolución"));
            container.appendChild(card("👤 Clientes"));
            container.appendChild(card("🧾 Caja del día"));
        }

        setTimeout(() => {

            const productos = document.getElementById("productos");
            const reportes = document.getElementById("reportes");

            if (productos) productos.style.display = "none";
            if (reportes) reportes.style.display = "none";

        }, 0);
    }

    /* ========================= */
    /* INVENTARIO */
    /* ========================= */

    if (rol === "Inventario") {

        if (bienvenida) {
            bienvenida.textContent = "Panel de Inventario";
        }

        if (container) {
            container.appendChild(card("📦 Ver Inventario"));
            container.appendChild(card("➕ Entrada Productos"));
            container.appendChild(card("➖ Salida Productos"));
            container.appendChild(card("🚨 Stock Bajo"));
        }

        setTimeout(() => {

            const ventas = document.getElementById("ventas");
            const clientes = document.getElementById("clientes");
            const reportes = document.getElementById("reportes");

            if (ventas) ventas.style.display = "none";
            if (clientes) clientes.style.display = "none";
            if (reportes) reportes.style.display = "none";

        }, 0);
    }
}

/* ========================= */
/* LOGIN */
/* ========================= */

function irLogin() {

    if (estaEnPages) {
        window.location.href = "./login.html";
    } else {
        window.location.href = "./pages/login.html";
    }
}

/* ========================= */
/* LOGOUT */
/* ========================= */

function logout() {

    localStorage.removeItem("rol");
    localStorage.removeItem("usuario");

    alert("Sesión cerrada");

    window.location.href =
        estaEnPages
            ? "../index.html"
            : "index.html";
}