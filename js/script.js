// 🔐 OBTENER ROL (si no hay, es cliente)
const rol = localStorage.getItem("rol") || "admin";

document.getElementById("rolUsuario").textContent =
    rol === "cliente" ? "Invitado" : rol.toUpperCase();

const dashboard = document.getElementById("dashboard");
const categorias = document.getElementById("categorias");
const container = document.getElementById("cardsContainer");
const menu = document.getElementById("menu");

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");

// función cards
function card(texto) {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = texto;
    return div;
}

/// 🔵 CLIENTE / INVITADO
if (rol === "cliente") {

    menu.innerHTML = `
        <a href="#">Inicio</a>
        <a href="#categorias">Categorías</a>
        <a href="#">Productos</a>
        <a href="#">Ofertas</a>
        <a href="#">Carrito 🛒</a>
    `;

    // botones
    btnLogin.style.display = "inline-block";
    btnLogout.style.display = "none";

    // textos
    document.getElementById("tituloHero").textContent = "Bienvenido a Joyeria Yorch";
    document.getElementById("textoHero").textContent = "Explora nuestros productos";
    document.getElementById("btnHero").textContent = "Comprar ahora";
}

// 🔴 USUARIO LOGUEADO
else {

    dashboard.style.display = "block";
    categorias.style.display = "none";

    btnLogin.style.display = "none";
    btnLogout.style.display = "inline-block";

    document.getElementById("bienvenida").textContent = "Panel de " + rol;

    menu.innerHTML = `
        <a href="#">Inicio</a>
        <a href="#" id="clientes">Clientes</a>
        <a href="productos.html" id="productos">Productos</a>
        <a href="#" id="ventas">Ventas</a>
        <a href="#" id="reportes">Reportes</a>
    `;

    if (rol === "admin") {

    document.getElementById("bienvenida").textContent = "Panel de Administrador";

    container.appendChild(card("💰 Ventas"));
    container.appendChild(card("📦 Inventario"));
    container.appendChild(card("👤 Clientes"));
    container.appendChild(card("📊 Reportes"));
    container.appendChild(card("⚙️ Usuarios")); // opcional
}

    if (rol === "cajero") {

    container.appendChild(card("💰 Nueva Venta"));
    container.appendChild(card("🏷 Aplicar Descuento"));
    container.appendChild(card("🔄 Devolución"));
    container.appendChild(card("👤 Clientes"));

    // opcional
    container.appendChild(card("🧾 Caja del día"));

    // ocultar lo que no corresponde
    setTimeout(() => {
        document.getElementById("productos").style.display = "none";
        document.getElementById("reportes").style.display = "none";
    }, 0);
}

    if (rol === "almacen") {

    document.getElementById("bienvenida").textContent = "Panel de Almacén";

    container.appendChild(card("📦 Ver Inventario"));
    container.appendChild(card("➕ Entrada de productos"));
    container.appendChild(card("➖ Salida de productos"));
    container.appendChild(card("🚨 Stock bajo"));

    // ocultar módulos que no usa
    setTimeout(() => {
        document.getElementById("ventas").style.display = "none";
        document.getElementById("clientes").style.display = "none";
        document.getElementById("reportes").style.display = "none";
    }, 0);
}
}

// 🔐 FUNCIONES
function irLogin() {
    window.location.href = "Login/login.html";
}

function logout() {
    localStorage.removeItem("rol");
    location.reload(); // recarga como cliente
}