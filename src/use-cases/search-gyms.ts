import type { GymsRepository } from "@/repositories/gyms-repository.ts";
import type { Prisma, Gym } from "../generated/prisma/client.ts";

interface SearchGymsUseCaseRequest {
	query: string;
	page: number;
}

interface SearchGymsUseCaseResponse {
	gyms: Gym[];
}

export class SearchGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page,
	}: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.searchMany(query, page);

		return {
			gyms,
		};
	}
}
