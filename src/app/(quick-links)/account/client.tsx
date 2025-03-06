'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

export default function Account() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div className="w-full mx-auto mt-8 p-6 rounded-lg border border-border">
      {isLoaded ? (
        isSignedIn ? (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative w-24 h-24 sm:w-24 sm:h-24">
              <Image
                src={user?.imageUrl}
                alt="Profile"
                className="rounded-full border-2 border-primary shadow-md"
                fill
              />
            </div>

            {/* User Info */}
            <div className="w-full text-center sm:text-left">
              <h2 className="text-xl font-semibold ">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm">@{user?.username || 'N/A'}</p>

              {/* User Details */}
              <div className="mt-4 text-sm space-y-2">
                <div className="flex justify-between sm:justify-start sm:gap-4 pb-1">
                  <span className="font-medium">Email:</span>
                  <span>{user?.emailAddresses[0]?.emailAddress}</span>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-4 pb-1">
                  <span className="font-medium">ID:</span>
                  <span>{user?.id}</span>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-4 pb-1">
                  <span className="font-medium">Joined:</span>
                  <span>{new Date(user?.createdAt!).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center ">Please sign in</p>
        )
      ) : (
        // Skeleton Loader
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full" />
          <div className="w-full space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
