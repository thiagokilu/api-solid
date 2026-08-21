import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository.ts";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository.ts";
import { expect, describe, it, beforeEach } from "vitest";
import { Prisma } from "../generated/prisma/client.ts";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history.ts";
import { SearchGymsUseCase } from "./search-gyms.ts";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymsUseCase(gymsRepository);
	});

	it("should be able to search for gyms", async () => {
		await gymsRepository.create({
			title: "JavaScript Gym",
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		});

		await gymsRepository.create({
			title: "TypeScript Gym",
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		});

		const { gyms } = await sut.execute({
			query: "JavaScript",
			page: 1,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "JavaScript Gym" }),
		]);
	});

	it("should be able to fetch paginated gym search", async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `JavaScript Gym ${i}`,
				description: null,
				phone: null,
				latitude: -27.2092052,
				longitude: -49.6401091,
			});
		}

		const { gyms } = await sut.execute({
			query: "JavaScript",
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "JavaScript Gym 21" }),
			expect.objectContaining({ title: "JavaScript Gym 22" }),
		]);
	});
});
