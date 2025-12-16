import { SQL } from "bun";
import { User } from "../../../domain/user/entity/User";
import { UserStatus } from "../../../domain/user/enums/UserStatus";
import { Password } from "../../../domain/user/valueObjects/Password";
import { Email } from "../../../domain/user/valueObjects/Email";
import { UserId } from "../../../domain/user/valueObjects/UserId";
import { IUserRepository } from "../../../application/repositories/user/IUserRepository";
import { CreateUserDTO } from "../../../domain/user/dtos/CreateUserDTO";

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  mfa_enabled: number;
  last_login: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export class MySqlUserRepository implements IUserRepository {
  constructor(private readonly sql: SQL) { }
  
  private toSqlDate(date: Date | null | undefined): string | null {
    if (!date) return null;
    return date.toISOString().replace('T', ' ').replace('Z', '');
  }

  private mapToDomain(row: UserRow): User {
    return User.reconstitute({
      id: UserId.create(row.id),
      email: Email.create(row.email),
      password: Password.fromHash(row.password_hash),
      firstName: row.first_name,
      lastName: row.last_name,
      mfaEnabled: Boolean(row.mfa_enabled),
      lastLogin: row.last_login ? new Date(row.last_login) : null,
      status: row.status as UserStatus,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  async findById(id: UserId): Promise<User | null> {
    const rows = await this.sql<UserRow[]>`
      SELECT * FROM users WHERE id = ${id.toString()} LIMIT 1
    `;
    return rows.length > 0 ? this.mapToDomain(rows[0]) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const rows = await this.sql<UserRow[]>`
      SELECT * FROM users WHERE email = ${email.getValue()} LIMIT 1
    `;
    return rows.length > 0 ? this.mapToDomain(rows[0]) : null;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const rows = await this.sql`
      SELECT 1 FROM users WHERE email = ${email.getValue()} LIMIT 1
    `;
    return rows.length > 0;
  }

  async save(user: User): Promise<User> {
    const params = {
      id: user.getIdValue(),
      email: user.getEmailValue(),
      password_hash: user.getPasswordHash(),
      first_name: user.firstName,
      last_name: user.lastName,
      mfa_enabled: user.mfaEnabled ? 1 : 0,
      last_login: this.toSqlDate(user.lastLogin),
      status: user.status,
      created_at: this.toSqlDate(user.createdAt),
      updated_at: this.toSqlDate(user.updatedAt)
    };

    await this.sql`
      INSERT INTO users (
        id, email, password_hash, first_name, last_name, 
        mfa_enabled, last_login, status, created_at, updated_at
      ) VALUES (
        ${params.id}, 
        ${params.email}, 
        ${params.password_hash}, 
        ${params.first_name}, 
        ${params.last_name}, 
        ${params.mfa_enabled}, 
        ${params.last_login}, 
        ${params.status}, 
        ${params.created_at}, 
        ${params.updated_at}
      )
      ON DUPLICATE KEY UPDATE
        email = VALUES(email),
        password_hash = VALUES(password_hash),
        first_name = VALUES(first_name),
        last_name = VALUES(last_name),
        mfa_enabled = VALUES(mfa_enabled),
        last_login = VALUES(last_login),
        status = VALUES(status),
        updated_at = VALUES(updated_at)
    `;
    return user;
  }

  async search(query: {
    search?: string;
    status?: UserStatus;
    sortBy: string;
    sortOrder: "asc" | "desc";
    offset: number;
    limit: number;
  }): Promise<{ users: User[]; total: number }> {
    const searchFilter = query.search ? `%${query.search}%` : null;
    const statusFilter = query.status ?? null;

    // Sécurité pour le tri
    const allowedSortColumns = ['email', 'first_name', 'last_name', 'created_at'];
    const sortByCol = allowedSortColumns.includes(query.sortBy) ? query.sortBy : 'created_at';

    // Dans Bun SQL, pour MySQL, l'ordre ne peut pas être paramétré directement dans le template facilement
    // On utilise donc une condition sur le template
    const usersPromise = query.sortOrder === 'desc'
      ? this.sql<UserRow[]>`
          SELECT * FROM users
          WHERE (${searchFilter} IS NULL OR email LIKE ${searchFilter} OR first_name LIKE ${searchFilter})
          AND (${statusFilter} IS NULL OR status = ${statusFilter})
          ORDER BY ${this.sql([sortByCol])} DESC
          LIMIT ${query.limit} OFFSET ${query.offset}`
      : this.sql<UserRow[]>`
          SELECT * FROM users
          WHERE (${searchFilter} IS NULL OR email LIKE ${searchFilter} OR first_name LIKE ${searchFilter})
          AND (${statusFilter} IS NULL OR status = ${statusFilter})
          ORDER BY ${this.sql([sortByCol])} ASC
          LIMIT ${query.limit} OFFSET ${query.offset}`;

    const countPromise = this.sql<{ count: number }[]>`
      SELECT COUNT(*) as count FROM users
      WHERE (${searchFilter} IS NULL OR email LIKE ${searchFilter} OR first_name LIKE ${searchFilter})
      AND (${statusFilter} IS NULL OR status = ${statusFilter})
    `;

    const [rows, countResult] = await Promise.all([usersPromise, countPromise]);

    return {
      users: rows.map(row => this.mapToDomain(row)),
      total: Number(countResult[0].count)
    };
  }

  async create(userData: CreateUserDTO): Promise<User> {
    throw new Error("Method not implemented. Use UseCase to create entity then repository.save()");
  }

  async update(user: User): Promise<User> {
    return this.save(user);
  }

  async delete(id: UserId): Promise<void> {
    await this.sql`DELETE FROM users WHERE id = ${id.toString()}`;
  }
}