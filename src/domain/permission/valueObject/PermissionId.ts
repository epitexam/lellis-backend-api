import { BaseId } from "../../shared/valueObjects/BaseId";
import { PermissionError, PermissionErrorType } from "../enums/PermissionErrorType";

export class PermissionId extends BaseId<PermissionId> {
    private constructor(value: string) {
        super(value);
    }

    public static create(id: string): PermissionId {
        if (!id || !BaseId.isValidUuid(id)) {
            throw new PermissionError(PermissionErrorType.PERMISSION_NOT_FOUND);
        }
        return new PermissionId(id);
    }
}
