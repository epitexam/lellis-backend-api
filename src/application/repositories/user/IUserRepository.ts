import { CreateUserDTO } from "../../../domain/user/dtos/CreateUserDTO";
import { User } from "../../../domain/user/entity/User";
import { Email } from "../../../domain/user/valueObjects/Email";
import { UserId } from "../../../domain/user/valueObjects/UserId";

/**
 * Interface for User repository operations following Repository pattern
 * @interface
 */
export interface IUserRepository {
    /**
     * Creates a new user entity
     * @param {CreateUserDTO} userData - Data for creating a new user
     * @returns {Promise<User>} The created user entity
     */
    create(userData: CreateUserDTO): Promise<User>;

    /**
     * Finds a user by ID
     * @param {UserId} id - User ID
     * @returns {Promise<User | null>} The user or null if not found
     */
    findById(id: UserId): Promise<User | null>;

    /**
     * Finds a user by email address
     * @param {Email} email - Email address
     * @returns {Promise<User | null>} The user or null if not found
     */
    findByEmail(email: Email): Promise<User | null>;

    /**
     * Saves a user entity (can be used for both create and update)
     * @param {User} user - User entity to save
     * @returns {Promise<User>} The saved user
     */
    save(user: User): Promise<User>;

    /**
     * Updates a user entity
     * @param {User} user - User entity to update
     * @returns {Promise<User>} The updated user
     */
    update(user: User): Promise<User>;

    /**
     * Deletes a user by ID
     * @param {UserId} id - User ID
     * @returns {Promise<void>}
     */
    delete(id: UserId): Promise<void>;

    /**
     * Checks if a user with the given email already exists
     * @param {Email} email - Email to check
     * @returns {Promise<boolean>} True if a user with this email exists
     */
    existsByEmail(email: Email): Promise<boolean>;
}