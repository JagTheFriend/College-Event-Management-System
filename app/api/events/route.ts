import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest, serverError } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (category && category !== "All") where.category = category;
    if (search) where.title = { contains: search, mode: "insensitive" };

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        registrations: { select: { id: true, userId: true, status: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ events });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return unauthorized();

    const { title, description, date, time, location, category, capacity, image } =
      await request.json();

    if (!title || !description || !date || !time || !location) {
      return badRequest("Title, description, date, time, and location are required");
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date,
        time,
        location,
        category: category || "Other",
        capacity: capacity ? parseInt(capacity) : 100,
        image: image || "",
        organizerId: authUser.userId,
      },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        registrations: { select: { id: true, userId: true, status: true } },
      },
    });

    return Response.json({ event }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
