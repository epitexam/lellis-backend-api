import { IUserRepository } from "../../repositories/user/IUserRepository";
import { UserError, UserErrorType } from "../../../domain/user/enums/UserErrorType";
import { UserId } from "../../../domain/user/valueObjects/UserId";

/**
 * Use case responsible for deleting a user permanently.
 * Follows Clean Architecture principles:
 * - Depends only on abstractions (IUserRepository)
 * - Contains pure business rules
 * - Returns explicit Result type (no exceptions in happy path)
 */
export class DeleteUserUseCase {
    /**
     * @param {IUserRepository} userRepository - Repository abstraction for user persistence
     */
    constructor(private readonly userRepository: IUserRepository) { }

    /**
     * Deletes a user by its unique identifier.
     *
     * @param {string} userId - The unique identifier of the user to delete
     * @throws {UserNotFoundError} if no user exists with the given id
     * @returns {Promise<void>} Resolves when the user is successfully deleted
     */
    async execute(userId: string): Promise<void> {

        const id = UserId.create(userId)
        const exists = await this.userRepository.findById(id);
        if (!exists) {
            throw new UserError(UserErrorType.USER_NOT_FOUND);
        }

        await this.userRepository.delete(id);
    }
}