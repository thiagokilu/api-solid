import { Prisma, type User } from "../generated/prisma/client.ts";

export interface UsersRepository {
	findByEmail(email: string): Promise<User | null>;
	create(data: Prisma.UserCreateInput): Promise<User>;
}
