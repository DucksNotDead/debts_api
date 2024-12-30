import { IsString } from 'class-validator';

export class CreditsDto {
	@IsString()
	login: string;

	@IsString()
	password: string;
}
