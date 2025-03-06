import SnippetCardSkeleton from '@/components/ui/snippet-skeleton';

const loading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {[...Array(4)].map((_, index) => (
        <SnippetCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default loading;
