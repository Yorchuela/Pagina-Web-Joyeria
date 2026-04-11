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

function cargarDashboard(){

    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let devoluciones = JSON.parse(localStorage.getItem("devoluciones")) || [];

    let hoy = new Date().toLocaleDateString();

    let ventasHoy = 0;
    let devolucionesHoy = 0;
    let totalCaja = 0;
    let stockBajo = 0;

    ventas.forEach(v => {
        totalCaja += v.total;
        if(v.fecha === hoy){
            ventasHoy += v.total;
        }
    });

    devoluciones.forEach(d => {
        if(d.fecha === hoy){
            devolucionesHoy++;
        }
    });

    let tabla = document.getElementById("tablaStock");
    tabla.innerHTML = "";

    productos.forEach(p => {
        if(p.stock <= 10){
            stockBajo++;

            tabla.innerHTML += `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.stock}</td>
                </tr>
            `;
        }
    });

    document.getElementById("ventasHoy").textContent = "$" + ventasHoy;
    document.getElementById("stockBajo").textContent = stockBajo;
    document.getElementById("devolucionesHoy").textContent = devolucionesHoy;
    document.getElementById("totalCaja").textContent = "$" + totalCaja;
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