export interface JwtUserPayload {
	userId: number;
	email: string;
	iat?: number;
	exp?: number;
}

declare global {
	namespace Express {
		interface Request {
			user?: JwtUserPayload;
		}
	}
}
