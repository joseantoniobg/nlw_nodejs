import { getCustomRepository, Repository } from "typeorm";
import { SettingsRepository } from '../repositories/SettingsRepository';
import { Setting } from '../entities/Setting';

interface ISettingsCreate {
    chat: boolean;
    username: string;
}

class SettingsService {

    private settingsRepository: Repository<Setting>;

    constructor() {
        this.settingsRepository = getCustomRepository(SettingsRepository);
    }

    async create({ chat, username }: ISettingsCreate) {

        const userAlreadyExists = await this.settingsRepository.findOne({ username });

        if (userAlreadyExists) {
            throw new Error("User Already Exists!");
        }

        const settings = this.settingsRepository.create({
            chat,
            username,
        })

        await this.settingsRepository.save(settings);

        return settings;

    }

    findByUsername = async (username: string) => {
        const settings = await this.settingsRepository.findOne({ username });
        return settings;
    }

    update = async (username: string, chat: boolean) => {
        const settings = await this.settingsRepository.
                                    createQueryBuilder().
                                    update(Setting).
                                    set({ chat }).
                                    where(
                                        "username= :username",
                                        { username }
                                    ).
                                    execute();
    }
}

export { SettingsService }