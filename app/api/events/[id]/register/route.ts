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

    const event = await prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } },
    });
    if (!event) return notFound("Event not found");

    const existing = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: authUser.userId, eventId: id } },
    });
    if (existing) return badRequest("Already registered for this event");

    if (event._count.registrations >= event.capacity) {
      return badRequest("Event is at full capacity");
    }

    const registration = await prisma.registration.create({
      data: { userId: authUser.userId, eventId: id },
      include: {
        event: { select: { title: true } },
        user: { select: { name: true, email: true } },
      },
    });

    return Response.json({ registration }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(
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

    await prisma.attendance.deleteMany({
      where: { registrationId: registration.id },
    });
    await prisma.registration.delete({
      where: { userId_eventId: { userId: authUser.userId, eventId: id } },
    });

    return Response.json({ message: "Registration cancelled" });
  } catch (error) {
    return serverError(error);
  }
}
