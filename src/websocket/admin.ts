import { io } from '../http';
import { ConnectionService } from '../services/ConnectionsService';
import { MessagesService } from '../services/MessagesService';

io.on('connect', async (socket) => {
    const connectionService = new ConnectionService()
    const messagesService = new MessagesService();
    const allConnectionsWithoutAdmin = await connectionService.findAllWithoutAdmin();
    io.emit('admin_list_all_users', allConnectionsWithoutAdmin);

    socket.on('admin_list_messages_by_user', async (params, callback) => {
        const { user_id } = params;
        const allMessagesFromGivenUser = await messagesService.listByUser(user_id);
        callback(allMessagesFromGivenUser);
    })

    socket.on('admin_send_message', async params => {
        const { user_id, text } = params;

        console.log('aaaa');
        await messagesService.create({
            text,
            user_id,
            admin_id: socket.id,
        });

        let connection = await connectionService.findByUserId(user_id);

        connection.admin_id = socket.id;

        connection = await connectionService.create(connection);

        io.to(connection.socket_id).emit('admin_send_to_client', {
            text,
            socket_id: socket.id
        });

    })

})
