import { connectDB } from '@/lib/mongoDb';
import Snippet from '@/models/Snippet';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

await connectDB();

export async function PATCH(
  req: Request,
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
    const { id } = await params; // Get snippet ID from request body
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Snippet ID is required' },
        { status: 400 }
      );
    }

    // Find and update snippet to restore it
    const updatedSnippet = await Snippet.findByIdAndUpdate(
      id,
      { isArchived: false },
      { new: true }
    );

    if (!updatedSnippet) {
      return NextResponse.json(
        { success: false, message: 'Snippet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Snippet restored', data: updatedSnippet },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Error restoring snippet: ${error}` },
      { status: 500 }
    );
  }
}
