import { connectDB } from '@/lib/mongoDb';
import Snippet from '@/models/Snippet';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

await connectDB();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const snippet = await Snippet.findById(id);
    if (!snippet) {
      return NextResponse.json(
        { success: false, message: 'Snippet not found' },
        { status: 404 }
      );
    }

    snippet.isArchived = true;
    await snippet.save();

    return NextResponse.json(
      { success: true, message: 'Snippet moved to trash', data: snippet },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error || 'Failed to update snippet' },
      { status: 500 }
    );
  }
}
