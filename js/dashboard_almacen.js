document.addEventListener(
    "DOMContentLoaded",
    cargarDashboardAlmacen
);

async function cargarDashboardAlmacen(){

    try{

        const response =

            await fetch(

                'http://localhost:3000/dashboard-almacen'

            );

        const data =
            await response.json();

        document.getElementById(
            "productosDisponibles"
        ).textContent =

            data.disponibles;

        document.getElementById(
            "entradasHoy"
        ).textContent =

            data.entradas;

        document.getElementById(
            "salidasHoy"
        ).textContent =

            data.salidas;

    } catch(error){

        console.log(error);

    }

}