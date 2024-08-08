// Manejo de parámetros URL

const params = window.location.search // recupero de información de la URL
const URLvalues = new URLSearchParams(params) // se crea nueva instancia de parámetros


// declaración de constantes referenciando elementos del DOM

const nombre = document.getElementById('name');
const unidad = document.getElementById('unit');
const form = document.getElementById('sender');
const buttons = document.querySelectorAll('div.buttons > button.btn');
const servicio = document.getElementsByClassName('service');

const btnEmergency = document.getElementById('emergency');
const btnSecurity = document.getElementById('security');
const btnFire = document.getElementById('fire');

const dialog = document.getElementById('dialog');
const modalContent = document.querySelector('#modal-data>span');
const modalClose = document.getElementById('modal-close');
const chatViewer = document.getElementById('chat-messages');
const textModalChat = document.getElementById('modal-text-msg');
const btnModalChat = document.getElementById('modal-send-msg');



// Los parámetros tomados del URL se insertan en los inputs

function insertURLData() {
    const name = URLvalues.get('name'); // acceso al valor de "name"
    const unit = URLvalues.get('unit'); // acceso al valor de "unit"
    nombre.value = name;
    unidad.value = unit;
};


document.addEventListener('DOMContentLoaded', () => {
    const socket = io();



    insertURLData();

    for (clickedButton of buttons) {
        clickedButton.addEventListener('click', function (e) {
            e.preventDefault();

            let now = new Date();
            let hora = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
            let minutos = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
            let segundos = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
            let reloj = hora + ":" + minutos + ":" + segundos

            let fecha = now.toLocaleDateString();

            let clicked = e.target.textContent.trim();

            // Enviar información al servidor
            let alerta = {
                clienteID: socket.id,
                nombre: nombre.value,
                unidad: unidad.value,
                solicitud: clicked,
                horario: reloj,
                dia: fecha
            }

            socket.emit('mensaje', alerta);

            const modalResponse = document.createElement('li');
            modalResponse.classList.add('waiting');


            modalResponse.innerHTML = 'Aguardando respuesta  <div class="loader"></div>';

            dialog.showModal();

            // Enviar información al modal informativo

            const dataList = document.createElement('ul');
            const infoName = document.createElement('li');
            const infoUnit = document.createElement('li');
            const infoService = document.createElement('li');
            const infoTime = document.createElement('li');

            infoName.textContent = "Ubicación: " + alerta.nombre;
            infoUnit.textContent = "Unidad: " + alerta.unidad;
            infoService.textContent = "Servicio: " + alerta.solicitud;
            infoTime.textContent = "Solicitado: " + alerta.horario;

            dataList.append(infoName, infoUnit, infoService, infoTime, modalResponse);

            if (modalContent.hasChildNodes()) {
                modalContent.replaceChild(dataList, modalContent.firstChild);

            } else {
                modalContent.append(dataList);
            };

            // Alerta reconocida
            socket.on('alerta-reconocida', (data) => {
                // Notificación de alert recibida
                modalResponse.classList.replace('waiting', 'received')
                modalResponse.textContent = "Recibido (seguridad): " + data.hora;

                //Mensaje automático al chat

                let managerMessage = document.createElement('li');
                managerMessage.classList.add('manager');
                managerMessage.textContent = "(Seguridad): Recibimos la alerta y estamos en camino. ¿Querés informar algo más?";
                chatViewer.appendChild(managerMessage);
                chatViewer.scrollTop = chatViewer.scrollHeight;


            });

        });

    };

    btnModalChat.addEventListener('click', (e) => {
        e.preventDefault();

        let clientMessage = document.createElement('li');
        clientMessage.classList.add('client');
        clientMessage.textContent = "(" + nombre.value + "): " + textModalChat.value;
        chatViewer.appendChild(clientMessage);
        chatViewer.scrollTop = chatViewer.scrollHeight;
        textModalChat.value = '';

    });


    modalClose.addEventListener('click', () => {

        dialog.setAttribute('close', '');
        dialog.addEventListener('animationend', () => {
            dialog.removeAttribute('close');
            dialog.close();
            location.reload();
        }, { once: true });
    });

});
