'use client';

import { useTheme } from '@/components/ui/theme-provider';
import Image from 'next/image';

const PreviewImage = () => {
  const { theme } = useTheme();

  return (
    <Image
      src={theme === 'dark' ? '/preview-dark.png' : '/preview.png'}
      alt="Snippet preview"
      width={800}
      height={400}
      className="rounded-lg shadow-lg mx-auto"
    />
  );
};

export default PreviewImage;
