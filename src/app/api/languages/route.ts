import { connectDB } from '@/lib/mongoDb';
import Snippet from '@/models/Snippet';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

await connectDB();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const languages = await Snippet.aggregate([
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          no: '$count',
        },
      },
      {
        $sort: { no: -1 }, // Sort by count (descending)
      },
    ]);

    return NextResponse.json({ success: true, data: languages });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error || 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}
