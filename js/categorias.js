document.addEventListener(

    "DOMContentLoaded",

    mostrarCategorias

);

async function mostrarCategorias() {

    try {

        const response =

            await fetch(
                'http://localhost:3000/categorias'
            );

        const categorias =
            await response.json();

        const contenedor =

            document.getElementById(
                'contenedorCategorias'
            );

        contenedor.innerHTML = "";

        categorias.forEach(c => {

            contenedor.innerHTML += `

        <div
            class="card"
            onclick="verProductos(
                ${c.id_categoria}
            )"
        >

            <h3>

                ${c.nombre_categoria}

            </h3>

            <p>

                Explorar colección

            </p>

        </div>

    `;

        });
    } catch (error) {

        console.log(error);

    }

}

function verProductos(id) {

    window.location.href =

        `catalogo.html?id_categoria=${id}`;

}