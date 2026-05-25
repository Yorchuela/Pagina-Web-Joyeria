const params =

    new URLSearchParams(
        window.location.search
    );

if (params.get('editado')) {

    alert(
        'Producto actualizado'
    );

}
const id =
    params.get('id');
console.log(id);

document.addEventListener(

    "DOMContentLoaded",

    () => {

        cargarCategorias();

        obtenerProducto();
        document
            .getElementById(
                'formEditarProducto'
            )
            .addEventListener(
                'submit',
                guardarProducto
            );

    }

);

/* OBTENER PRODUCTO */

async function obtenerProducto() {

    try {

        const response =
            await fetch(

                `http://localhost:3000/productos/${id}`

            );

        const p =
            await response.json();

        console.log(p);

        document.getElementById("nombre").value =
            p.nombre_producto;

        document.getElementById("descripcion").value =
            p.descripcion || '';

        document.getElementById("serie").value =
            p.serie;

        document.getElementById("certificado").value =
            p.certificado_autenticidad || '';

        document.getElementById("kilataje").value =
            parseInt(p.kilataje) || '';

        document.getElementById("precio").value =
            p.precio;

        document.getElementById("estado_producto").value =
            p.estado_producto;

        setTimeout(() => {

            document.getElementById("categoria").value =
                p.id_categoria;

        }, 300);

    } catch (error) {

        console.log(error);

    }

}

/* EDITAR PRODUCTO */

async function guardarProducto(e) {

    e.preventDefault();

    const formData = new FormData();

    formData.append(
        'nombre_producto',
        document.getElementById("nombre").value
    );

    formData.append(
        'descripcion',
        document.getElementById("descripcion").value
    );

    formData.append(
        'id_categoria',
        document.getElementById("categoria").value
    );

    formData.append(
        'serie',
        document.getElementById("serie").value
    );

    formData.append(
        'certificado_autenticidad',
        document.getElementById("certificado").value
    );

    formData.append(
        'kilataje',
        document.getElementById("kilataje").value
    );

    formData.append(
        'precio',
        document.getElementById("precio").value
    );

    formData.append(
        'estado_producto',
        document.getElementById("estado_producto").value
    );

    /* IMAGEN */

    const imagen =

        document.getElementById(
            "ruta_imagen"
        ).files[0];

    if (imagen) {

        formData.append(
            'imagen',
            imagen
        );

    }

    try {

        const response =
            await fetch(

                `http://localhost:3000/productos/${id}`,

                {

                    method: 'PUT',

                    body: formData

                }

            );
        console.log(response);


        if (response.ok) {

            console.log(
                'ENTRO AL REDIRECT'
            );

            localStorage.setItem(
                'productoActualizado',
                'true'
            );

            window.location.href =
                'productos.html';


        }

    } catch (error) {

        console.log(error);

    }

}

/* CARGAR CATEGORIAS */

async function cargarCategorias() {

    const response =
        await fetch(
            'http://localhost:3000/categorias'
        );

    const categorias =
        await response.json();

    const select =
        document.getElementById(
            'categoria'
        );

    categorias.forEach(c => {

        select.innerHTML += `

            <option value="${c.id_categoria}">

                ${c.nombre_categoria}

            </option>

        `;

    });

}

function volver() {

    window.location.href =
        'productos.html';

}