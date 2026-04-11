// 🔥 INICIAR
document.addEventListener("DOMContentLoaded", () => {
    cargarVentas();
    mostrarDevoluciones();
});

// 🔹 Cargar ventas en select
function cargarVentas(){
    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    let select = document.getElementById("ventaSelect");

    select.innerHTML = "<option value=''>Selecciona una venta</option>";

    ventas.forEach(v => {
        let option = document.createElement("option");
        option.value = v.id;
        option.textContent = "Venta #" + v.id + " - $" + v.total;
        select.appendChild(option);
    });
}

// 🔹 Cargar productos según venta
document.getElementById("ventaSelect").addEventListener("change", function(){

    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    let idVenta = this.value;

    let venta = ventas.find(v => v.id == idVenta);

    let selectProducto = document.getElementById("productoDevolucion");
    selectProducto.innerHTML = "";

    if(!venta) return;

    venta.productos.forEach(p => {
        let option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.nombre + " (Compró: " + p.cantidad + ")";
        selectProducto.appendChild(option);
    });
});

// 🔥 REALIZAR DEVOLUCIÓN
function realizarDevolucion(){

    let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let devoluciones = JSON.parse(localStorage.getItem("devoluciones")) || [];

    let idVenta = document.getElementById("ventaSelect").value;
    let idProducto = document.getElementById("productoDevolucion").value;
    let cantidad = parseInt(document.getElementById("cantidadDev").value);

    if(!idVenta || !idProducto){
        alert("Selecciona venta y producto");
        return;
    }

    if(!cantidad || cantidad <= 0){
        alert("Cantidad inválida");
        return;
    }

    let venta = ventas.find(v => v.id == idVenta);
    let productoVenta = venta.productos.find(p => p.id == idProducto);
    let productoStock = productos.find(p => p.id == idProducto);

    if(cantidad > productoVenta.cantidad){
        alert("No puedes devolver más de lo comprado");
        return;
    }

    // 🔥 REGRESAR STOCK
    productoStock.stock += cantidad;

    // 🔥 DESCONTAR DE LA VENTA
    productoVenta.cantidad -= cantidad;

    // eliminar producto si queda en 0
    if(productoVenta.cantidad === 0){
        venta.productos = venta.productos.filter(p => p.id != idProducto);
    }

    // 🔥 RECALCULAR TOTAL
    venta.total = venta.productos.reduce((acc, p) => {
        return acc + (p.precio * p.cantidad);
    }, 0);

    // 🔥 REGISTRAR DEVOLUCIÓN
    let nuevaDev = {
        id: Date.now(),
        idVenta,
        producto: productoVenta.nombre,
        cantidad,
        fecha: new Date().toLocaleDateString()
    };

    devoluciones.push(nuevaDev);

    // 🔥 GUARDAR TODO
    localStorage.setItem("ventas", JSON.stringify(ventas));
    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.setItem("devoluciones", JSON.stringify(devoluciones));

    alert("Devolución realizada correctamente");

    // 🔄 ACTUALIZAR
    cargarVentas();
    mostrarDevoluciones();

    document.getElementById("cantidadDev").value = "";
}

// 🔥 MOSTRAR HISTORIAL
function mostrarDevoluciones(){
    let devoluciones = JSON.parse(localStorage.getItem("devoluciones")) || [];
    let tabla = document.getElementById("tablaDevoluciones");

    tabla.innerHTML = "";

    devoluciones.forEach(d => {
        let fila = `
            <tr>
                <td>${d.idVenta}</td>
                <td>${d.producto}</td>
                <td>${d.cantidad}</td>
                <td>${d.fecha}</td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}