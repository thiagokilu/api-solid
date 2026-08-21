import { hash } from "bcryptjs";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository.ts";
import type { UsersRepository } from "@/repositories/users-repository.ts";
import { UserAlreadyExistsError } from "./erros/user-already-exists-error.ts";
import type { User } from "../generated/prisma/client.ts";

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

interface RegisterUseCaseResponse {
	user: User;
}

// SOLID
// D - Dependency Inversion

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}
	async execute({
		name,
		email,
		password,
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const password_hash = await hash(password, 6);

		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}

		// const prismaUsersRepository = new PrismaUsersRepository();

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash,
		});

		return {
			user,
		};
	}
}
