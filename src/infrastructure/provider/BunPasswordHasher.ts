import { password } from "bun";
import { IPasswordHasher } from "../../application/providers/IPasswordHasher";

export class BunPasswordHasher implements IPasswordHasher {
    async hash(plainPassword: string): Promise<string> {
        return await Bun.password.hash(plainPassword)
    }

    async verify(plainPassword: string, hash: string): Promise<boolean> {
        return await Bun.password.verify(plainPassword, hash)
    }
}