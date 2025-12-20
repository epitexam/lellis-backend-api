import { CreateUserDTO } from "../../../domain/user/dtos/CreateUserDTO";
import { User } from "../../../domain/user/entity/User";
import { Email } from "../../../domain/user/valueObjects/Email";
import { Password } from "../../../domain/user/valueObjects/Password";
import { IPasswordHasher } from "../../providers/IPasswordHasher";
import { IUserRepository } from "../../repositories/user/IUserRepository";
import { UserError, UserErrorType } from "../../../domain/user/enums/UserErrorType";
import { IIdProvider } from "../../providers/IIdProvider";
import { UserId } from "../../../domain/user/valueObjects/UserId";

export class CreateUserUseCase {
    /**
     * @param {IUserRepository} userRepository - Persistence abstraction
     * @param {IPasswordHasher} passwordHasher - Password hashing abstraction
     * @param {IIdProvider} idProvider - ID generation abstraction (not hardcoded)
     */
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly idProvider: IIdProvider,
    ) { }

    /**
     * Executes the user creation process.
     *
     * @param {CreateUserDTO} input - Data transfer object containing user creation data
     * @returns {Promise<User>} The created user entity (with hashed password)
     * @throws {UserError} if email is already used or validation fails
     */
    async execute(input: CreateUserDTO): Promise<User> {
        const email = Email.create(input.email);
        const password = await Password.create(input.password, this.passwordHasher);

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new UserError(UserErrorType.EMAIL_ALREADY_USED);
        }

        const user = User.create({
            id: UserId.create(this.idProvider.generate()),
            email,
            password,
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
        });

        await this.userRepository.save(user);

        return user;
    }
}