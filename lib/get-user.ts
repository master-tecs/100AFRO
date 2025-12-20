// Edge-compatible function to get current user from request
import { NextRequest } from "next/server";
import { verifyToken } from "./auth-edge";

export async function getUser(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const user = await verifyToken(token);
    return user;
  } catch (error) {
    return null;
  }
}

