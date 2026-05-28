function obtenerFechasFiltro() {

    return {

        fechaInicio:

            document.getElementById(
                "fechaInicio"
            )?.value || null,

        fechaFin:

            document.getElementById(
                "fechaFin"
            )?.value || null

    };

}

function filtrarPorFecha(datos) {

    const {

        fechaInicio,
        fechaFin

    } = obtenerFechasFiltro();

    if (

        !fechaInicio &&
        !fechaFin

    ) {

        return datos;

    }

    return datos.filter(item => {

        if (!item.fecha) {

            return false;

        }

        let fecha =

            new Date(item.fecha)
            .toISOString()
            .split('T')[0];

        return (

            (!fechaInicio || fecha >= fechaInicio)

            &&

            (!fechaFin || fecha <= fechaFin)

        );

    });

}