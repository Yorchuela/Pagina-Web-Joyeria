document.addEventListener(
    "DOMContentLoaded",
    mostrarCategorias
);

/* =========================
   MOSTRAR CATEGORIAS
========================= */

async function mostrarCategorias() {

    try {

        const response = await fetch(
            "http://localhost:3000/categorias"
        );

        const categorias =
            await response.json();

        const contenedor =
            document.getElementById(
                "contenedorCategorias"
            );

        contenedor.innerHTML = "";

        categorias.forEach(c => {

            contenedor.innerHTML += `

                <div
                    class="card"
                    onclick="verProductos(${c.id_categoria})"
                >

                    <div class="icono">
                        💎
                    </div>

                    <h3>
                        ${c.nombre_categoria}
                    </h3>

                    <p>
                        Explora nuestra colección exclusiva
                    </p>

                    <button>
                        Ver productos
                    </button>

                </div>
            `;
        });

    } catch (error) {

        console.log(
            "Error cargando categorías:",
            error
        );
    }
}

/* =========================
   IR A PRODUCTOS
========================= */

function verProductos(id) {

    const estaEnPages =
        window.location.pathname.includes(
            "/pages/"
        );

    window.location.href =

        estaEnPages

            ? `./catalogo.html?id_categoria=${id}`

            : `./pages/catalogo.html?id_categoria=${id}`;
}