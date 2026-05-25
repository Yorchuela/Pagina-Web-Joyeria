document.addEventListener(
    "DOMContentLoaded",
    cargarDashboard
);

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