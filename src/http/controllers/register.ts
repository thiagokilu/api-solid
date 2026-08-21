import { type FastifyRequest, type FastifyReply } from "fastify";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case.ts";
import { z } from "zod";
import { UserAlreadyExistsError } from "@/use-cases/erros/user-already-exists-error.ts";

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.email(),
		password: z.string().min(6),
	});

	const { name, email, password } = registerBodySchema.parse(request.body);

	try {
		const registerUseCase = makeRegisterUseCase();

		await registerUseCase.execute({ name, email, password });

		return reply.status(201).send();
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			return reply.status(409).send(error);
		}
		throw error;
	}
}
