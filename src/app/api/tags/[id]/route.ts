import connectDB from '@/lib/mongoDb';
import Snippet from '@/models/Snippet';
import Tag from '@/models/Tag';
import { NextRequest, NextResponse } from 'next/server';

await connectDB();

// 🟢 GET - Fetch a single tag by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tag = await Tag.findById(id);
    if (!tag)
      return NextResponse.json(
        { success: false, error: 'Tag not found' },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: tag });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// 🔵 PATCH - Update a tag
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Tag name is required' },
        { status: 400 }
      );
    }

    const tag = await Tag.findById(id);
    if (!tag) {
      return NextResponse.json(
        { success: false, error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if another tag already exists with the new name
    const existingTag = await Tag.findOne({ name, _id: { $ne: id } });
    if (existingTag) {
      return NextResponse.json(
        { success: false, error: 'Tag with this name already exists' },
        { status: 400 }
      );
    }

    const updatedTag = await Tag.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedTag) {
      return NextResponse.json(
        { success: false, error: 'Tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedTag });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// 🔴 DELETE - Remove a tag
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First check if tag exists
    const tag = await Tag.findById(id);
    if (!tag) {
      return NextResponse.json(
        { success: false, error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if tag is used in any snippets
    const snippetsWithTag = await Snippet.findOne({ tags: { $in: [id] } });
    if (snippetsWithTag) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete tag as it is being used in snippets',
        },
        { status: 400 }
      );
    }

    // If tag is not used, delete it
    await Tag.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Tag deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
