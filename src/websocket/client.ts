import { io } from '../http';
import { ConnectionService } from '../services/ConnectionsService';
import { Connection } from '../entities/Connection';
import { UserService } from '../services/UserService';
import { MessagesService } from '../services/MessagesService';

interface IParams {
    text: string,
    email:string,
}

io.on("connect", (socket) => {
    const connectionsService = new ConnectionService();
    const userService = new UserService();
    const messagesService = new MessagesService();

    socket.on("client_first_access", async (params) => {
        const socket_id = socket.id;
        const { text, email } = params as IParams;

        const user = await userService.create(email);

         await messagesService.create({
            text, user_id: user.id
        })

        const existingConnection = await connectionsService.findByUserId(user.id);

        if (existingConnection) {
            existingConnection.socket_id = socket_id;
            await connectionsService.create(existingConnection);
        } else {
              await connectionsService.create({
            socket_id,
            user_id: user.id,
        });
        }

        const allMessages = await messagesService.listByUser(user.id);

        socket.emit('client_list_all_messages', allMessages);

        const allUsers = await connectionsService.findAllWithoutAdmin();

        io.emit('admin_list_all_users', allUsers);

    });

    socket.on('client_send_to_admin', async params => {
        const { text, socket_admin_id } = params;
        const connection: Connection = await connectionsService.findBySocketId(socket_admin_id);
        const message = await messagesService.create({ text, user_id: connection.user_id });

        const socket_id = socket.id;

        connection.socket_id = socket_id;

        await connectionsService.create(connection);

        io.to(socket_admin_id).emit('admin_receive_message', {
            message,
            socket_id,
            connection
        })
    });

});