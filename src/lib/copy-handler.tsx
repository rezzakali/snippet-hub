import { toast } from 'sonner';

export const copyHandler = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  } catch (error) {
    toast.error(`Failed to copy to clipboard: ${error}`);
  }
};
