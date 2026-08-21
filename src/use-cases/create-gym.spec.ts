import { expect, describe, it, beforeEach } from "vitest";
import { CreateGymUseCase } from "./create-gym.ts";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository.ts";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Register Use Case", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymUseCase(gymsRepository);
	});

	it("should be able to create gym", async () => {
		const { gym } = await sut.execute({
			title: "Javascript Gym",
			description: null,
			phone: null,
			latitude: -16.0451522,
			longitude: -48.038416,
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});
