// 🔐 OBTENER ROL (si no hay, es cliente)
const rol = localStorage.getItem("rol") || "Invitado";
console.log("ROL ACTUAL:", rol);
const nombreUsuario = localStorage.getItem("usuario") || "";
const estaEnPages =

    window.location.pathname
        .includes('/pages/');
document.getElementById("rolUsuario").textContent =

    rol === "Invitado"

        ? "Invitado"

        : nombreUsuario + " | " + rol;
const dashboard = document.getElementById("dashboard");
const categorias = document.getElementById("categorias");
const container = document.getElementById("cardsContainer");
const menu = document.getElementById("menu");
const tituloHero =
    document.getElementById(
        "tituloHero"
    );

const textoHero =
    document.getElementById(
        "textoHero"
    );

const btnHero =
    document.getElementById(
        "btnHero"
    );

const bienvenida =
    document.getElementById(
        "bienvenida"
    );
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");


// función cards
function card(texto) {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = texto;
    return div;
}

/* ========================= */
/* 🔵 TIENDA (CLIENTE) */
/* ========================= */

if (

    rol === "Invitado"

    ||

    rol === "Cliente"

) {

    menu.innerHTML = `

    <a href="${estaEnPages
            ?
            '../index.html'
            :
            'index.html'
        }">

        Inicio

    </a>

    <a href="${estaEnPages
            ?
            './categorias.html'
            :
            './pages/categorias.html'
        }">

        Categorías

    </a>

    <a href="${estaEnPages
            ?
            './catalogo.html'
            :
            './pages/catalogo.html'
        }">

        Productos

    </a>

    

    <a href="${estaEnPages
            ?
            './carrito.html'
            :
            './pages/carrito.html'
        }">

        Carrito 🛒

    </a>

`;

    btnLogin.style.display =
        rol === "Invitado"

            ?

            "inline-block"

            :

            "none";

    btnLogout.style.display =
        rol === "Cliente"

            ?

            "inline-block"

            :

            "none";

    if (dashboard) {

        dashboard.style.display =
            "none";

    }

    if (categorias) {

        categorias.style.display =
            "flex";

    }
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

/* ========================= */
/* 🔴 ADMINISTRACIÓN */
/* ========================= */

else {

    if (dashboard) {

        dashboard.style.display =
            "block";

    }

    if (categorias) {

        categorias.style.display =
            "none";

    }

    btnLogin.style.display =
        "none";

    btnLogout.style.display =
        "inline-block";

    menu.innerHTML = `

        <a href="index.html">

            Inicio

        </a>

        <a href="./pages/clientes.html" id="clientes">

            Clientes

        </a>

        <a href="./pages/productos.html" id="productos">

            Productos

        </a>

        <a href="./pages/reporte_ventas.html" id="ventas">

            Ventas

        </a>

        <a href="./pages/Reportes.html" id="reportes">

            Reportes

        </a>

    `;

    /* ========================= */
    /* ADMINISTRADOR */
    /* ========================= */

    if (rol === "Administrador") {

        document.getElementById(
            "bienvenida"
        ).textContent =

            "Panel de Administrador";

        container.appendChild(
            card("💰 Ventas")
        );

        container.appendChild(
            card("📦 Inventario")
        );

        container.appendChild(
            card("👤 Clientes")
        );

        container.appendChild(
            card("📊 Reportes")
        );

        container.appendChild(
            card("⚙️ Usuarios")
        );

        container.appendChild(
            card("📦 Productos")
        );

    }

    /* ========================= */
    /* VENDEDOR */
    /* ========================= */

    if (rol === "Vendedor") {

        /* AGREGAR OPCIÓN PANEL CAJERO */

        menu.innerHTML += `

        <a href="./pages/dashboard_cajero.html">

            Panel Cajero

        </a>

    `;

        /*  OCULTAR REPORTES */


        document.getElementById(
            "reportes"
        ).style.display =
            "none";


    }

    /* ========================= */
    /* INVENTARIO */
    /* ========================= */

    if (rol === "Inventario") {
        menu.innerHTML += `

        <a href="./pages/dashboard_almacen.html">

            Panel de almacen

        </a>

    `;
        
        setTimeout(() => {

            document.getElementById(
                "ventas"
            ).style.display =
                "none";

            document.getElementById(
                "clientes"
            ).style.display =
                "none";

            document.getElementById(
                "reportes"
            ).style.display =
                "none";

        }, 0);

    }

}

function irLogin() {

    if (estaEnPages) {

        window.location.href =
            './login.html';

    } else {

        window.location.href =
            './pages/login.html';

    }

}
function logout() {

    localStorage.removeItem("rol");

    localStorage.removeItem("usuario");

    alert("Sesión cerrada");

    window.location.href =

        estaEnPages

            ?

            "../index.html"

            :

            "index.html";

}