let carrito = [];
let total = 0;

// ======================
// CARGAR PRODUCTOS
// ======================

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

function cargarProductos() {

    const select = document.getElementById("producto");

    let productos =
        JSON.parse(localStorage.getItem("productos")) || [];

    select.innerHTML =
        '<option value="">Seleccione un producto</option>';

    productos.forEach((producto, index) => {

        select.innerHTML += `
            <option value="${index}">
                ${producto.nombre}
                - $${producto.precio}
                (Stock: ${producto.stock})
            </option>
        `;
    });
}

// ======================
// AGREGAR AL CARRITO
// ======================

function agregarAlCarrito() {

    const index =
        document.getElementById("producto").value;

    const cantidad =
        parseInt(document.getElementById("cantidad").value);

    let productos =
        JSON.parse(localStorage.getItem("productos")) || [];

    if(index === ""){

        alert("Seleccione un producto");
        return;
    }

    if(!cantidad || cantidad <= 0){

        alert("Ingrese una cantidad válida");
        return;
    }

    let producto = productos[index];

    if(producto.stock < cantidad){

        alert("Stock insuficiente");
        return;
    }

    let itemExistente =
        carrito.find(item => item.index == index);

    if(itemExistente){

        if(
            itemExistente.cantidad + cantidad >
            producto.stock
        ){
            alert("Stock insuficiente");
            return;
        }

        itemExistente.cantidad += cantidad;
        itemExistente.subtotal =
            itemExistente.precio *
            itemExistente.cantidad;
    }
    else{

        carrito.push({

            index: index,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad,
            subtotal: producto.precio * cantidad

        });
    }

    mostrarCarrito();

    document.getElementById("cantidad").value = "";
}

// ======================
// MOSTRAR CARRITO
// ======================

function mostrarCarrito() {

    const tabla =
        document.getElementById("carritoTabla");

    tabla.innerHTML = "";

    total = 0;

    carrito.forEach((item, i) => {

        total += item.subtotal;

        tabla.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>$${item.precio}</td>
                <td>${item.cantidad}</td>
                <td>$${item.subtotal}</td>
                <td>
                    <button
                    type="button"
                    onclick="eliminarItem(${i})">
                        X
                    </button>
                </td>
            </tr>
        `;
    });

    actualizarTotal();
}

// ======================
// ELIMINAR ITEM
// ======================

function eliminarItem(index){

    carrito.splice(index, 1);

    mostrarCarrito();
}

// ======================
// TOTAL CON DESCUENTO
// ======================

function actualizarTotal(){

    let descuento =
        parseFloat(
            document.getElementById("descuento").value
        ) || 0;

    let totalFinal =
        total - (total * descuento / 100);

    document.getElementById("total")
        .textContent =
        totalFinal.toFixed(2);
}

// ======================
// ESCUCHAR DESCUENTO
// ======================

document.addEventListener("input", (e) => {

    if(e.target.id === "descuento"){

        actualizarTotal();
    }
});

// ======================
// FINALIZAR VENTA
// ======================

function finalizarVenta(){

    if(carrito.length === 0){

        alert("El carrito está vacío");
        return;
    }

    let productos =
        JSON.parse(localStorage.getItem("productos")) || [];

    let ventas =
        JSON.parse(localStorage.getItem("ventas")) || [];

    let movimientos =
        JSON.parse(localStorage.getItem("movimientos")) || [];

    let descuento =
        parseFloat(
            document.getElementById("descuento").value
        ) || 0;

    let metodoPago =
        document.getElementById("metodoPago").value;

    let totalFinal =
        parseFloat(
            document.getElementById("total").textContent
        );

    // DESCONTAR STOCK
    carrito.forEach(item => {

        productos[item.index].stock -= item.cantidad;

        movimientos.push({

            fecha: new Date().toLocaleString(),

            producto:
                productos[item.index].nombre,

            tipo: "salida",

            cantidad: item.cantidad,

            motivo: "Venta"

        });
    });

    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );

    localStorage.setItem(
        "movimientos",
        JSON.stringify(movimientos)
    );

    let venta = {

        fecha: new Date().toLocaleString(),

        productos: carrito,

        descuento: descuento,

        metodoPago: metodoPago,

        total: totalFinal

    };

    ventas.push(venta);

    localStorage.setItem(
        "ventas",
        JSON.stringify(ventas)
    );

    alert("Venta registrada correctamente");

    carrito = [];
    total = 0;

    document.getElementById("carritoTabla").innerHTML = "";

    document.getElementById("total").textContent = "0";

    document.getElementById("descuento").value = "0";

    cargarProductos();
}