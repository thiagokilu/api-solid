import { type FastifyRequest, type FastifyReply } from "fastify";
import { z } from "zod";

import { InvalidCredentialsError } from "@/use-cases/erros/invalid-credentials-error.ts";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case.ts";

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const authenticateUseCase = makeAuthenticateUseCase();

	const authenticateBodySchema = z.object({
		email: z.email(),
		password: z.string().min(6),
	});

	const { email, password } = authenticateBodySchema.parse(request.body);

	try {
		await authenticateUseCase.execute({ email, password });
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(409).send(error);
		}
		throw error;
	}
	return reply.status(200).send();
}
