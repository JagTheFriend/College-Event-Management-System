import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return unauthorized();

    const attendance = await prisma.attendance.findMany({
      where: { registration: { userId: authUser.userId } },
      include: {
        registration: {
          include: {
            event: { select: { id: true, title: true, date: true } },
          },
        },
      },
      orderBy: { markedAt: "desc" },
    });

    return Response.json({ attendance });
  } catch (error) {
    return serverError(error);
  }
}
