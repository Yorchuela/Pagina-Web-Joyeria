document.addEventListener(

    "DOMContentLoaded",

    mostrarCarrito

);

function mostrarCarrito() {

    const contenedor =

        document.getElementById(
            'contenedorCarrito'
        );

    const totalHTML =

        document.getElementById(
            'total'
        );
    const carrito =

        JSON.parse(
            localStorage.getItem("carrito")
        ) || [];

    /* BACKUP */

    localStorage.setItem(

        "carritoBackup",

        JSON.stringify(carrito)

    );

    contenedor.innerHTML = "";

    let total = 0;

    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <h2>

                Carrito vacío

            </h2>

        `;

        totalHTML.textContent =
            '$0';

        return;

    }

    carrito.forEach((p, index) => {

        const subtotal =

            p.precio * p.cantidad;

        total += subtotal;

        contenedor.innerHTML += `

        <div class="producto">

            <img
                src="${p.ruta_imagen

                ?

                'http://localhost:3000' +
                p.ruta_imagen

                :

                'https://via.placeholder.com/150'
            }"

                class="img-producto"
            >

            <div class="info">

                <h3>

                    ${p.nombre_producto}

                </h3>

                <p>

                    ${p.descripcion || ''}

                </p>

                <p>

                    <strong>
                        Kilataje:
                    </strong>

                    ${parseInt(p.kilataje) || 'N/A'}K

                </p>

                <p>

                    <strong>
                        Serie:
                    </strong>

                    ${p.serie}

                </p>

                <p>

                    <strong>
                        Certificado:
                    </strong>

                    ${p.certificado_autenticidad || 'N/A'}

                </p>

                <p class="precio">

                    Precio: $${Number(p.precio).toLocaleString()}

                </p>

            </div>

            <div class="acciones">

    <div class="cantidad">

        <span>

            Cantidad:

        </span>

        <strong>

            ${p.cantidad}

        </strong>

    </div>

    <p class="subtotal">

        Total: $${Number(subtotal).toLocaleString()}

    </p>

    <button
        class="btn-eliminar"
        onclick="eliminarProducto(${index})"
    >  🗑 Eliminar

    </button>

