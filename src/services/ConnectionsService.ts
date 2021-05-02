import { ConnectionsRepository } from "../repositories/ConnectionsRepository"
import { getCustomRepository, Repository } from 'typeorm';
import { Connection } from "../entities/Connection";

interface IConnectionCreate {
    id?: string,
    admin_id?: string;
    user_id: string;
    socket_id: string;
}

class ConnectionService {

    private connectionRepository: Repository<Connection>;

    constructor() {
        this.connectionRepository = getCustomRepository(ConnectionsRepository);
    }

    create = async ({ id, admin_id, user_id, socket_id }: IConnectionCreate) => {

        const connection = this.connectionRepository.create({ id, admin_id, user_id, socket_id });
        await this.connectionRepository.save(connection);
        return connection;
    }

    findByUserId = async (user_id: string) => {
        const connection = await this.connectionRepository.findOne({ user_id });
        return connection;
    }


    findAllWithoutAdmin = async () => {
        const connection = await this.connectionRepository.find(
            { where:
                { admin_id: null },
                relations: ['user']
            });
        return connection;
    }
}

export { ConnectionService }