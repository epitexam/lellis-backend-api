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

export class User {
    // Immutable identifiers
    public readonly id: string;
    public readonly createdAt: Date;

    // Mutable but protected domain properties
    private _email: Email;
    private _password: Password;
    private _firstName: string;
    private _lastName: string;
    private _mfaEnabled: boolean;
    private _lastLogin: Date | null;
    private _status: UserStatus;
    private _updatedAt: Date;

    // Private constructor → creation only via factory methods
    private constructor(
        id: string,
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
    }

    /** Factory for new user registration (preferred way) */
    public static create(props: {
        id: string;
        email: Email;
        password: Password;
        firstName: string;
        lastName: string;
    }): User {
        if (!props.firstName?.trim()) {
            throw new UserError(UserErrorType.FIRST_NAME_REQUIRED);
        }
        if (!props.lastName?.trim()) {
            throw new UserError(UserErrorType.LAST_NAME_REQUIRED);
        }

        const now = new Date();
        return new User(
            props.id,
            props.email,
            props.password,
            props.firstName,
            props.lastName,
            false,
            null,
            UserStatus.PENDING,
            now,
            now
        );
    }

    /** Reconstitution from persistence (e.g. database) */
    public static reconstitute(props: {
        id: string;
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

    public getFullName(): string {
        return `${this._firstName} ${this._lastName}`.trim();
    }

    public getEmailValue(): string {
        return this._email.getValue();
    }

    public getPasswordHash(): string {
        return this._password.getHash();
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
        if (this._status === UserStatus.ACTIVE) return;
        this._status = UserStatus.ACTIVE;
        this.touch();
    }

    public updateProfile(updates: {
        firstName?: string;
        lastName?: string;
        email?: Email;
    }): void {
        if (updates.firstName?.trim()) this._firstName = updates.firstName.trim();
        if (updates.lastName?.trim()) this._lastName = updates.lastName.trim();
        if (updates.email && !updates.email.equals(this._email)) {
            this._email = updates.email;
        }
        this.touch();
    }

    public changePassword(newPassword: Password): void {
        if (newPassword.getHash() === this._password.getHash()) {
            throw new UserError(UserErrorType.SAME_PASSWORD);
        }
        this._password = newPassword;
        this.touch();
    }

    public enableMfa(): void {
        if (this._mfaEnabled) return;
        this._mfaEnabled = true;
        this.touch();
    }

    public disableMfa(): void {
        if (!this._mfaEnabled) return;
        this._mfaEnabled = false;
        this.touch();
    }

    // ——— Private helpers ———
    private touch(): void {
        this._updatedAt = new Date();
    }
}