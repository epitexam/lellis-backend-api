import { Email } from "../../../domain/user/valueObjects/Email";

/**
 * Input DTO for updating a user profile.
 * All fields are optional – only provided fields will be updated.
 */
export class UpdateUserProfileDTO {
  public readonly firstName?: string;
  public readonly lastName?: string;
  public readonly email?: Email;

  constructor(data: {
    firstName?: string;
    lastName?: string;
    email?: string; // raw string – will be converted to Email VO
  }) {
    this.firstName = data.firstName?.trim() || undefined;
    this.lastName = data.lastName?.trim() || undefined;

    if (data.email !== undefined) {
      this.email = Email.create(data.email.trim());
    }

    // At least one field must be provided
    if (!this.firstName && !this.lastName && !this.email) {
      throw new Error("At least one field must be provided for update");
    }
  }
}