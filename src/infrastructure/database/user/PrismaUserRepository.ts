import { IUserRepository } from "../../../application/repositories/user/IUserRepository";
import { CreateUserDTO } from "../../../domain/user/dtos/CreateUserDTO";
import { User } from "../../../domain/user/entity/User";
import { UserStatus } from "../../../domain/user/enums/UserStatus";
import { Email } from "../../../domain/user/valueObjects/Email";
import { UserId } from "../../../domain/user/valueObjects/UserId";

export class PrismaUserRepository implements IUserRepository {
    async create(userData: CreateUserDTO): Promise<User> {
        throw new Error("Method not implemented yet");
    }

    async findById(id: UserId): Promise<User | null> {
        throw new Error("Method not implemented yet");
    }

    async findByEmail(email: Email): Promise<User | null> {
        throw new Error("Method not implemented yet");
    }

    async save(user: User): Promise<User> {
        throw new Error("Method not implemented yet");
    }

    async update(user: User): Promise<User> {
        throw new Error("Method not implemented yet");
    }

    async search(query: { search?: string; status?: UserStatus; sortBy: string; sortOrder: "asc" | "desc"; offset: number; limit: number; }): Promise<{ users: User[]; total: number; }> {
        throw new Error("Method not implemented yet");
    }

    delete(id: UserId): Promise<void> {
        throw new Error("Method not implemented yet");
    }

    existsByEmail(email: Email): Promise<boolean> {
        throw new Error("Method not implemented yet");
    }
}