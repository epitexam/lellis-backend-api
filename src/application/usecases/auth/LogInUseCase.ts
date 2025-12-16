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
 * @description Orchestrates the user authentication process, verifies credentials,
 * and issues a new pair of Access and Refresh tokens.
 */
export class LogInUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly jwtService: IJwtService,
        private readonly authRepository: IAuthRepository,
        private readonly idProvider: IIdProvider
    ) { }

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
        const accessToken = await this.jwtService.generateAccessToken(userId.toString());
        const refreshTokenString = await this.jwtService.generateRefreshToken(userId.toString());

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