import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { TossMode } from "@/generated/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { intention, tosses, hexagram, mode } = await req.json();
  if (
    typeof intention !== "string" ||
    !Array.isArray(tosses) ||
    (tosses.length !== 21 && tosses.length !== 18) ||
    typeof hexagram !== "number" ||
    (mode !== TossMode.AUTOMATIC && mode !== TossMode.MANUAL)
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const record = await prisma.tossHistory.create({
    data: {
      userId: user.id,
      intention,
      tosses,
      hexagram,
      mode,
    },
  });

  return NextResponse.json({ success: true, id: record.id });
}

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const history = await prisma.tossHistory.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, history });
}
