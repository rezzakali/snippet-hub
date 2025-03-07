import connectDB from '@/lib/mongoDb';
import Snippet from '@/models/Snippet';
import Tag from '@/models/Tag';
import { auth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';
import { type NextRequest, NextResponse } from 'next/server';

// Connect to MongoDB
await connectDB();

//  GET all snippets
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    const pageNumber = parseInt(page || '1', 10);
    const pageSize = parseInt(limit || '10', 10);

    const skip = (pageNumber - 1) * pageSize;

    const query: any = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (tags) {
      // Find tag documents that match the tag names
      const tagDocs = await Tag.find({
        name: { $in: tags.split(',').map((tag: string) => tag.toLowerCase()) },
      });

      // Get the tag IDs
      const tagIds = tagDocs.map((tag) => tag._id);

      // Query snippets that have any of these tag IDs
      query.tags = { $in: tagIds };
    }
    const snippets = await Snippet.find({
      ...query,
      isDeleted: false,
      isArchived: false,
    })
      .skip(skip)
      .limit(pageSize)
      .populate('tags')
      .sort({ createdAt: -1 })
      .lean();
    const totalSnippets = await Snippet.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: snippets,
      total: totalSnippets,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalSnippets / pageSize),
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

//  POST - Create a new snippet
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, code, language, tags, description } = await req.json();

    /// Generates a 10-char unique IDh

    const shareId = nanoid(10);

    //  Convert tags from comma-separated string to an array
    const tagArray = tags.split(',').map((tag: string) => tag.trim());

    //  Fetch tags from DB & create new ones if needed
    const tagIds = await Promise.all(
      tagArray.map(async (tagName: string) => {
        let tag = await Tag.findOne({ name: tagName.toLowerCase() });
        if (!tag) {
          tag = await Tag.create({ name: tagName.toLowerCase() });
        }
        return tag._id;
      })
    );

    const newSnippet = await Snippet.create({
      title,
      code,
      language: language.toLowerCase(),
      description,
      tags: tagIds,
      createdBy: userId,
      favouriteBy: [],
      isDeleted: false,
      isArchived: false,
      shareId,
    });

    // Populate the tags field
    const populatedSnippet = await newSnippet.populate('tags');

    return NextResponse.json(
      { success: true, data: populatedSnippet },
      { status: 201 }
    );
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
