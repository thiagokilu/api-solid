import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository.ts";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile.ts";
import { ResourceNotFoundError } from "./erros/resource-not-found-error.ts";

describe("Register Use Case", () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: GetUserProfileUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(usersRepository);
	});

	it("should be able to get user profile", async () => {
		const createdUser = await usersRepository.create({
			name: "John Doe",
			email: "john@example.com",
			password_hash: await hash("123456", 6),
		});

		const { user } = await sut.execute({
			userId: createdUser.id,
		});

		expect(user.name).toEqual("John Doe");
	});

	it("should not able to get user profile whit wrong id", async () => {
		await expect(() =>
			sut.execute({
				userId: "non-existing-id",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
