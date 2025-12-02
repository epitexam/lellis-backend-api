import { UserResponseDTO } from "../../../domain/user/dtos/UserResponseDTO";
import { UserError, UserErrorType } from "../../../domain/user/enums/UserErrorType";
import { UserId } from "../../../domain/user/valueObjects/UserId";
import { IUserRepository } from "../../repositories/user/IUserRepository";

/**
 * Use case responsible for retrieving a single user by its identifier.
 * 
 * Follows Clean Architecture principles:
 * - Depends only on repository abstraction
 * - No knowledge of HTTP, frameworks or delivery mechanisms
 * - Returns a dedicated DTO (never exposes the domain entity directly)
 * - Throws domain errors only
 */
export class GetUserUseCase {
    /**
     * @param {IUserRepository} userRepository - Repository abstraction for user persistence
     */
    constructor(private readonly userRepository: IUserRepository) { }

    /**
     * Retrieves a user by its unique identifier.
     *
     * @param {string} rawId - The raw user identifier (string, typically UUID v7)
     * @returns {Promise<UserResponseDTO>} Public representation of the user (no password hash)
     * 
     * @throws {UserError} with type USER_NOT_FOUND if no user exists with the given identifier
     * @throws {UserError} with type INVALID_USER_ID if the provided identifier is malformed
     * 
     * @example
     * const dto = await getUserUseCase.execute("018f7c3a-...-...");
     */
    async execute(rawId: string): Promise<UserResponseDTO> {
        const userId = UserId.create(rawId);

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new UserError(UserErrorType.USER_NOT_FOUND);
        }

        return UserResponseDTO.fromUser(user);
    }
}