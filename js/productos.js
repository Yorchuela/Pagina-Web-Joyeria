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

    async () => {

        const response =

            await fetch(
                'http://localhost:3000/productos'
            );

        const productos =
            await response.json();

        mostrarProductos(
            productos
        );

    }

);

// 📋 MOSTRAR
function mostrarProductos(productos) {

    const tabla =

        document.getElementById(
            "tablaProductos"
        );

     tabla.innerHTML = "";

        productos.forEach(p => {

        tabla.innerHTML += `

                <tr>

                <td>

                    ${p.id_producto}

                </td>

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

                <td>

                    ${p.nombre_producto}

                </td>

                <td>

                    $${p.precio}

                </td>

                <td>

                    <span class="
                        ${p.estado_producto === 'Disponible'
                            ? 'estado-disponible'
                            : 'estado-vendido'
                        }
                    ">

                        ${p.estado_producto}

                    </span>

                </td>

                <td>

                    <div class="acciones">

                        <button
                            onclick='verDetalleProducto(
                                ${JSON.stringify(p)}
                            )'
                        >

                            👁 Ver

                        </button>

                        <button
                            onclick="
                                editarProducto(
                                    ${p.id_producto}
                                )
                            "
                        >

                            ✏️ Editar

                        </button>

                        <button
                            onclick="
                                eliminarProducto(
                                    ${p.id_producto}
                                )
                            "
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

        document.getElementById(
            "buscador"
        )
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

            p.id_producto
                .toString()
                .includes(texto)

            ||

            p.nombre_producto
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
/* LIMPIAR BUSQUEDA */

async function limpiarBusqueda() {

    document.getElementById(
        "buscador"
    ).value = "";

    const response =

        await fetch(
            'http://localhost:3000/productos'
        );

    const productos =
        await response.json();

    mostrarProductos(
        productos
    );

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
/* EXPORTAR EXCEL*/

function exportarExcelProductos() {

    const tabla =

        document.querySelector("table");

    const wb =

        XLSX.utils.table_to_book(
            tabla,
            {
                sheet: "Productos"
            }
        );

    XLSX.writeFile(
        wb,
        "productos.xlsx"
    );

}

/* EXPORTAR PDF*/

async function exportarPDFProductos() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF(
        'landscape'
    );

    /* FECHA */

    const fecha = new Date();

    const fechaActual =

        fecha.toLocaleDateString();

    /* TITULO */

    doc.setFontSize(22);

    doc.text(
        "JOYERIA WEB",
        14,
        20
    );

    /* SUBTITULO */

    doc.setFontSize(14);

    doc.text(
        "Reporte de Productos",
        14,
        30
    );

    /* FECHA */

    doc.setFontSize(11);

    doc.text(
        `Fecha exportación: ${fechaActual}`,
        14,
        40
    );

    /* FILAS */

    const filas = [];

    document.querySelectorAll(
        "#tablaProductos tr"
    ).forEach(fila => {

        const columnas =

            fila.querySelectorAll("td");

        filas.push([

            columnas[0].textContent.trim(),
            columnas[2].textContent.trim(),
            columnas[3].textContent.trim(),
            columnas[4].textContent.trim(),
            columnas[5].textContent.trim(),
            columnas[6].textContent.trim(),
            columnas[7].textContent.trim(),
            columnas[8].textContent.trim(),
            columnas[9].textContent.trim(),
            columnas[10].textContent.trim()

        ]);

    });

    /* TABLA */

    doc.autoTable({

        startY: 50,

        head: [[
            "ID",
            "PRODUCTO",
            "DESCRIPCIÓN",
            "CATEGORÍA",
            "SERIE",
            "CERTIFICADO",
            "KILATAJE",
            "PRECIO",
            "ESTADO",
            "FECHA"
        ]],

        body: filas,

        styles: {
            fontSize: 8
        },

        headStyles: {
            fillColor: [131, 135, 195]
        }

    });

    /* TOTAL */

    doc.text(

        `Total productos: ${filas.length}`,

        14,

        doc.lastAutoTable.finalY + 15

    );

    /* GUARDAR */

    doc.save(
        "reporte_productos.pdf"
    );

}
/* =========================
   VER DETALLE PRODUCTO
========================= */

function verDetalleProducto(p){

    document.getElementById(
        "modalDetalle"
    ).style.display = "flex";

    /* IMAGEN */

    document.getElementById(
        "detalleImagen"
    ).src =

        p.ruta_imagen

        ?

        'http://localhost:3000' +
        p.ruta_imagen

        :

        'https://via.placeholder.com/300';

    /* DATOS */

    document.getElementById(
        "detalleNombre"
    ).textContent =

        p.nombre_producto;

    document.getElementById(
        "detalleID"
    ).textContent =

        p.id_producto;

    document.getElementById(
        "detalleDescripcion"
    ).textContent =

        p.descripcion;

    document.getElementById(
        "detalleCategoria"
    ).textContent =

        p.nombre_categoria;

    document.getElementById(
        "detalleSerie"
    ).textContent =

        p.serie;

    document.getElementById(
        "detalleCertificado"
    ).textContent =

        p.certificado_autenticidad;

    document.getElementById(
        "detalleKilataje"
    ).textContent =

        p.kilataje + "K";

    document.getElementById(
        "detallePrecio"
    ).textContent =

        "$" + p.precio;

    document.getElementById(
        "detalleEstado"
    ).textContent =

        p.estado_producto;

    document.getElementById(
        "detalleFecha"
    ).textContent =

        new Date(
            p.fecha_registro
        ).toLocaleDateString(
            'es-MX'
        );

}

/* CERRAR */

function cerrarModalDetalle(){

    document.getElementById(
        "modalDetalle"
    ).style.display = "none";

}