import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, badRequest, serverError } from "@/lib/auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return unauthorized();

    const { id } = await params;

    const registration = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: authUser.userId, eventId: id } },
    });
    if (!registration) return notFound("Registration not found");

    const existing = await prisma.attendance.findUnique({
      where: { registrationId: registration.id },
    });
    if (existing) return badRequest("Attendance already marked");

    const attendance = await prisma.attendance.create({
      data: { registrationId: registration.id },
    });

    return Response.json({ attendance }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return unauthorized();

    const { id } = await params;

    const registration = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: authUser.userId, eventId: id } },
      include: { attendance: true },
    });
    if (!registration) return notFound("Registration not found");

    return Response.json({
      attendance: registration.attendance[0] || null,
    });
  } catch (error) {
    return serverError(error);
  }
}
