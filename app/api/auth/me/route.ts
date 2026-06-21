import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return unauthorized();

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) return unauthorized();

    return Response.json({ user });
  } catch (error) {
    return serverError(error);
  }
}
