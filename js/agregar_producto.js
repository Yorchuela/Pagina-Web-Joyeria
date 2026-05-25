document.addEventListener(

    "DOMContentLoaded",

    () => {

        cargarCategorias();

    }

);

async function guardarProducto(e){

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

    formData.append(
        'imagen',
        imagen
    );

    try{

        const response =
        await fetch(

            'http://localhost:3000/productos',

            {

                method:'POST',

                body:formData

            }

        );

        const data =
        await response.json();

        if(data.success){

            alert(
                'Producto agregado'
            );

            window.location.href =
            'productos.html';

        }

    } catch(error){

        console.log(error);

    }

}

async function cargarCategorias(){

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

function volver(){

    window.location.href =
        'productos.html';

}