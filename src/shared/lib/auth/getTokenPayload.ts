import { cookies } from "next/headers";
import { jwtService, JwtPayload } from "../jwtService";

export async function getTokenPayload(): Promise<JwtPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if(!token) {
        return null;
    }

    return jwtService.verifyToken(token.value);
}