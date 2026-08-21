import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register.ts";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository.ts";
import { UserAlreadyExistsError } from "./erros/user-already-exists-error.ts";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(usersRepository);
	});
	it("should be able to register", async () => {
		const { user } = await sut.execute({
			name: "John Doe",
			email: "john@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should hash user password upon registration", async () => {
		const { user } = await sut.execute({
			name: "John Doe",
			email: "john@example.com",
			password: "123456",
		});
		const isPasswordCorrectlyHased = await compare(
			"123456",
			user.password_hash,
		);
		expect(isPasswordCorrectlyHased).toBe(true);
	});

	it("should not able to register with same email twice", async () => {
		const email = "john@example.com";

		await sut.execute({
			name: "John Doe",
			email: email,
			password: "123456",
		});

		await expect(() =>
			sut.execute({
				name: "John Doe",
				email: email,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
