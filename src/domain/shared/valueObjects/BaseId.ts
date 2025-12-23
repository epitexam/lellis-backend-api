export abstract class BaseId<T extends BaseId<T>> {
    protected constructor(
        protected readonly value: string
    ) {}

    public toString(): string {
        return this.value;
    }

    public equals(other: T): boolean {
        return this.value === other.value;
    }

    protected static isValidUuid(value: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    }
}
