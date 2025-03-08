'use client';

import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import Image from 'next/image';

export default function LandingPageHeader() {
  return (
    <header className="fixed top-0 left-0 w-full bg-background border-b py-3 px-6 flex justify-between items-center z-50">
      <div className="flex items-center space-x-2">
        <div className="relative w-10 h-10">
          <Image src={'/logo.png'} alt="snippet-logo" fill priority />
        </div>
        <span className="text-xl font-bold">
          <span className="text-primary">Snippet</span>Hub
        </span>
      </div>
      <div className="space-x-4">
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
      </div>
    </header>
  );
}
