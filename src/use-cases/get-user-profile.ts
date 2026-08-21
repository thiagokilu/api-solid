import { type UsersRepository } from "../repositories/users-repository.ts";
import { type User } from "../generated/prisma/client.ts";
import { ResourceNotFoundError } from "./erros/resource-not-found-error.ts";

interface GetUserProfileUseCaseRequest {
	userId: string;
}

interface GetUserProfileUseCaseResponse {
	user: User;
}

export class GetUserProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
	}: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			throw new ResourceNotFoundError();
		}

		return {
			user,
		};
	}
}
