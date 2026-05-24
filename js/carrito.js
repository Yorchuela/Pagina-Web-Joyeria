document.addEventListener(

    "DOMContentLoaded",

    mostrarCarrito

);

function mostrarCarrito() {

    const contenedor =

        document.getElementById(
            'contenedorCarrito'
        );

    const totalHTML =

        document.getElementById(
            'total'
        );

    let carrito =

        JSON.parse(
            localStorage.getItem('carrito')
        ) || [];

    contenedor.innerHTML = "";

    let total = 0;

    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <h2>

                Carrito vacío

            </h2>

        `;

        totalHTML.textContent =
            '$0';

        return;

    }

    carrito.forEach((p, index) => {

        const subtotal =

            p.precio * p.cantidad;

        total += subtotal;

        contenedor.innerHTML += `

        <div class="producto">

            <img
                src="${p.ruta_imagen

                ?

                'http://localhost:3000' +
                p.ruta_imagen

                :

                'https://via.placeholder.com/150'
            }"

                class="img-producto"
            >

            <div class="info">

                <h3>

                    ${p.nombre_producto}

                </h3>

                <p>

                    ${p.descripcion || ''}

                </p>

                <p>

                    <strong>
                        Kilataje:
                    </strong>

                    ${parseInt(p.kilataje) || 'N/A'}K

                </p>

                <p>

                    <strong>
                        Serie:
                    </strong>

                    ${p.serie}

                </p>

                <p>

                    <strong>
                        Certificado:
                    </strong>

                    ${p.certificado_autenticidad || 'N/A'}

                </p>

                <p class="precio">

                    Precio: $${Number(p.precio).toLocaleString()}

                </p>

            </div>

            <div class="acciones">

    <div class="cantidad">

        <span>

            Cantidad:

        </span>

        <strong>

            ${p.cantidad}

        </strong>

    </div>

    <p class="subtotal">

        Total: $${Number(subtotal).toLocaleString()}

    </p>

    <button
        class="btn-eliminar"
        onclick="eliminarProducto(${index})"
    >  🗑 Eliminar

    </button>

</div>
        </div>

        `;

    });

    totalHTML.textContent =

        '$' +

        Number(total).toLocaleString(
            'es-MX'
        );

}

/* ========================= */
/* ELIMINAR */
/* ========================= */

function eliminarProducto(index){

    const confirmar =

    confirm(
        '¿Seguro que deseas eliminar este producto del carrito?'
    );

    if(!confirmar){

        return;

    }

    let carrito =

    JSON.parse(
        localStorage.getItem('carrito')
    ) || [];

    carrito.splice(index,1);

    localStorage.setItem(

        'carrito',

        JSON.stringify(carrito)

    );

    mostrarCarrito();

}

/* ========================= */
/* VOLVER */
/* ========================= */

function volverCatalogo() {

    window.location.href =
        'catalogo.html';

}

/* ========================= */
/* COMPRAR */
/* ========================= */

async function comprar(){

    const rol =

    localStorage.getItem('rol');

    /* VALIDAR LOGIN */

    if(rol !== 'Cliente'){

        alert(
            'Debes iniciar sesión como Cliente'
        );

        window.location.href =
        './login.html';

        return;

    }

    /* OBTENER CARRITO */

    const carrito =

    JSON.parse(
        localStorage.getItem('carrito')
    ) || [];

    /* VALIDAR CARRITO */

    if(carrito.length === 0){

        alert(
            'Carrito vacío'
        );

        return;

    }

    /* OBTENER CLIENTE */

    const id_cliente =

    localStorage.getItem(
        'id_cliente'
    );

    try{

        const response =

        await fetch(

            'http://localhost:3000/ventas',

            {

                method:'POST',

                headers:{
                    'Content-Type':
                    'application/json'
                },

                body:JSON.stringify({

                    id_cliente,
                    carrito

                })

            }

        );

        const data =
        await response.json();

        if(data.success){

            alert(
                'Compra realizada correctamente'
            );

            localStorage.removeItem(
                'carrito'
            );

            mostrarCarrito();

        }

    } catch(error){

        console.log(error);

    }

}