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

async function cargarDashboard(){

    try{

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

        document.getElementById(
            "ventasHoy"
        ).textContent =

            `$${Number(data.ventasHoy)
                .toLocaleString('es-MX')}`;

        document.getElementById(
            "devoluciones"
        ).textContent =

            data.devoluciones;

        document.getElementById(
            "tickets"
        ).textContent =

            data.tickets;

    } catch(error){

        console.log(error);

    }

}
function cargarGraficas(){

    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    let devoluciones = JSON.parse(localStorage.getItem("devoluciones")) || [];

    // 📊 VENTAS POR DÍA
    let ventasPorDia = {};

    ventas.forEach(v => {
        let fecha = v.fecha || "Sin fecha";

        if(!ventasPorDia[fecha]){
            ventasPorDia[fecha] = 0;
        }

        ventasPorDia[fecha] += v.total;
    });

    new Chart(document.getElementById("graficaVentas"), {
        type: "line",
        data: {
            labels: Object.keys(ventasPorDia),
            datasets: [{
                label: "Ventas",
                data: Object.values(ventasPorDia),
                borderColor: colores.azul,
                backgroundColor: colores.morado,
                tension: 0.3,
                fill: true
            }]
        }
    });

    // 📦 PRODUCTOS MÁS VENDIDOS
    let productosVendidos = {};

    ventas.forEach(v => {
        if(!v.productos) return;

        v.productos.forEach(p => {
            if(!productosVendidos[p.nombre]){
                productosVendidos[p.nombre] = 0;
            }
            productosVendidos[p.nombre] += p.cantidad;
        });
    });

    new Chart(document.getElementById("graficaProductos"), {
        type: "bar",
        data: {
            labels: Object.keys(productosVendidos),
            datasets: [{
                label: "Cantidad Vendida",
                data: Object.values(productosVendidos),
                backgroundColor: colores.azul
            }]
        }
    });

    // 🔄 DEVOLUCIONES
    let devPorDia = {};

    devoluciones.forEach(d => {
        let fecha = d.fecha || "Sin fecha";

        if(!devPorDia[fecha]){
            devPorDia[fecha] = 0;
        }

        devPorDia[fecha]++;
    });

    new Chart(document.getElementById("graficaDevoluciones"), {
        type: "bar",
        data: {
            labels: Object.keys(devPorDia),
            datasets: [{
                label: "Devoluciones",
                data: Object.values(devPorDia),
                backgroundColor: colores.rojo
            }]
        }
    });

    // 💰 INGRESOS VS EGRESOS
    let ingresos = 0;
    let egresos = 0;

    ventas.forEach(v => ingresos += v.total);

    devoluciones.forEach(d => {
        let venta = ventas.find(v => v.id == d.idVenta);
        if(venta){
            let prod = venta.productos.find(p => p.nombre == d.producto);
            if(prod){
                egresos += prod.precio * d.cantidad;
            }
        }
    });

    new Chart(document.getElementById("graficaCaja"), {
        type: "doughnut",
        data: {
            labels: ["Ingresos", "Egresos"],
            datasets: [{
                data: [ingresos, egresos],
                backgroundColor: [colores.verde, colores.rojo]
            }]
        }
    });
}

// 📄 EXPORTAR PDF
function exportarPDF(){

    const { jsPDF } = window.jspdf;

    html2canvas(document.getElementById("dashboard")).then(canvas => {

        let img = canvas.toDataURL("image/png");

        let pdf = new jsPDF();
        pdf.addImage(img, "PNG", 0, 0, 210, 297);
        pdf.save("dashboard.pdf");
    });
}