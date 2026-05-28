document.addEventListener("DOMContentLoaded", () => {
    cargarDashboard();
    cargarGraficas();
});

// 🎨 COLORES (PRIMERO)
const colores = {
    azul: "#5566c8",
    rojo: "#c1121f",
    verde: "#2a9d8f",
    morado: "#8387c3"
};

async function cargarDashboard() {

    try {

        const id_usuario =

            localStorage.getItem(
                "id_usuario"
            );

        const response =

            await fetch(

                `http://localhost:3000/dashboard-cajero/${id_usuario}`

            );

        const data =
            await response.json();
        console.log(data);


        document.getElementById(
            "ventasHoy"
        ).textContent =

            `$${Number(data.ventasHoy)
                .toLocaleString('es-MX')}`;

        document.getElementById(
            "devolucionesHoy"
        ).textContent =

            data.devoluciones;

        document.getElementById(
            "tickets"
        ).textContent =

            data.tickets;

    } catch (error) {

        console.log(error);

    }

}
async function cargarGraficas() {

    try {

        const response =

            await fetch(
                'http://localhost:3000/dashboard-admin'
            );

        const data =
            await response.json();

        /* =========================
           VENTAS
        ========================= */

        new Chart(

            document.getElementById(
                "graficaVentas"
            ),

            {

                type: "line",

                data: {

                    labels:

                        (data.ventas || []).map,

                    datasets: [{

                        label:
                            "Ventas",

                        data:

                            data.ventas.map(
                                v => v.total
                            ),

                        borderColor:
                            colores.azul,

                        backgroundColor:
                            colores.morado,

                        fill: true,

                        tension: .4

                    }]

                }

            }

        );

        /* =========================
           PRODUCTOS
        ========================= */

        new Chart(

            document.getElementById(
                "graficaProductos"
            ),

            {

                type: "bar",

                data: {

                    labels:

                        data.productos.map(
                            p => p.nombre_producto
                        ),

                    datasets: [{

                        label:
                            "Vendidos",

                        data:

                            (data.productos || []).map,

                        backgroundColor:
                            colores.azul

                    }]

                }

            }

        );

        /* =========================
           TABLA STOCK
        ========================= */

       /* const tabla =

            document.getElementById(
                "tablaStock"
            );

        tabla.innerHTML = "";

        data.stock.forEach(p => {

            tabla.innerHTML += `

                <tr>

                    <td>

                        ${p.nombre_producto}

                    </td>

                    <td>

                        ${p.stock}

                    </td>

                </tr>

            `;

        });*/

    }

    catch (error) {

        console.log(error);

    }

}
// 📄 EXPORTAR PDF
function exportarPDF() {

    const { jsPDF } = window.jspdf;

    html2canvas(document.getElementById("dashboard")).then(canvas => {

        let img = canvas.toDataURL("image/png");

        let pdf = new jsPDF();
        pdf.addImage(img, "PNG", 0, 0, 210, 297);
        pdf.save("dashboard.pdf");
    });
}