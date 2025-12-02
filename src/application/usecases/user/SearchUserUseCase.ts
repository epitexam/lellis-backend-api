import { UserListResponseDTO } from "../../../domain/user/dtos/UserListResponseDTO";
import { UserQueryDTO } from "../../../domain/user/dtos/UserQueryDTO";
import { IUserRepository } from "../../repositories/user/IUserRepository";

/**
 * Use case for searching and listing users with pagination and filtering.
 * Exposes only non-sensitive data.
 *
 * Follows Clean Architecture:
 * - Input: DTO (from controller)
 * - Output: DTO (to controller)
 * - Depends only on repository abstraction
 */
export class SearchUsersUseCase {
    /**
     * @param {IUserRepository} userRepository - User persistence abstraction
     */
    constructor(private readonly userRepository: IUserRepository) { }

    /**
     * Executes a search for users based on query parameters.
     *
     * @param {UserQueryDTO} query - Search, filter, sort and pagination criteria
     * @returns {Promise<UserListResponseDTO>} Paginated list of public user profiles
     *
     * @example
     * const result = await searchUsersUseCase.execute(
     *   new UserQueryDTO(1, 20, "john", UserStatus.ACTIVE, "lastName", "asc")
     * );
     */
    async execute(query: UserQueryDTO): Promise<UserListResponseDTO> {
        const { users, total } = await this.userRepository.search({
            search: query.search,
            status: query.status,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            offset: query.getOffset(),
            limit: query.limit,
        });

        return UserListResponseDTO.fromUsers(users, total, query.page, query.limit);
    }
}