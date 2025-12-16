import { RefreshTokenRequestDTO } from "../../../domain/auth/dtos/RefreshTokenRequestDTO";
import { RefreshTokenResponseDTO } from "../../../domain/auth/dtos/RefreshTokenResponseDTO";
import { RefreshToken } from "../../../domain/auth/entity/RefreshToken";
import { TokenError, TokenErrorType } from "../../../domain/auth/enums/TokenErrorType";
import { IJwtService } from "../../../domain/auth/security/IJwtService";
import { IIdProvider } from "../../providers/IIdProvider";
import { IAuthRepository } from "../../repositories/auth/IAuthRepository";

/**
 * @class RefreshAccessTokenUseCase
 * @description Orchestrates the process of exchanging a valid Refresh Token for 
 * a new pair of Access and Refresh tokens, implementing token rotation.
 */
export class RefreshAccessTokenUseCase {

    constructor(
        private readonly jwtService: IJwtService,
        private readonly authRepository: IAuthRepository,
        private readonly idProvider: IIdProvider
    ) { }

    /**
     * Exécute la logique de rafraîchissement.
     * @param {RefreshTokenRequestDTO} input - Contient l'ancien Refresh Token.
     * @returns {Promise<RefreshTokenResponseDTO>} La nouvelle paire de jetons.
     */
    async execute(input: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {
        const { refreshToken: oldTokenString } = input;

        const existingTokenEntity = await this.authRepository.findRefreshTokenByString(oldTokenString);

        if (!existingTokenEntity) {
            throw new TokenError(TokenErrorType.REFRESH_TOKEN_NOT_FOUND);
        }

        if (!existingTokenEntity.isValid()) {
            throw new TokenError(TokenErrorType.INVALID_OR_EXPIRED_TOKEN);
        }

        existingTokenEntity.revoke();
        await this.authRepository.updateRefreshToken(existingTokenEntity);

        const userId = existingTokenEntity.userId;
        const issueDate = new Date();

        const newAccessToken = await this.jwtService.generateAccessToken(userId);
        const newRefreshTokenString = await this.jwtService.generateRefreshToken(userId);

        const expirationDate = this.jwtService.getRefreshTokenExpirationDate();

        const newRefreshTokenEntity = RefreshToken.createNew(
            this.idProvider.generateRandomUuid(),
            newRefreshTokenString,
            userId,
            expirationDate,
            issueDate
        );

        await this.authRepository.saveRefreshToken(newRefreshTokenEntity);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshTokenString
        };
    }
}