</div>
        </div>

        `;

    });

    totalHTML.textContent =

        '$' +

        Number(total).toLocaleString(
            'es-MX'
        );

}

/* ========================= */
/* ELIMINAR */
/* ========================= */

function eliminarProducto(index) {

    const confirmar =

        confirm(
            '¿Seguro que deseas eliminar este producto del carrito?'
        );

    if (!confirmar) {

        return;

    }

    let carrito =

        JSON.parse(
            localStorage.getItem('carrito')
        ) || [];

    carrito.splice(index, 1);

    localStorage.setItem(

        'carrito',

        JSON.stringify(carrito)

    );

    mostrarCarrito();

}

/* ========================= */
/* VOLVER */
/* ========================= */

function volverCatalogo() {

    window.location.href =
        'catalogo.html';

}


/* ABRIR MODAL */

function comprar() {

    const carrito =

        JSON.parse(
            localStorage.getItem("carrito")
        ) || [];

    if (carrito.length === 0) {

        alert(
            "Tu carrito está vacío"
        );

        return;
    }

    document.getElementById(

        "modalPago"

    ).classList.add(

        "active"

    );

}

/* CERRAR MODAL */

function cerrarModalPago() {

    document.getElementById(

        "modalPago"

    ).classList.remove(

        "active"

    );

}

/* PROCESAR PAGO */

async function procesarPago() {

    const usuario =
        JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {

        alert("Debes iniciar sesión para comprar");

        window.location.href =
            "../pages/login.html";

        return;
    }

    const titular =

        document.getElementById(
            "titular"
        ).value.trim();

    const tarjeta =

        document.getElementById(
            "tarjeta"
        ).value.trim();

    const cvv =

        document.getElementById(
            "cvv"
        ).value.trim();

    const vencimiento =

        document.getElementById(
            "vencimiento"
        ).value.trim();

    /* VALIDACIONES */

    if (

        !titular ||
        !tarjeta ||
        !cvv ||
        !vencimiento

    ) {

        alert(
            "Complete todos los campos"
        );

        return;
    }

    /* TARJETA */

    if (!/^\d{16}$/.test(tarjeta)) {

        alert(
            "La tarjeta debe tener 16 dígitos"
        );

        return;
    }

    /* CVV */

    if (!/^\d{3}$/.test(cvv)) {

        alert(
            "CVV inválido"
        );

        return;
    }

    /* FECHA */

    if (!/^\d{2}\/\d{2}$/.test(vencimiento)) {

        alert(
            "Fecha inválida"
        );

        return;
    }

    /* PROCESANDO */

    alert(
        "Procesando pago..."
    );

    const carrito =

        JSON.parse(
            localStorage.getItem("carrito")
        ) || [];

    

    const total = carrito.reduce(

        (acc, p) =>

            acc + Number(p.precio),

        0

    );

    try {

        const response =

            await fetch(

                'http://localhost:3000/ventas',

                {

                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({

                        id_cliente:
                            usuario.id_usuario,

                        id_usuario:
                            usuario.id_usuario,

                        carrito,

                        metodo_pago:
                            "Tarjeta",

                        subtotal: total,

                        descuento: 0,

                        total

                    })

                }

            );

        const data =

            await response.json();


        if (!response.ok) {

            alert(

                data.message ||

                "Error al procesar compra"

            );

            return;
        }

        if (!data.success) {

            alert(data.message);

            return;
        }

        /* LIMPIAR */

        localStorage.removeItem(
            "carrito"
        );

        cerrarModalPago();

        mostrarTicket(total);

    }

    catch (error) {

        console.log(error);

        alert(
            "Error servidor"
        );

    }

}

/* CERRAR */

function cerrarTicket() {

    window.location.href =

        "./catalogo.html";

}
/* EXPORTAR PDF */

function exportarTicketPDF() {

    const { jsPDF } =
        window.jspdf;

    const doc =
        new jsPDF();

    /* TITULO */

    doc.setFontSize(22);

    doc.text(

        "YORCH JEWELRY",

        14,

        20

    );

    /* SUB */

    doc.setFontSize(14);

    doc.text(

        "Ticket de Compra",

        14,

        32

    );

    /* INFO */

    doc.setFontSize(11);

    doc.text(

        document.getElementById(
            "folioCompra"
        ).textContent,

        14,

        45

    );

    doc.text(

        document.getElementById(
            "fechaCompra"
        ).textContent,

        14,

        55

    );

    doc.text(

        document.getElementById(
            "totalCompra"
        ).textContent,

        14,

        65

    );

    /* PRODUCTOS */

    const carrito =

        JSON.parse(
            localStorage.getItem("carritoBackup")
        ) || [];

    const filas = [];

    carrito.forEach(p => {

        filas.push([

            p.id_producto,

            p.nombre_producto,

            `$${Number(
                p.precio
            ).toLocaleString()
            } `

        ]);

    });

    doc.autoTable({

        startY: 80,

        head: [[
            "ID",
            "Producto",
            "Precio"
        ]],

        body: filas,

        headStyles: {

            fillColor: [99, 102, 241]

        }

    });

    doc.save(

        "ticket_compra.pdf"

    );

}

/* MOSTRAR TICKET */

function mostrarTicket(total) {

    const modal =

        document.getElementById(
            "modalTicket"
        );

    const fecha =

        new Date().toLocaleString(
            'es-MX'
        );

    const folio =

        Math.floor(
            100000 + Math.random() * 900000
        );

    document.getElementById(
        "folioCompra"
    ).textContent =

        `Folio: #${folio}`;

    document.getElementById(
        "fechaCompra"
    ).textContent =

        `Fecha: ${fecha}`;

    document.getElementById(
        "totalCompra"
    ).textContent =

        `Total pagado: $${Number(total).toLocaleString('es-MX')}`;

    modal.classList.add(
        "active"
    );

}


/* CERRAR TICKET */

function cerrarTicket() {

    document.getElementById(
        "modalTicket"
    ).classList.remove(
        "active"
    );

    window.location.href =
        "../index.html";

}

