import { Prisma, type User } from "../generated/prisma/client.ts";

export interface UsersRepository {
	findById(userId: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	create(data: Prisma.UserCreateInput): Promise<User>;
}
