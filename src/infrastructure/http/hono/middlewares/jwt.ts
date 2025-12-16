import { Context, MiddlewareHandler } from 'hono';
import { IJwtService } from '../../../../domain/auth/security/IJwtService';
import { HttpStatusCodes } from '../../../../application/interfaces/HttpStatusCodes';
import { UserId } from '../../../../domain/user/valueObjects/UserId';

export const USER_ID_CONTEXT_KEY = 'userId';

/**
 * @class AuthMiddleware
 * @description Adapter class to create Hono middleware, responsible 
 * verification of the Access Token via the JWT Infrastructure service.
 */
export class AuthMiddleware {

    private readonly jwtService: IJwtService;

    /**
     * @constructor
     * @param {IJwtService} jwtService
     */
    constructor(jwtService: IJwtService) {
        this.jwtService = jwtService;
    }

    /**
     * @public
     * @returns {MiddlewareHandler} Returns the Hono middleware handler.
     * @description This method is called during assembly to create the Hono "barrier guard".
     */
    public createMiddleware(): MiddlewareHandler {
        return async (c: Context, next) => {
            try {
                const authHeader = c.req.header('Authorization');

                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return c.json({ message: 'Authorization header required (Bearer token).' }, HttpStatusCodes.UNAUTHORIZED);
                }

                const token = authHeader.replace('Bearer ', '');
                const payload = await this.jwtService.verifyAccessToken(token);
                const userId = UserId.create(payload.userId);

                c.set(USER_ID_CONTEXT_KEY, userId);

                await next();

            } catch (error) {
                return c.json({ message: 'Invalid or expired access token.' }, HttpStatusCodes.UNAUTHORIZED);
            }
        };
    }
}