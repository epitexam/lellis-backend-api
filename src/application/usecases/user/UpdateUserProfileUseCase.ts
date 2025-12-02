import { IUserRepository } from "../../repositories/user/IUserRepository";
import { UserId } from "../../../domain/user/valueObjects/UserId";
import { UserError, UserErrorType } from "../../../domain/user/enums/UserErrorType";
import { UserResponseDTO } from "../../../domain/user/dtos/UserResponseDTO";
import { UpdateUserProfileDTO } from "../../../domain/user/dtos/UpdateUserProfileDTO";

/**
 * Use case for updating a user's profile information.
 * Enforces domain rules:
 * - Email uniqueness
 * - Name validation
 * - Only non-sensitive fields can be updated
 */
export class UpdateUserProfileUseCase {
    /**
     * @param {IUserRepository} userRepository - User persistence abstraction
     */
    constructor(private readonly userRepository: IUserRepository) { }

    /**
     * Updates a user's profile with the provided data.
     *
     * @param {string} rawUserId - The ID of the user to update
     * @param {UpdateUserDTO} input - Partial data to update
     * @returns {Promise<UserResponseDTO>} Updated user (public view)
     *
     * @throws {UserError} USER_NOT_FOUND if user does not exist
     * @throws {UserError} EMAIL_ALREADY_USED if new email is taken by another user
     * @throws {UserError} INVALID_USER_ID if ID is malformed
     */
    async execute(rawUserId: string, input: UpdateUserProfileDTO): Promise<UserResponseDTO> {
        const userId = UserId.create(rawUserId);

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserError(UserErrorType.USER_NOT_FOUND);
        }

        if (input.email && !input.email.equals(user.email)) {
            const existing = await this.userRepository.findByEmail(input.email);
            if (existing && !existing.id.equals(userId)) {
                throw new UserError(UserErrorType.EMAIL_ALREADY_USED);
            }
        }
        user.updateProfile({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
        });

        // Persist
        await this.userRepository.save(user);

        return UserResponseDTO.fromUser(user);
    }
}