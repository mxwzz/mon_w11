// ไฟล์: app/api/tags/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ดึง prisma ที่เราตั้งค่าไว้มาใช้

export async function GET() {
  const tags = await prisma.tag.findMany();
  return NextResponse.json(tags);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newTag = await prisma.tag.create({
    data: { tagName: body.tagName },
  });
  return NextResponse.json(newTag, { status: 201 });
}