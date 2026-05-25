document.addEventListener("DOMContentLoaded", () => {

    cargarVentas();

    mostrarDevoluciones();

});

/* CARGAR VENTAS */

async function cargarVentas(){

    try{

        const response =
            await fetch('http://localhost:3000/ventas');

        const ventas =
            await response.json();

        const select =
            document.getElementById("ventaSelect");

        select.innerHTML =
            `<option value="">Selecciona venta</option>`;

        ventas.forEach(v => {

            select.innerHTML += `

                <option value="${v.id_venta}">

                    Venta #${v.id_venta}
                    - $${v.total}

                </option>

            `;

        });

    } catch(error){

        console.log(error);

    }

}

/* CAMBIO VENTA */

document.getElementById("ventaSelect")
.addEventListener("change", cargarProductosVenta);

/* PRODUCTOS VENTA */

async function cargarProductosVenta(){

    const id_venta =
        document.getElementById("ventaSelect").value;

    if(!id_venta) return;

    try{

        const response =
            await fetch(

                `http://localhost:3000/ventas/${id_venta}/productos`

            );

        const productos =
            await response.json();

        const select =
            document.getElementById("productoDevolucion");

        select.innerHTML = "";

        productos.forEach(p => {

            select.innerHTML += `

                <option value="${p.id_producto}">

                    ${p.nombre_producto}

                </option>

            `;

        });

    } catch(error){

        console.log(error);

    }

}

/* REALIZAR DEVOLUCION */

async function realizarDevolucion(){

    const id_venta =
        document.getElementById("ventaSelect").value;

    const id_producto =
        document.getElementById("productoDevolucion").value;

    const motivo =
        document.getElementById("motivo").value;

    if(!id_venta || !id_producto){

        alert("Selecciona venta y producto");

        return;

    }

    try{

        const response =
            await fetch(

                'http://localhost:3000/devoluciones',

                {

                    method:'POST',

                    headers:{
                        'Content-Type':'application/json'
                    },

                    body: JSON.stringify({

                        id_venta,
                        id_producto,
                        id_usuario:
                            localStorage.getItem("id_usuario"),

                        motivo

                    })

                }

            );

        const data =
            await response.json();

        if(data.success){

            alert("Devolución realizada");

            mostrarDevoluciones();

        }

    } catch(error){

        console.log(error);

    }

}

/* MOSTRAR DEVOLUCIONES */

async function mostrarDevoluciones(){

    try{

        const response =
            await fetch(
                'http://localhost:3000/devoluciones'
            );

        const devoluciones =
            await response.json();

        const tabla =
            document.getElementById("tablaDevoluciones");

        tabla.innerHTML = "";

        devoluciones.forEach(d => {

            tabla.innerHTML += `

                <tr>

                    <td>
                        ${d.id_venta}
                    </td>

                    <td>
                        ${d.nombre_producto}
                    </td>

                    <td>
                        ${d.nombre}
                    </td>

                    <td>
                        ${d.motivo}
                    </td>

                    <td>
                        ${d.fecha_devolucion}
                    </td>

                </tr>

            `;

        });

    } catch(error){

        console.log(error);

    }

}