/**
 * Data Transfer Object for updating user profile
 * @class
 */
export class UpdateUserProfileDTO {
  /**
   * @param {string} [firstName] - Updated first name
   * @param {string} [lastName] - Updated last name
   * @param {string} [email] - Updated email address
   */
  constructor(
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly email?: string
  ) {}
}
