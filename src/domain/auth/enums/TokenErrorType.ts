import { HttpStatusCodes } from "../../../application/interfaces/HttpStatusCodes";
import { DomainError, IDomainError } from "../../../application/interfaces/IDomainError";

/**
 * Token-specific error types.
 */
export enum TokenErrorType {
    INVALID_PARAMETERS = "Invalid parameters provided for RefreshToken creation.",
    INVALID_PAYLOAD = "Invalid payload",
    INVALID_OR_EXPIRED_TOKEN = "The token provided is either invalid or expired",
    EXPIRED_TOKEN = "The token provided as expired.",
    REFRESH_TOKEN_NOT_FOUND = "Refresh token not found in the database."
}

/**
 * Map each TokenErrorType to an HTTP status code.
 */
export const TokenErrorHttpStatus: Record<TokenErrorType, number> = {
    [TokenErrorType.INVALID_PARAMETERS]: HttpStatusCodes.BAD_REQUEST,
    [TokenErrorType.INVALID_PAYLOAD]: HttpStatusCodes.BAD_REQUEST,
    [TokenErrorType.INVALID_OR_EXPIRED_TOKEN]: HttpStatusCodes.UNAUTHORIZED,
    [TokenErrorType.EXPIRED_TOKEN]: HttpStatusCodes.UNAUTHORIZED,
    [TokenErrorType.REFRESH_TOKEN_NOT_FOUND]: HttpStatusCodes.NOT_FOUND
};

/**
 * Token-specific domain error class.
 */
export class TokenError extends DomainError<TokenErrorType> implements IDomainError<TokenErrorType> {
    constructor(type: TokenErrorType) {
        super(type, TokenErrorHttpStatus);
    }
}
