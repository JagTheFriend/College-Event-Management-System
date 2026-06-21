import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, badRequest, serverError } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return badRequest("Name, email, and password are required");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return badRequest("Email already registered");
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || "STUDENT" },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = Response.json(
      { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token },
      { status: 201 }
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
