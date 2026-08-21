import { compare } from "bcryptjs";
import { type CheckInsRepository } from "../repositories/check-ins-repository.ts";
import { type User, type CheckIn } from "../generated/prisma/client.ts";
import { InvalidCredentialsError } from "./erros/invalid-credentials-error.ts";
import { ResourceNotFoundError } from "./erros/resource-not-found-error.ts";
import { getDistanceBetweenCoordinates } from "../utils/get-distance-between-coordinates.ts";
import { MaxNumberOfCheckInsError } from "./erros/max-number-of-chek-ins-error.ts";
import { MaxDistanceError } from "./erros/max-distance-error.ts";

interface CheckinUseCaseRequest {
	gymId: string;
	userId: string;
	userLatitude: number;
	userLongitude: number;
}

interface CheckinUseCaseResponse {
	checkIn: CheckIn;
}

export class CheckInUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository,
	) {}

	async execute({
		gymId,
		userId,
		userLatitude,
		userLongitude,
	}: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
		const gym = await this.gymsRepository.findById(gymId);

		if (!gym) {
			throw new ResourceNotFoundError();
		}

		// calculate distance from user to gym

		const distance = getDistanceBetweenCoordinates(
			{ latitude: userLatitude, longitude: userLongitude },
			{
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber(),
			},
		);

		const MAX_DISTANCE_IN_KILOMETERS = 0.1;

		if (distance > MAX_DISTANCE_IN_KILOMETERS) {
			throw new MaxDistanceError();
		}

		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
			userId,
			new Date(),
		);

		if (checkInOnSameDay) {
			throw new MaxNumberOfCheckInsError();
		}

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId,
		});

		return {
			checkIn,
		};
	}
}
