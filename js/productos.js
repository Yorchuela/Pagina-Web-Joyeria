document.addEventListener("DOMContentLoaded", mostrarProductos);
const params =

    new URLSearchParams(
        window.location.search
    );

if (params.get('editado')) {

    alert(
        'Producto actualizado'
    );

}
// ➕ EDITAR
function editarProducto(id) {
    console.log(id);

    window.location.href =

        `editar_producto.html?id=${id}`;

}

// ➕ GUARDAR 
async function guardarProducto(e) {

    e.preventDefault();

    const nombre_producto =
        document.getElementById("nombre").value;

    const descripcion =
        document.getElementById("descripcion").value;

    const id_categoria =
        document.getElementById("categoria").value;

    const serie =
        document.getElementById("serie").value;

    const certificado_autenticidad =
        document.getElementById("certificado").value;

    const kilataje =
        document.getElementById("kilataje").value;

    const precio =
        document.getElementById("precio").value;

    const ruta_imagen = 'https://via.placeholder.com/80';

    const estado_producto =
        document.getElementById("estado_producto").value;

    try {

        const response =
            await fetch(
                'http://localhost:3000/productos',
                {

                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({

                        nombre_producto,
                        descripcion,
                        id_categoria,
                        serie,
                        certificado_autenticidad,
                        kilataje,
                        precio,
                        ruta_imagen,
                        estado_producto

                    })

                });

        const data =
            await response.json();

        if (data.success) {

            alert('Producto agregado');

            mostrarProductos();

            e.target.reset();

        }

    } catch (error) {

        console.log(error);

    }

}
document.addEventListener(

    "DOMContentLoaded",

    () => {

        mostrarProductos();

        /* MENSAJE */

        /* MENSAJE PRODUCTO */

        if (

            localStorage.getItem(
                'productoActualizado'
            )

        ) {

            alert(
                'Producto actualizado'
            );

            localStorage.removeItem(
                'productoActualizado'
            );

        }

    }

);

// 📋 MOSTRAR
async function mostrarProductos(lista = null) {

    const tabla =
        document.getElementById("tablaProductos");

    tabla.innerHTML = "";

    let productos = lista;

    if (!productos) {

        const response =
            await fetch(
                'http://localhost:3000/productos'
            );

        productos =
            await response.json();

    }

    productos.forEach(p => {

        tabla.innerHTML += `
        
<tr>

    <td>

        <img

            src="${p.ruta_imagen

                ?

                'http://localhost:3000' +
                p.ruta_imagen

                :

                'https://via.placeholder.com/80'
            }"

        >

    </td>
    

    <td>${p.nombre_producto}</td>

    <td>${p.descripcion || ''}</td>

    <td>${p.nombre_categoria}</td>

    <td>${p.serie}</td>

    <td>

        ${p.certificado_autenticidad || 'N/A'
            }

    </td>

    <td>

         ${p.kilataje
                ?
                parseInt(p.kilataje) + 'K'
                :
                'N/A'}

    </td>

    <td>$${p.precio}</td>

    <td>${p.estado_producto}</td>

    <td>
    ${new Date(p.fecha_registro)
                .toLocaleDateString('es-MX')}
    </td>

    <td>

        <div class="acciones">

        <button
        onclick="editarProducto(${p.id_producto})"
        >
           ✏️ Editar
        </button>

        <button
        onclick="eliminarProducto(${p.id_producto})"
        >
           🗑 Eliminar
        </button>

        </div>

    </td>

</tr>
        
`;

    });

}
// 🔍 BUSCAR
async function buscarProductos() {

    const texto =
        document.getElementById("buscador")
            .value
            .toLowerCase();

    const response =
        await fetch(
            'http://localhost:3000/productos'
        );

    const productos =
        await response.json();

    const filtrados =
        productos.filter(p =>

            p.nombre_producto
                .toLowerCase()
                .includes(texto)

            ||

            p.serie
                .toLowerCase()
                .includes(texto)

            ||

            p.estado_producto
                .toLowerCase()
                .includes(texto)

        );

    mostrarProductos(filtrados);

}
//  ELIMINAR
async function eliminarProducto(id) {

    const confirmar =
        confirm(
            '¿Eliminar producto?'
        );

    if (!confirmar) {

        return;

    }

    try {

        const response =
            await fetch(

                `http://localhost:3000/productos/${id}`,

                {

                    method: 'DELETE'

                }

            );

        const data =
            await response.json();

        if (data.success) {

            alert(
                'Producto eliminado'
            );

            mostrarProductos();

        }

    } catch (error) {

        console.log(error);

    }

}
//  CARGAR CATEGORIA
async function cargarCategorias() {

    try {

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

    } catch (error) {

        console.log(error);

    }

}

function irAgregarProducto() {

    window.location.href =
        'agregar_producto.html';

}