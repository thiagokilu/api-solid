import { Prisma, type CheckIn } from "../generated/prisma/client.ts";

export interface CheckInsRepository {
	findById(id: string): Promise<CheckIn | null>;
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
	countByUserId(userId: string): Promise<number>;
	findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
	create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
	save(checkIn: CheckIn): Promise<CheckIn>;
}
