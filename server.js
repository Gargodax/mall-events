const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


// Servir archivos estáticos desde la carpeta "public"

app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Configuración de socket.io
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    // Manejar evento de nuevo mensaje desde cliente 
    socket.on('mensaje', (alerta) => {
        console.log('Mensaje recibido:', alerta);
        // Enviar mensaje a todo los clientes conectados
        io.emit('mensaje', alerta);
    });

    socket.on('alerta-reconocida', (data) => {
       // console.log('Alerta reconocida', data);

        // Se agrega tiempo de procesamiento
        setTimeout(() => {
            socket.to(data.id).emit('alerta-reconocida', data);
            io.emit('actualizar-alerta', data)
        }, 200);
        
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor escuchando el puerto ${PORT}`);
});
