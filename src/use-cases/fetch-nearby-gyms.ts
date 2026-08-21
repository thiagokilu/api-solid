import type { GymsRepository } from "@/repositories/gyms-repository.ts";
import type { Prisma, Gym } from "../generated/prisma/client.ts";

interface FetchNearbyGymsUseCaseRequest {
	userLatitude: number;
	userLongitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
	gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude,
	}: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.findManyNearby({
			userLatitude,
			userLongitude,
		});

		return {
			gyms,
		};
	}
}
