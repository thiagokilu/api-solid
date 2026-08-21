import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository.ts";
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-in.ts";
import { check } from "zod/mini";
import { ResourceNotFoundError } from "./erros/resource-not-found-error.ts";

let checkInsRepository: InMemoryCheckInsRepository;

let sut: ValidateCheckInUseCase;

describe("Validate Check-in Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new ValidateCheckInUseCase(checkInsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to validate  check in", async () => {
		const CreatedCheckIn = await checkInsRepository.create({
			gym_id: "gym-01",
			user_id: "user-01",
		});

		const { checkIn } = await sut.execute({
			checkInId: CreatedCheckIn.id,
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
		expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
	});

	it("should not be able to validate an inexistent check-in", async () => {
		await expect(() =>
			sut.execute({ checkInId: "inexistent-id" }),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not be able to validate the chekin-in after 20 minutes of this creation", async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

		const CreatedCheckIn = await checkInsRepository.create({
			gym_id: "gym-01",
			user_id: "user-01",
		});

		const twentyOneMinutesInMs = 1000 * 60 * 21;

		vi.advanceTimersByTime(twentyOneMinutesInMs);

		expect(() =>
			sut.execute({ checkInId: CreatedCheckIn.id }),
		).rejects.toBeInstanceOf(Error);
	});
});
