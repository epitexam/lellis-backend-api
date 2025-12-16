import { HttpStatusCodes } from "../../../application/interfaces/HttpStatusCodes";
import { DomainError, IDomainError } from "../../../application/interfaces/IDomainError";

/**
 * RefreshToken-specific error types.
 */
export enum RefreshTokenErrorType {
    INVALID_PARAMETERS = "Invalid parameters provided for RefreshToken creation."

}

/**
 * Map each RefreshTokenErrorType to an HTTP status code.
 */
export const RefreshTokenErrorHttpStatus: Record<RefreshTokenErrorType, number> = {
    [RefreshTokenErrorType.INVALID_PARAMETERS]: HttpStatusCodes.BAD_REQUEST,
};

/**
 * RefreshToken-specific domain error class.
 */
export class RefreshTokenError extends DomainError<RefreshTokenErrorType> implements IDomainError<RefreshTokenErrorType> {
    constructor(type: RefreshTokenErrorType) {
        super(type, RefreshTokenErrorHttpStatus);
    }
}
