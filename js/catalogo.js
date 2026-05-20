document.addEventListener(

    "DOMContentLoaded",

    mostrarProductos

);

async function mostrarProductos() {

    try {

        const response =
            await fetch(
                'http://localhost:3000/productos'
            );

        const productos =
            await response.json();

        const contenedor =
            document.getElementById(
                'contenedorProductos'
            );

        contenedor.innerHTML = "";

        productos.forEach(p => {

            contenedor.innerHTML += `
            
            <div class="card">

                <img
                    src="${p.ruta_imagen

                    ?

                    'http://localhost:3000' +
                    p.ruta_imagen

                    :

                    'https://via.placeholder.com/300'

                }"
                >

                <div class="card-contenido">

                    <h3>
                        ${p.nombre_producto}
                    </h3>

                    <p>
                        ${p.descripcion || ''}
                    </p>

                    <p class="precio">
                        $${p.precio}
                    </p>

                </div>

                <button
                    onclick="agregarCarrito(
                        ${p.id_producto},
                        '${p.nombre_producto}',
                        ${p.precio}
                    )"
                >

                    Agregar al carrito

                </button>

            </div>
            
            `;

        });

    } catch (error) {

        console.log(error);

    }

}

/* CARRITO */

function agregarCarrito(
    id,
    nombre,
    precio
) {

    let carrito =
        JSON.parse(
            localStorage.getItem('carrito')
        ) || [];

    carrito.push({

        id,
        nombre,
        precio

    });

    localStorage.setItem(
        'carrito',
        JSON.stringify(carrito)
    );

    alert('Producto agregado');

}