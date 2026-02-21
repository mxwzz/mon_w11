import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  const tag = await prisma.tag.findUnique({
    where: { id: Number(id) },
  });
  return NextResponse.json(tag);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const updatedTag = await prisma.tag.update({
    where: { id: Number(id) },
    data: { tagName: body.tagName },
  });
  return NextResponse.json(updatedTag);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.tag.delete({
    where: { id: Number(id) },
  });
  return NextResponse.json({ message: "ลบสำเร็จแล้ว!" });
}