document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarProductos();
        mostrarMovimientos();


    }
);

/* CARGAR PRODUCTOS */

async function cargarProductos() {

    try {

        const response =

            await fetch(
                'http://localhost:3000/productos'
            );

        const productos =
            await response.json();

        const select =
            document.getElementById(
                "producto"
            );

        select.innerHTML = `

            <option disabled selected>

                Seleccione producto

            </option>

        `;

        productos.forEach(p => {

            select.innerHTML += `

                <option value="${p.id_producto}">
                    [${p.id_producto}] 
                    ${p.nombre_producto}
                    | ${p.estado_producto}

                </option>

            `;

        });

    } catch (error) {

        console.log(error);

    }

}

async function registrarMovimiento(e) {

    e.preventDefault();

    const id_producto =

        document.getElementById(
            "producto"
        ).value;

    const tipo_movimiento =

        document.getElementById(
            "tipo"
        ).value;

    const cantidad =

        document.getElementById(
            "cantidad"
        ).value;

    const motivo =

        document.getElementById(
            "motivo"
        ).value;

    const id_usuario =

        localStorage.getItem(
            "id_usuario"
        );
    /* ESTADO PRODUCTO */

    const estadoProducto =

        document.getElementById(
            "producto"
        ).dataset.estado;

    /* VALIDAR */

    if (

        estadoProducto === 'Vendido'

        &&

        tipo_movimiento.toLowerCase()
        === 'salida'

    ) {

        alert(

            'Este producto ya está vendido'

        );

        return;

    }

    try {

        const response =

            await fetch(

                'http://localhost:3000/movimientos',

                {

                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        id_producto,
                        tipo_movimiento,
                        motivo,
                        cantidad,
                        id_usuario

                    })

                }

            );

        const data =
            await response.json();

        if (data.success) {

            alert(
                'Movimiento registrado'
            );
            mostrarMovimientos();

            document.querySelector(
                "form"
            ).reset();

        }

    } catch (error) {

        console.log(error);

    }

}
/* MOSTRAR HISTORIAL */

async function mostrarMovimientos() {

    try {

        const response =

            await fetch(
                'http://localhost:3000/movimientos'
            );

        const movimientos =
            await response.json();

        const tabla =

            document.getElementById(
                "tablaMovimientos"
            );

        tabla.innerHTML = "";

        movimientos.forEach(m => {

            tabla.innerHTML += `

            <tr>

                <td>

                    ${m.id_movimiento}

                </td>
                <td>

                    ${m.id_producto}

                </td>

                <td>

                    ${m.nombre_producto}

                </td>

                <td>

                    <span class="
                        ${m.tipo_movimiento.toLowerCase() === 'entrada'
                    ? 'badge-entrada'
                    : 'badge-salida'
                }
                    ">

                        ${m.tipo_movimiento}

                    </span>

                </td>

                <td>

                    ${m.cantidad}

                </td>

                <td>

                    ${m.motivo}

                </td>

                <td>

                    ${m.nombre}

                </td>

                <td>

                    ${new Date(
                    m.fecha_movimiento
                ).toLocaleDateString()}

                </td>

            </tr>

            `;

        });

    } catch (error) {

        console.log(error);

    }

}
/* MODAL */

function abrirModalHistorial() {

    document.getElementById(
        "modalHistorial"
    ).style.display = "flex";

}

function cerrarModalHistorial() {

    document.getElementById(
        "modalHistorial"
    ).style.display = "none";

}

/* FILTRAR */

