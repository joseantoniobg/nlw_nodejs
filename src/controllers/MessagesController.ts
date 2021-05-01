import { MessagesService } from '../services/MessagesService';
import { Response, Request, response, request } from 'express';

class MessagesController {
    async create(request: Request, response: Response) {
        const { admin_id, text, user_id } = request.body;
        const messagesService = new MessagesService();
        const message = await messagesService.create({ admin_id, text, user_id });
        return response.json(message);
    }

    async listByUser(request: Request, response: Response) {
        const { id } = request.params;
        const messagesService = new MessagesService();
        const messages = await messagesService.listByUser(id);
        return response.json(messages);
    }
}

export { MessagesController }