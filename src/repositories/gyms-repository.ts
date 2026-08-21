import { Prisma, type Gym } from "../generated/prisma/client.ts";

export interface FindManyNearbyParams {
	userLatitude: number;
	userLongitude: number;
}

export interface GymsRepository {
	findById(gymId: string): Promise<Gym | null>;
	findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
	searchMany(query: string, page: number): Promise<Gym[]>;
	create(data: Prisma.GymCreateInput): Promise<Gym>;
}
