import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return unauthorized();

    const registrations = await prisma.registration.findMany({
      where: { userId: authUser.userId },
      include: {
        event: {
          include: {
            organizer: { select: { id: true, name: true, email: true } },
            _count: { select: { registrations: true } },
          },
        },
        attendance: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ registrations });
  } catch (error) {
    return serverError(error);
  }
}
