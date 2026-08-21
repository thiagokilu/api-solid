import { type CheckInsRepository } from "../repositories/check-ins-repository.ts";
import { type CheckIn } from "../generated/prisma/client.ts";

interface GetUserMetricsUseCaseRequest {
	userId: string;
}

interface GetUserMetricsUseCaseResponse {
	checkInsCount: number;
}

export class GetUserMetricsUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
	}: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
		const checkInsCount = await this.checkInsRepository.countByUserId(userId);

		return {
			checkInsCount,
		};
	}
}
