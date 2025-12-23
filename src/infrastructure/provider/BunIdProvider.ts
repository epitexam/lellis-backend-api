import { IIdProvider } from "../../application/providers/IIdProvider";
import { UserId } from "../../domain/user/valueObjects/UserId";

export class BunIdProvider implements IIdProvider {
    generate(): string {
        const uuid = Bun.randomUUIDv7();
        return UserId.create(uuid).toString()
    }

    generateRandomUuid(): string {
        return Bun.randomUUIDv7();
    }
}