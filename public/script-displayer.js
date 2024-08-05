document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const alertsList = document.getElementById('alerts-list');

    // Manejar evento de mensaje recibido desde el servidor
    socket.on('mensaje', (alerta) => {

        const li = document.createElement('li');
        li.setAttribute('id', alerta.clienteID);
        li.setAttribute('name', 'alert');

        const textContainer = document.createElement('div');
        textContainer.setAttribute('class', 'text-container');

        const dateContainer = document.createElement('div');
        dateContainer.setAttribute('class', 'date-container');

        const dataContainer = document.createElement('div');
        dataContainer.setAttribute('class', 'data-container');

        const serviceContainer = document.createElement('div');
        serviceContainer.setAttribute('class', 'service-container');

        const h3 = document.createElement('h3');
        h3.setAttribute('name', 'name');

        const p_unit = document.createElement('p');
        p_unit.setAttribute('name', 'unit');

        const p_service = document.createElement('p');
        p_service.setAttribute('name', 'service');

        const textoHora = document.createElement('p');
        textoHora.setAttribute('class', 'reloj');

        const textoFecha = document.createElement('p');
        textoFecha.setAttribute('class', 'fecha');


        h3.textContent = alerta.nombre;
        p_unit.textContent = alerta.unidad;
        p_service.textContent = alerta.solicitud;
        textoHora.textContent = alerta.horario;
        textoFecha.textContent = alerta.dia;


        dataContainer.append(p_unit, h3);

        serviceContainer.append(p_service);

        textContainer.append(dataContainer, serviceContainer);

        dateContainer.append(textoFecha, textoHora);

        li.append(textContainer, dateContainer);

        switch (p_service.textContent) {
            case "Emergencias":
                li.classList.add('emergencias', 'blink');
                break;

            case "Seguridad":
                li.classList.add('seguridad', 'blink');
                break;

            case "Bomberos":
                li.classList.add('bomberos', 'blink');
                break;
            default:
                console.log('Servicio no especificado');
        };

        alertsList.prepend(li);

        // Manejar evento de click en alerta
        li.addEventListener('click', () => {
            let now = new Date();
            let hora = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
            let minutos = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
            let segundos = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
            let reloj = hora + ":" + minutos + ":" + segundos

            socket.emit('alerta-reconocida', data = {
                id: alerta.clienteID,
                ubicacion: alerta.nombre,
                hora: reloj
            });

            li.classList.remove('blink');

        }, { once: true });

    });

    socket.on('actualizar-alerta', (data) => {
        let alertaReconocida = document.getElementById(`${data.id}`);
        alertaReconocida.classList.remove('blink');
    });
});



