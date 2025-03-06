import connectDB from '@/lib/mongoDb';
import Tag from '@/models/Tag';
import { NextRequest, NextResponse } from 'next/server';

await connectDB();

//  GET - Fetch all tags
export async function GET() {
  try {
    const tags = await Tag.find().select('-__v');
    return NextResponse.json({ success: true, data: tags });
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

// POST - Create a new tag
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name)
      return NextResponse.json(
        { success: false, error: 'Tag name is required' },
        { status: 400 }
      );

    const existingTag = await Tag.findOne({ name });

    if (existingTag) {
      return NextResponse.json(
        { success: false, error: 'Tag already exists' },
        { status: 400 }
      );
    }

    const tag = await Tag.create({ name });
    return NextResponse.json({ success: true, data: tag }, { status: 201 });
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
