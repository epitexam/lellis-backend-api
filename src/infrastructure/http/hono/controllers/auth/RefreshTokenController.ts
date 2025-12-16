import { Context } from "hono";
import { RefreshAccessTokenUseCase } from "../../../../../application/usecases/auth/RefreshTokenUseCase";
import { RefreshTokenRequestDTO } from "../../../../../domain/auth/dtos/RefreshTokenRequestDTO";
import { HttpStatusCodes } from "../../../../../application/interfaces/HttpStatusCodes";
import { RefreshTokenResponseDTO } from "../../../../../domain/auth/dtos/RefreshTokenResponseDTO";
import { DomainError } from "../../../../../application/interfaces/IDomainError";
import { ContentfulStatusCode } from "hono/utils/http-status";


/**
 * @class RefreshTokenController
 * @description Manages the HTTP endpoint for refreshing tokens, translates
 * HTTP requests to the Application layer (Use Case) and translates errors 
 * back into HTTP responses.
 */
export class RefreshTokenController {

    private readonly refreshUseCase: RefreshAccessTokenUseCase
        ;

    /**
     * @constructor
     * @param {IRefreshAccessTokenUseCase} refreshUseCase - The injected Refresh Token Use Case.
     */
    constructor(refreshUseCase: RefreshAccessTokenUseCase) {
        this.refreshUseCase = refreshUseCase;
    }

    /**
     * @public
     * @async
     * @method routeHandler
     * @param {Context} c - The Hono context object.
     * @description The main Hono route handler function.
     */
    async handle(c: Context) {
        try {
            const input = await c.req.json() as RefreshTokenRequestDTO;

            if (!input.refreshToken || typeof input.refreshToken !== 'string') {
                return c.json({ message: 'Refresh token is required.' }, HttpStatusCodes.BAD_REQUEST);
            }

            const tokens: RefreshTokenResponseDTO = await this.refreshUseCase.execute(input);
            return c.json(tokens, HttpStatusCodes.OK);

        } catch (error: any) {
            if (error instanceof DomainError) {
                return c.json({ message: error.message }, error.statusCode as ContentfulStatusCode)
            }

            return c.json({ message: "Internal server error" }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}