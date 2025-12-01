import { IIdProvider } from "../../application/providers/IIdProvider";

export class BunIdProvider implements IIdProvider {
    generate(): string {
        return Bun.randomUUIDv7();
    }
}