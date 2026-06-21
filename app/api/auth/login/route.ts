import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken, badRequest, serverError } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return badRequest("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return badRequest("Invalid email or password");
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return badRequest("Invalid email or password");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = Response.json(
      { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token },
      { status: 200 }
    );
    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
    );
    return response;
  } catch (error) {
    return serverError(error);
  }
}
