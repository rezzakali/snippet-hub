import { connectDB } from '@/lib/mongoDb';
import Snippet from '@/models/Snippet';
import Tag from '@/models/Tag';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Connect to MongoDB
await connectDB();

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
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

    const totalSnippets = await Snippet.countDocuments({
      ...query,
      favouriteBy: userId,
    });

    const favouriteSnippets = await Snippet.find({
      ...query,
      favouriteBy: userId,
    })
      .skip(skip)
      .limit(pageSize)
      .populate('tags')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: favouriteSnippets,
        total: totalSnippets,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalSnippets / pageSize),
      },
      { status: 200 }
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
