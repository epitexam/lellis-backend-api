import { CreateUserDTO } from "../../../domain/user/dtos/CreateUserDTO";
import { User } from "../../../domain/user/entity/User";
import { UserError, UserErrorType } from "../../../domain/user/enums/UserErrorType";
import { Email } from "../../../domain/user/valueObjects/Email";
import { Password } from "../../../domain/user/valueObjects/Password";
import { IPasswordHasher } from "../../providers/IPasswordHasher";
import { IUserRepository } from "../../repositories/user/IUserRepository";

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher,
    ) { }

    async execute(input: CreateUserDTO): Promise<User> {
        const email = Email.create(input.email);

        const existing = await this.userRepository.findByEmail(email);

        if (!existing) throw new UserError(UserErrorType.EMAIL_ALREADY_USED);

        const password = await Password.create(input.password, this.passwordHasher);

        const user = User.create({
            id: Bun.randomUUIDv7(),
            email: Email.create(input.email),
            password,
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
        });

        await this.userRepository.save(user);

        return user
    }
}