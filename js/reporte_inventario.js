// 🔥 INICIAR
document.addEventListener("DOMContentLoaded", () => {
    mostrarInventario();
});

// 🔥 MOSTRAR INVENTARIO
function mostrarInventario(productosFiltrados = null){

    let productos = productosFiltrados || JSON.parse(localStorage.getItem("productos")) || [];
    let tabla = document.getElementById("tablaInventario");

    tabla.innerHTML = "";

    if(productos.length === 0){
        tabla.innerHTML = "<tr><td colspan='3'>No hay productos</td></tr>";
        return;
    }

    productos.forEach(p => {

        let estado = "";
        
        if(p.stock <= 5){
            estado = "🔴 Crítico";
        }else if(p.stock <= 10){
            estado = "🟠 Bajo";
        }else{
            estado = "🟢 Normal";
        }

        let fila = `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.stock}</td>
                <td>${estado}</td>
            </tr>
        `;

        tabla.innerHTML += fila;
    });
}

// 🔍 FILTRO DE STOCK
function filtrarStock(){

    let limite = parseInt(document.getElementById("filtroStock").value);
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    if(!limite){
        mostrarInventario();
        return;
    }

    let filtrados = productos.filter(p => p.stock <= limite);

    mostrarInventario(filtrados);
}