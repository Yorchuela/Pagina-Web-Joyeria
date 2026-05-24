const productos = [

    {
        id: 1,
        nombre: "Anillo Oro",
        categoria: "Anillos",
        precio: 2500,
        stock: 10
    },

    {
        id: 2,
        nombre: "Collar Plata",
        categoria: "Collares",
        precio: 1800,
        stock: 3
    }

];

mostrarInventario();

function mostrarInventario(){

    let tabla = document.getElementById("tablaInventario");

    tabla.innerHTML = "";

    productos.forEach(producto => {

        let estado = producto.stock <= 5
            ? "⚠ Bajo"
            : "✅ Disponible";

        tabla.innerHTML += `

        <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>$${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>${estado}</td>
        </tr>

        `;
    });
}