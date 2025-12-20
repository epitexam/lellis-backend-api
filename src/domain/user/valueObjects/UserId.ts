import { BaseId } from "../../shared/valueObjects/BaseId";
import { UserError, UserErrorType } from "../enums/UserErrorType";

export class UserId extends BaseId<UserId> {
    private constructor(value: string) {
        super(value);
    }

    public static create(id: string): UserId {
        if (!id || !BaseId.isValidUuid(id)) {
            throw new UserError(UserErrorType.INVALID_USER_ID);
        }
        return new UserId(id);
    }
}
