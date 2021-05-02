import { io } from '../http';
import { ConnectionService } from '../services/ConnectionsService';
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

    });

});