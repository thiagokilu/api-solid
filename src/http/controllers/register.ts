import { RegisterUseCase } from "../../use-cases/register.ts";
import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.ts";
import { UserAlreadyExistsError } from "@/use-cases/erros/user-already-exists-error.ts";

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.email(),
		password: z.string().min(6),
	});

	const { name, email, password } = registerBodySchema.parse(request.body);

	try {
		const prismaUsersRepository = new PrismaUsersRepository();
		const registerUseCase = new RegisterUseCase(prismaUsersRepository);

		await registerUseCase.execute({ name, email, password });

		return reply.status(201).send();
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			return reply.status(409).send(error);
		}
		throw error;
	}
}
