import { HttpStatusCodes } from "../../../application/interfaces/HttpStatusCodes";
import { DomainError, IDomainError } from "../../../application/interfaces/IDomainError";

/**
 * Token-specific error types.
 */
export enum TokenErrorType {
    INVALID_PARAMETERS = "Invalid parameters provided for RefreshToken creation."

}

/**
 * Map each TokenErrorType to an HTTP status code.
 */
export const TokenErrorHttpStatus: Record<TokenErrorType, number> = {
    [TokenErrorType.INVALID_PARAMETERS]: HttpStatusCodes.BAD_REQUEST,
};

/**
 * Token-specific domain error class.
 */
export class TokenError extends DomainError<TokenErrorType> implements IDomainError<TokenErrorType> {
    constructor(type: TokenErrorType) {
        super(type, TokenErrorHttpStatus);
    }
}
