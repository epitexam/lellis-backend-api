import { UserError, UserErrorType } from "../enums/UserErrorType";

export class UserId {
    private constructor(private readonly value: string) { }

    static create(id: string): UserId {
        if (!id || typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
            throw new UserError(UserErrorType.INVALID_USER_ID);
        }
        return new UserId(id);
    }

    toString(): string {
        return this.value;
    }

    equals(other: UserId): boolean {
        return this.value === other.value;
    }
}