import QRCode from "qrcode";
import { notFound, serverError } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return notFound("Event not found");

    const url = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/events/${id}`;
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: "#4F46E5", light: "#FFFFFF" },
    });

    return Response.json({ qrCode: qrDataUrl });
  } catch (error) {
    return serverError(error);
  }
}
