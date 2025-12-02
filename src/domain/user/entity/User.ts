/**
 * User - Core Domain Entity
 * Represents an authenticated user with full domain behavior and invariants.
 * Immutable identifier & creation date, mutable profile with proper business rules.
 *
 * @entity
 * @domain User
 */
import { UserError, UserErrorType } from "../enums/UserErrorType";
import { UserStatus } from "../enums/UserStatus";
import { Email } from "../valueObjects/Email";
import { Password } from "../valueObjects/Password";
import { UserId } from "../valueObjects/UserId";

export class User {
    public readonly id: UserId;
    public readonly createdAt: Date;

    private _email: Email;
    private _password: Password;
    private _firstName: string;
    private _lastName: string;
    private _mfaEnabled: boolean;
    private _lastLogin: Date | null;
    private _status: UserStatus;
    private _updatedAt: Date;

    private constructor(
        id: UserId,
        email: Email,
        password: Password,
        firstName: string,
        lastName: string,
        mfaEnabled = false,
        lastLogin: Date | null = null,
        status = UserStatus.PENDING,
        createdAt = new Date(),
        updatedAt = new Date()
    ) {
        this.id = id;
        this._email = email;
        this._password = password;
        this._firstName = firstName.trim();
        this._lastName = lastName.trim();
        this._mfaEnabled = mfaEnabled;
        this._lastLogin = lastLogin;
        this._status = status;
        this.createdAt = createdAt;
        this._updatedAt = updatedAt;

        this.validateState();
    }

    /** Factory for new user creation */
    public static create(props: {
        id: UserId;
        email: Email;
        password: Password;
        firstName: string;
        lastName: string;
    }): User {
        if (!props.firstName?.trim()) throw new UserError(UserErrorType.FIRST_NAME_REQUIRED);
        if (!props.lastName?.trim()) throw new UserError(UserErrorType.LAST_NAME_REQUIRED);

        return new User(
            props.id,
            props.email,
            props.password,
            props.firstName,
            props.lastName
        );
    }

    /** Reconstitution from persistence (DB, cache, etc.) */
    public static reconstitute(props: {
        id: UserId;
        email: Email;
        password: Password;
        firstName: string;
        lastName: string;
        mfaEnabled: boolean;
        lastLogin: Date | null;
        status: UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }): User {
        return new User(
            props.id,
            props.email,
            props.password,
            props.firstName,
            props.lastName,
            props.mfaEnabled,
            props.lastLogin,
            props.status,
            props.createdAt,
            props.updatedAt
        );
    }

    // ——— Getters ———
    public get email(): Email { return this._email; }
    public get password(): Password { return this._password; }
    public get firstName(): string { return this._firstName; }
    public get lastName(): string { return this._lastName; }
    public get mfaEnabled(): boolean { return this._mfaEnabled; }
    public get lastLogin(): Date | null { return this._lastLogin; }
    public get status(): UserStatus { return this._status; }
    public get updatedAt(): Date { return this._updatedAt; }

    public getIdValue(): string { return this.id.toString(); }
    public getEmailValue(): string { return this._email.getValue(); }
    public getPasswordHash(): string { return this._password.getHash(); }

    public getFullName(): string {
        return `${this._firstName} ${this._lastName}`.trim();
    }

    public isActive(): boolean {
        return this._status === UserStatus.ACTIVE;
    }

    // ——— Domain Behaviors ———
    public recordLogin(): void {
        this._lastLogin = new Date();
        this.touch();
    }

    public activate(): void {
        if (this._status !== UserStatus.ACTIVE) {
            this._status = UserStatus.ACTIVE;
            this.touch();
        }
    }

    public updateProfile(updates: {
        firstName?: string;
        lastName?: string;
        email?: Email;
    }): void {
        if (updates.firstName?.trim()) {
            this._firstName = updates.firstName.trim();
        }

        if (updates.lastName?.trim()) {
            this._lastName = updates.lastName.trim();
        }

        if (updates.email && !updates.email.equals(this._email)) {
            this._email = updates.email;
        }

        if (updates.firstName || updates.lastName || updates.email) {
            this.validateState();
            this.touch();
        }
    }

    public changePassword(newPassword: Password): void {
        if (newPassword.equals(this._password)) {
            throw new UserError(UserErrorType.SAME_PASSWORD);
        }
        this._password = newPassword;
        this.touch();
    }

    public enableMfa(): void {
        if (!this._mfaEnabled) {
            this._mfaEnabled = true;
            this.touch();
        }
    }

    public disableMfa(): void {
        if (this._mfaEnabled) {
            this._mfaEnabled = false;
            this.touch();
        }
    }

    private validateState(): void {
        if (!this._firstName.trim()) {
            throw new UserError(UserErrorType.FIRST_NAME_REQUIRED);
        }

        if (!this._lastName.trim()) {
            throw new UserError(UserErrorType.LAST_NAME_REQUIRED);
        }
    }

    private touch(): void {
        this._updatedAt = new Date();
    }

    public toJSON(): object {
        return {
            id: this.getIdValue(),
            email: this.getEmailValue(),
            firstName: this.firstName,
            lastName: this.lastName,
            mfaEnabled: this.mfaEnabled,
            lastLogin: this.lastLogin,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}