function filtrarMovimientos() {

    const texto =

        document.getElementById(
            "buscadorMovimiento"
        ).value
            .trim()
            .toLowerCase();

    const filas =

        document.querySelectorAll(
            "#tablaMovimientos tr"
        );

    filas.forEach(fila => {

        const columnas = fila.querySelectorAll("td");

        if (columnas.length < 8) {

            return;

        }

        const idMovimiento =

            columnas[0]
                .textContent
                .trim();

        const idProducto =

            columnas[1]
                .textContent
                .trim();

        const producto =

            columnas[2]
                .textContent
                .toLowerCase();

        const fecha =

            columnas[7]
                .textContent
                .toLowerCase();

        let coincide = false;

        /* BUSQUEDA NUMERICA */

        if (!isNaN(texto) && texto !== "") {

            coincide =

                idMovimiento === texto ||

                idProducto === texto;

        }

        /* BUSQUEDA TEXTO */

        else {

            coincide =

                producto.includes(texto) ||

                fecha.includes(texto);

        }

        fila.style.display =

            coincide || texto === ""

                ? ""

                : "none";

    });

}
async function filtrarPorFecha() {

    const fechaInicio =

        document.getElementById(
            "fechaInicio"
        ).value;

    const fechaFin =

        document.getElementById(
            "fechaFin"
        ).value;

    try {

        const response =

            await fetch(

                `http://localhost:3000/movimientos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`

            );

        const movimientos =
            await response.json();

        const tabla =

            document.getElementById(
                "tablaMovimientos"
            );

        tabla.innerHTML = "";

        movimientos.forEach(m => {

            tabla.innerHTML += `

            <tr>

                <td>

                    ${m.id_movimiento}

                </td>

                <td>

                    ${m.nombre_producto}

                </td>

                <td>

                    <span class="
                        ${m.tipo_movimiento.toLowerCase() === 'entrada'
                    ? 'badge-entrada'
                    : 'badge-salida'
                }
                    ">

                        ${m.tipo_movimiento}

                    </span>

                </td>

                <td>

                    ${m.cantidad}

                </td>

                <td>

                    ${m.motivo}

                </td>

                <td>

                    ${m.nombre}

                </td>

                <td>

                    ${new Date(
                    m.fecha_movimiento
                ).toLocaleDateString()}

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}
async function limpiarFiltros() {

    document.getElementById(
        "buscadorMovimiento"
    ).value = "";

    document.getElementById(
        "fechaInicio"
    ).value = "";

    document.getElementById(
        "fechaFin"
    ).value = "";

    mostrarMovimientos();

}
function exportarExcel() {

    const tabla =

        document.querySelector("table");

    const wb =

        XLSX.utils.table_to_book(
            tabla,
            {
                sheet: "Movimientos"
            }
        );

    XLSX.writeFile(
        wb,
        "movimientos_inventario.xlsx"
    );

}
async function exportarPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    /* FECHA */

    const fecha = new Date();

    const fechaActual =

        fecha.toLocaleDateString();

    /* TITULO */

    doc.setFontSize(22);

    doc.setTextColor(40);

    doc.text(
        "JOYERIA WEB",
        14,
        20
    );

    /* SUBTITULO */

    doc.setFontSize(14);

    doc.text(
        "Reporte de Movimientos",
        14,
        30
    );

    /* FECHA */

    doc.setFontSize(11);

    doc.text(
        `Fecha de exportación: ${fechaActual}`,
        14,
        40
    );

    /* RANGO FECHAS */

    const fechaInicio =

        document.getElementById(
            "fechaInicio"
        ).value;

    const fechaFin =

        document.getElementById(
            "fechaFin"
        ).value;

    if (fechaInicio && fechaFin) {

        doc.text(

            `Rango: ${fechaInicio} al ${fechaFin}`,

            14,

            48

        );

    }

    /* TABLA */

    const filas = [];

    document.querySelectorAll(
        "#tablaMovimientos tr"
    ).forEach(fila => {

        if (
            fila.style.display !== "none"
        ) {

            const columnas =

                fila.querySelectorAll("td");

            filas.push([

                columnas[0].textContent.trim(),
                columnas[1].textContent.trim(),
                columnas[2].textContent.trim(),
                columnas[3].textContent.trim(),
                columnas[4].textContent.trim(),
                columnas[5].textContent.trim(),
                columnas[6].textContent.trim(),
                columnas[7].textContent.trim()

            ]);

        }

    });

    /* TABLA PDF */

    doc.autoTable({

        startY: 60,

        head: [[
            "ID MOV",
            "ID PROD",
            "PRODUCTO",
            "TIPO",
            "CANTIDAD",
            "MOTIVO",
            "USUARIO",
            "FECHA"
        ]],

        body: filas,

        styles: {

            fontSize: 10

        },

        headStyles: {

            fillColor: [131, 135, 195]

        }

    });

    /* TOTAL */

    doc.text(

        `Total movimientos: ${filas.length}`,

        14,

        doc.lastAutoTable.finalY + 15

    );

    /* GUARDAR */

    doc.save(
        "reporte_movimientos.pdf"
    );

}
/* MODAL PRODUCTOS */

function abrirModalProductos() {

    document.getElementById(
        "modalProductos"
    ).style.display = "flex";

}

function cerrarModalProductos() {

    document.getElementById(
        "modalProductos"
    ).style.display = "none";

}

/* CARGAR PRODUCTOS MODAL */

async function cargarProductos() {

    try {

        const response =

            await fetch(
                'http://localhost:3000/productos'
            );

        const productos =
            await response.json();

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

                    ${p.nombre_producto}

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

                    <button
                        class="btn-seleccionar"
                        onclick="
                            seleccionarProducto(
                            '${p.id_producto}',
                            '${p.nombre_producto}',
                            '${p.estado_producto}'
                        )
                        "
                    >

                        Seleccionar

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

/* SELECCIONAR PRODUCTO */

function seleccionarProducto(
    id,
    nombre,
    estado
) {

    document.getElementById(
        "producto"
    ).value = id;

    document.getElementById(
        "productoSeleccionado"
    ).value =

        `[${id}] ${nombre}`;

    /* GUARDAR ESTADO */

    document.getElementById(
        "producto"
    ).dataset.estado = estado;

    cerrarModalProductos();

}

/* FILTRAR PRODUCTOS */

function filtrarProductos() {

    const texto =

        document.getElementById(
            "buscadorProducto"
        ).value.toLowerCase();

    const filas =

        document.querySelectorAll(
            "#tablaProductos tr"
        );

    filas.forEach(fila => {

        const id =

            fila.children[0]
                .textContent
                .toLowerCase();

        const producto =

            fila.children[1]
                .textContent
                .toLowerCase();

        const coincide =

            id.includes(texto) ||

            producto.includes(texto);

        fila.style.display =

            coincide

                ? ""

                : "none";

    });

}