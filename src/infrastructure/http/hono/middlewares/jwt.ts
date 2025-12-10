import { Context, MiddlewareHandler } from 'hono';
import { IJwtService } from '../../../../domain/auth/security/IJwtService';
import { HttpStatusCodes } from '../../../../application/interfaces/HttpStatusCodes';
import { UserId } from '../../../../domain/user/valueObjects/UserId';

// Clé utilisée dans le contexte Hono pour stocker l'ID utilisateur
export const USER_ID_CONTEXT_KEY = 'userId'; 

/**
 * @class AuthMiddleware
 * @description Classe d'adaptateur pour créer un middleware Hono, responsable 
 * de la vérification du Access Token via le service JWT de l'Infrastructure.
 */
export class AuthMiddleware {
    
    private readonly jwtService: IJwtService;

    /**
     * @constructor
     * @param {IJwtService} jwtService - Le service JWT injecté (implémenté par HonoJwtService).
     */
    constructor(jwtService: IJwtService) {
        this.jwtService = jwtService;
    }

    /**
     * @public
     * @returns {MiddlewareHandler} Retourne le gestionnaire de middleware Hono.
     * @description Cette méthode est appelée lors de l'assemblage pour créer le "garde-barrière" Hono.
     */
    public createMiddleware(): MiddlewareHandler {
        
        return async (c: Context, next) => {
            // 1. Extraction du jeton du header Authorization
            const authHeader = c.req.header('Authorization');

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return c.json({ message: 'Authorization header required (Bearer token).' }, HttpStatusCodes.UNAUTHORIZED);
            }

            const token = authHeader.replace('Bearer ', '');

            try {
                // 2. Vérification du jeton par le service d'Infrastructure
                const payload = await this.jwtService.verifyAccessToken(token);
                
                // 3. Stockage du Value Object UserId dans le contexte Hono
                // Ceci permet aux Use Cases d'accéder à l'identité de l'utilisateur.
                const userId = UserId.create(payload.userId); 
                c.set(USER_ID_CONTEXT_KEY, userId);

                // 4. Continuer la chaîne des gestionnaires
                await next();

            } catch (error) {
                // 5. Gestion des erreurs de vérification (TokenError levée par HonoJwtService)
                console.error("Authentication failed:", error);
                
                // Retourne 401 pour toute erreur de jeton (signature invalide, expiré, etc.)
                return c.json({ message: 'Invalid or expired access token.' }, HttpStatusCodes.UNAUTHORIZED);
            }
        };
    }
}