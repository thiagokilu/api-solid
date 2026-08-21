import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository.ts";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository.ts";
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-in.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { MaxNumberOfCheckInsError } from "./erros/max-number-of-chek-ins-error.ts";
import { MaxDistanceError } from "./erros/max-distance-error.ts";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: "gym-01",
			title: "javscript gym",
			description: "",
			phone: "",
			latitude: new Prisma.Decimal(-16.0451522),
			longitude: new Prisma.Decimal(-48.038416),
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check in", async () => {
		gymsRepository.items.push({
			id: "gym-01",
			title: "",
			description: "",
			phone: "",
			latitude: new Prisma.Decimal(0),
			longitude: new Prisma.Decimal(0),
		});

		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -16.0451522,
			userLongitude: -48.038416,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not able to check in twice in the same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -16.0451522,
			userLongitude: -48.038416,
		});

		await expect(
			sut.execute({
				gymId: "gym-01",
				userId: "user-01",
				userLatitude: -16.0451522,
				userLongitude: -48.038416,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it("should be able to check in twice but in different days", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -16.0451522,
			userLongitude: -48.038416,
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -16.0451522,
			userLongitude: -48.038416,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in on distant gym", async () => {
		//-15.9680315,-48.0197258,

		gymsRepository.items.push({
			id: "gym-02",
			title: "javascirpt gym",
			description: "",
			phone: "",
			latitude: new Prisma.Decimal(-15.9680315),
			longitude: new Prisma.Decimal(-48.0197258),
		});

		await expect(
			sut.execute({
				gymId: "gym-02",
				userId: "user-01",
				userLatitude: -16.0451522,
				userLongitude: -48.038416,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
