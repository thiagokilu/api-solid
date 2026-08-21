import type { CheckInsRepository } from "../check-ins-repository.ts";
import type { Prisma, CheckIn } from "../../generated/prisma/client.ts";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = [];

	async findById(id: string): Promise<CheckIn | null> {
		const checkIn = this.items.find((checkIn) => checkIn.id === id);
		if (!checkIn) return null;
		return checkIn;
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf("date");
		const endOfTheDay = dayjs(date).endOf("date");

		const checkOnSameDate = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at);
			const isOnSameDate =
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

			return checkIn.user_id === userId && isOnSameDate;
		});

		if (!checkOnSameDate) {
			return null;
		}

		return checkOnSameDate;
	}

	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		return this.items
			.filter((checkIn) => checkIn.user_id === userId)
			.slice((page - 1) * 20, page * 20);
	}

	countByUserId(userId: string): Promise<number> {
		return Promise.resolve(
			this.items.filter((checkIn) => checkIn.user_id === userId).length,
		);
	}

	async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
		const CheckIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date(),
		};
		this.items.push(CheckIn);
		return CheckIn;
	}

	async save(checkIn: CheckIn) {
		const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

		if (checkInIndex >= 0) {
			this.items[checkInIndex] = checkIn;
		}

		return checkIn;
	}
}
