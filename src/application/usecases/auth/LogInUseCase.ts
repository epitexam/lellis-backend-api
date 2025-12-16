import { RefreshToken } from "../../../domain/auth/entity/RefreshToken";
import { IJwtService } from "../../../domain/auth/security/IJwtService";
import { LoginUserDTO } from "../../../domain/user/dtos/LoginUserDTO";
import { UserError, UserErrorType } from "../../../domain/user/enums/UserErrorType";
import { Email } from "../../../domain/user/valueObjects/Email";
import { IIdProvider } from "../../providers/IIdProvider";
import { IPasswordHasher } from "../../providers/IPasswordHasher";
import { IAuthRepository } from "../../repositories/auth/IAuthRepository";
import { IUserRepository } from "../../repositories/user/IUserRepository";

/**
 * @class LogInUseCase
 * @description Handles the full login flow: verifies user credentials,
 * issues a new Access Token and Refresh Token, and persists the refresh token.
 */
export class LogInUseCase {

    /**
     * @constructor
     * @param {IUserRepository} userRepository - Repository for accessing user data.
     * @param {IPasswordHasher} passwordHasher - Service used to verify hashed passwords.
     * @param {IJwtService} jwtService - Service responsible for generating JWT tokens.
     * @param {IAuthRepository} authRepository - Repository used to store refresh tokens.
     * @param {IIdProvider} idProvider - Provider for generating UUIDs for token records.
     */
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly jwtService: IJwtService,
        private readonly authRepository: IAuthRepository,
        private readonly idProvider: IIdProvider
    ) { }

    /**
     * @method execute
     * @async
     * @description Validates user credentials and returns a pair of tokens.
     * @param {LoginUserDTO} input - DTO containing email and password.
     * @throws {UserError} Throws INVALID_CREDENTIALS when authentication fails.
     * @returns {Promise<{ accessToken: string, refreshToken: string }>} The generated access and refresh tokens.
     */
    async execute(input: LoginUserDTO) {
        const email = Email.create(input.email);

        const existingUser = await this.userRepository.findByEmail(email);

        let isValid = false;
        if (existingUser) {
            isValid = await this.passwordHasher.verify(input.password, existingUser.password.getHash());
        }

        if (!isValid) {
            throw new UserError(UserErrorType.INVALID_CREDENTIALS);
        }

        const userId = existingUser!.id;
        const issueDate = new Date();
        const accessToken = await this.jwtService.generateAccessToken(userId);
        const refreshTokenString = await this.jwtService.generateRefreshToken(userId);

        const expirationDate = this.jwtService.getRefreshTokenExpirationDate();
        const tokenRecordId = this.idProvider.generateRandomUuid();

        const refreshTokenEntity = RefreshToken.createNew(
            tokenRecordId,
            refreshTokenString,
            userId,
            expirationDate,
            issueDate
        );

        await this.authRepository.saveRefreshToken(refreshTokenEntity);

        return {
            accessToken,
            refreshToken: refreshTokenString
        };
    }
}