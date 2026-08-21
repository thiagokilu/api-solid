import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.ts";ories/prisma-users-repository.ts";
import { AuthenticateUseCase } from "@/use-cases/authenticate.ts";

export function makeAuthenticateUseCase() {
	const prismaUsersRepository = new PrismaUsersRepository();
	const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository);

	return authenticateUseCase;
}
