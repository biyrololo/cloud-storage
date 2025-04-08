import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export type JwtPayload = {
    id: number;
    email: string;
}

class JwtService {
    createToken(payload: JwtPayload) {
        if(!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const options: SignOptions = {
            expiresIn: EXPIRES_IN as jwt.SignOptions['expiresIn']
        };
        return jwt.sign(payload, JWT_SECRET as jwt.Secret, options);  
    }

    verifyToken(token: string): JwtPayload | null {
        try {
            if(!JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined");
            }
            return jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayload;
        } catch (error) {
            console.error("Error verifying token:", error);
            return null
        }
    }
}

export const jwtService = new JwtService();