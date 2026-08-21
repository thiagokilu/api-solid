import type { GymsRepository } from "@/repositories/gyms-repository.ts";
import type { Prisma, Gym } from "../generated/prisma/client.ts";

interface CreateGymUseCaseRequest {
	title: string;
	description: string | null;
	phone: string | null;
	latitude: number;
	longitude: number;
}

interface CreateGymUseCaseResponse {
	gym: Gym;
}

// SOLID
// D - Dependency Inversion

export class CreateGymUseCase {
	constructor(private gymsRepository: GymsRepository) {}
	async execute({
		title,
		description,
		phone,
		latitude,
		longitude,
	}: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
		const gym = await this.gymsRepository.create({
			title,
			description,
			phone,
			latitude,
			longitude,
		});

		return {
			gym,
		};
	}
}
