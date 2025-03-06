import connectDB from '@/lib/mongoDb';
import Snippet from '@/models/Snippet';
import Tag from '@/models/Tag';
import { auth } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

await connectDB();

//  PUT - Update a snippet
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    //  Convert tags from comma-separated string to an array
    const tagArray = body.tags.split(',').map((tag: string) => tag.trim());

    const tagIds = await Promise.all(
      tagArray.map(async (tagName: string) => {
        let tag = await Tag.findOne({ name: tagName.toLowerCase() });
        if (!tag) {
          tag = await Tag.create({ name: tagName.toLowerCase() });
        }
        return tag._id;
      })
    );

    body.tags = tagIds;

    const updatedSnippet = await Snippet.findByIdAndUpdate(id, body, {
      new: true,
    }).populate('tags');

    if (!updatedSnippet)
      return NextResponse.json(
        { success: false, error: 'Snippet not found' },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updatedSnippet });
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

//  DELETE - Remove a snippet
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const { id } = await params;
    const deletedSnippet = await Snippet.findByIdAndDelete(id);
    if (!deletedSnippet)
      return NextResponse.json(
        { success: false, error: 'Snippet not found' },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: 'Snippet deleted',
    });
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

// PATCH - Toggle favorite status
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { snippetId } = await req.json();

    if (!snippetId) {
      return NextResponse.json(
        { success: false, error: 'Snippet ID is required' },
        { status: 400 }
      );
    }

    const snippet = await Snippet.findById(snippetId);

    if (!snippet) {
      return NextResponse.json(
        { success: false, error: 'Snippet not found' },
        { status: 404 }
      );
    }

    const isAlreadyFavourite = snippet.favouriteBy.includes(userId);

    if (isAlreadyFavourite) {
      snippet.favouriteBy = snippet.favouriteBy.filter(
        (id: { toString: () => string }) => id.toString() !== userId
      );
    } else {
      snippet.favouriteBy.push(userId);
    }

    await snippet.save();

    const updatedSnippet = await Snippet.findById(snippetId).populate('tags');

    return NextResponse.json({
      success: true,
      isFavourite: !isAlreadyFavourite,
      data: updatedSnippet,
    });
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
