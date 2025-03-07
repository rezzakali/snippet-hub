import connectDB from '@/lib/mongoDb';
import Snippet from '@/models/Snippet';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

await connectDB();

export async function GET(
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

    const snippet = await Snippet.findOne({ shareId: id }).populate('tags');

    if (!snippet)
      return NextResponse.json(
        { success: false, error: 'Snippet not found' },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: snippet });
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

// export async function GET(req: NextRequest) {
//   try {
//     // Fetch all snippets with existing shareIds
//     const snippets = await Snippet.find({}, { _id: 1, shareId: 2 });
//     // Create a Set to track used shareIds
//     const usedShareIds = new Set();
//     // Prepare update operations
//     const bulkUpdates = snippets.map((snippet) => {
//       let newShareId = nanoid(10);

//       // Ensure unique shareId
//       while (usedShareIds.has(newShareId)) {
//         newShareId = nanoid(10);
//       }
//       usedShareIds.add(newShareId);

//       return {
//         updateOne: {
//           filter: { _id: snippet._id },
//           update: { $set: { shareId: newShareId } },
//         },
//       };
//     });

//     // Execute bulk update
//     if (bulkUpdates.length > 0) {
//       await Snippet.bulkWrite(bulkUpdates);
//     }

//     return NextResponse.json({
//       success: true,
//       message: `Updated ${bulkUpdates.length} snippets with unique shareIds`,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'An unknown error occurred',
//       },
//       { status: 500 }
//     );
//   }
// }
