// 🔥 INICIAR
document.addEventListener("DOMContentLoaded", () => {

    mostrarInventario();

    cargarCategorias();

});

// 🔥 MOSTRAR INVENTARIO
async function mostrarInventario(productosFiltrados = null) {

    try {

        let productos = productosFiltrados;

        // 🔥 SI NO HAY FILTROS TRAER TODO
        if (!productos) {

            const response = await fetch(
                "http://localhost:3000/productos"
            );

            productos = await response.json();
            console.log(productos);

        }

        const tabla =
            document.getElementById("tablaInventario");

        tabla.innerHTML = "";

        let totalPiezas = 0;

        let valorInventario = 0;

        // 🔥 SIN PRODUCTOS
        if (productos.length === 0) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="7">
                        No hay productos registrados
                    </td>
                </tr>
            `;

            return;

        }

        // 🔥 RECORRER PRODUCTOS
        productos.forEach(p => {

            totalPiezas++;

            valorInventario += Number(p.precio);

            let fila = `
            
                <tr>

                    <td>
                        ${p.id_producto}
                    </td>

                    <td>
                        <button 
                            class="btn-ver"
                            onclick='verDetalle(${JSON.stringify(p)})'
                        >
                            👁
                        </button>
                    </td>

                    <td>
                        ${p.producto}
                    </td>

                    <td>
                        ${p.categoria}
                    </td>

                    <td>
                        ${p.kilataje}K
                    </td>

                    <td>
                        ${p.estado}
                    </td>

                    <td>
                        $${Number(p.precio).toFixed(2)}
                    </td>

                </tr>

            `;

            tabla.innerHTML += fila;

        });

        // 🔥 CARDS
        document.getElementById("totalPiezas")
            .textContent = totalPiezas;

        document.getElementById("valorInventario")
            .textContent = valorInventario.toFixed(2);

    } catch (error) {

        console.error(
            "Error cargando inventario:",
            error
        );

    }

}

// 🔍 FILTRAR INVENTARIO
async function filtrarInventario() {

    try {

        const texto =
            document.getElementById("busqueda")
            .value
            .toLowerCase();

        const categoria =
            document.getElementById("filtroCategoria")
            .value;

        const estado =
            document.getElementById("filtroEstado")
            .value;

        const response = await fetch(
            "http://localhost:3000/productos"
        );

        let productos =
            await response.json();

        let filtrados = productos.filter(p => {

            let coincideTexto =

                p.producto
                .toLowerCase()
                .includes(texto)

                ||

                String(p.id_producto)
                .includes(texto);

            let coincideCategoria =

                categoria === ""

                ||

                p.categoria === categoria;

            let coincideEstado =

                estado === ""

                ||

                p.estado === estado;

            return coincideTexto
                &&
                coincideCategoria
                &&
                coincideEstado;

        });

        mostrarInventario(filtrados);

    } catch (error) {

        console.error(
            "Error filtrando inventario:",
            error
        );

    }

}

// ✖ LIMPIAR FILTROS
function limpiarFiltros() {

    document.getElementById("busqueda").value = "";

    document.getElementById("filtroCategoria").value = "";

    document.getElementById("filtroEstado").value = "";

    mostrarInventario();

}

// 🔥 CARGAR CATEGORIAS
async function cargarCategorias() {

    try {

        const response = await fetch(
            "http://localhost:3000/productos"
        );

        const productos =
            await response.json();

        const select =
            document.getElementById("filtroCategoria");

        // 🔥 ELIMINAR REPETIDOS
        const categorias = [

            ...new Set(
                productos.map(
                    p => p.categoria
                )
            )

        ];

        categorias.forEach(cat => {

            if (!cat) return;

            select.innerHTML += `
            
                <option value="${cat}">
                    ${cat}
                </option>

            `;

        });

    } catch (error) {

        console.error(
            "Error cargando categorías:",
            error
        );

    }

}

// 👁 VER DETALLE
function verDetalle(producto) {

    const modal =
        document.getElementById("modalDetalle");

    const detalle =
        document.getElementById("detalleProducto");

    detalle.innerHTML = `
    
        <div class="detalle-box">

            <img
                src="http://localhost:3000${producto.ruta_imagen}"
                class="img-detalle"
            >

            <h2>
                ${producto.producto}
            </h2>

            <p>
                <strong>Categoría:</strong>
                ${producto.categoria}
            </p>

            <p>
                <strong>Kilataje:</strong>
                ${producto.kilataje}K
            </p>

            <p>
                <strong>Precio:</strong>
                $${Number(producto.precio).toFixed(2)}
            </p>

            <p>
                <strong>Estado:</strong>
                ${producto.estado}
            </p>

            <p>
                <strong>Serie:</strong>
                ${producto.serie}
            </p>

            <p>
                <strong>Descripción:</strong>
                ${producto.descripcion}
            </p>

        </div>

    `;

    modal.style.display = "flex";

}

// ❌ CERRAR MODAL
function cerrarModal() {

    document.getElementById(
        "modalDetalle"
    ).style.display = "none";

}

// 📗 EXPORTAR EXCEL
document.querySelector(".btn-excel")
.addEventListener("click", exportarExcel);

function exportarExcel() {

    let tabla =
        document.querySelector("table");

    let wb =
        XLSX.utils.table_to_book(tabla);

    XLSX.writeFile(
        wb,
        "Reporte_Inventario.xlsx"
    );

}

// 📕 EXPORTAR PDF
document.querySelector(".btn-pdf")
.addEventListener("click", exportarPDF);

function exportarPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.text(
        "Reporte de Inventario",
        14,
        15
    );

    doc.autoTable({

        html: "table",

        startY: 25

    });

    doc.save(
        "Reporte_Inventario.pdf"
    );

}