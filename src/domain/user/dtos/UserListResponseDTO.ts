import { User } from "../entity/User";
import { UserResponseDTO } from "./UserResponseDTO";

/**
 * Data Transfer Object for user list response (paginated)
 * @class
 */
export class UserListResponseDTO {
    /**
     * @param {UserResponseDTO[]} users - List of users
     * @param {number} total - Total number of users
     * @param {number} page - Current page number
     * @param {number} limit - Number of items per page
     * @param {number} totalPages - Total number of pages
     */
    constructor(
        public readonly users: UserResponseDTO[],
        public readonly total: number,
        public readonly page: number,
        public readonly limit: number,
        public readonly totalPages: number
    ) { }

    /**
     * Creates a UserListResponseDTO from user data
     * @static
     * @param {User[]} users - Array of User entities
     * @param {number} total - Total count
     * @param {number} page - Current page
     * @param {number} limit - Page limit
     * @returns {UserListResponseDTO} The paginated response DTO
     */
    public static fromUsers(
        users: User[],
        total: number,
        page: number,
        limit: number
    ): UserListResponseDTO {
        const userDTOs = users.map(user => UserResponseDTO.fromUser(user));
        const totalPages = Math.ceil(total / limit);

        return new UserListResponseDTO(
            userDTOs,
            total,
            page,
            limit,
            totalPages
        );
    }
}