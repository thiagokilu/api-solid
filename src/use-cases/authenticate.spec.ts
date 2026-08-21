import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository.ts";
import { AuthenticateUseCase } from "./authenticate.ts";
import { InvalidCredentialsError } from "./erros/invalid-credentials-error.ts";
import { hash } from "bcryptjs";

describe("Register Use Case", () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: AuthenticateUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it("should be able to authenticate", async () => {
		await usersRepository.create({
			name: "John Doe",
			email: "john@example.com",
			password_hash: await hash("123456", 6),
		});

		const { user } = await sut.execute({
			email: "john@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should be able to authenticate with wrong email", async () => {
		await expect(() =>
			sut.execute({
				email: "john@example.com",
				password: "123456",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should be able to authenticate with wrong password", async () => {
		await usersRepository.create({
			name: "John Doe",
			email: "john@example.com",
			password_hash: await hash("123456", 6),
		});

		await expect(() =>
			sut.execute({
				email: "john@example.com",
				password: "123",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
