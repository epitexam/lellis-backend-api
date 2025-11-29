/**
 * Data Transfer Object for creating a new user
 * @class
 */
export class CreateUserDTO {
  /**
   * @param {string} email - User's email address
   * @param {string} password - User's plain text password (will be hashed)
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   */
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}
