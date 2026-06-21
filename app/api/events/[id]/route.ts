import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, badRequest, serverError } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        registrations: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) return notFound("Event not found");
    return Response.json({ event });
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return unauthorized();

    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return notFound("Event not found");
    if (event.organizerId !== authUser.userId) return unauthorized();

    const { title, description, date, time, location, category, capacity, image } =
      await request.json();

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date }),
        ...(time && { time }),
        ...(location && { location }),
        ...(category && { category }),
        ...(capacity && { capacity: parseInt(capacity) }),
        ...(image !== undefined && { image }),
      },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        _count: { select: { registrations: true } },
      },
    });

    return Response.json({ event: updated });
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
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return notFound("Event not found");
    if (event.organizerId !== authUser.userId) return unauthorized();

    await prisma.registration.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });

    return Response.json({ message: "Event deleted" });
  } catch (error) {
    return serverError(error);
  }
}
