export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[4/5] bg-gray-200" />
        <div className="flex flex-col gap-4">
          <div className="h-3 w-16 bg-gray-200" />
          <div className="h-8 w-3/4 bg-gray-200" />
          <div className="h-6 w-24 bg-gray-200 mt-2" />
          <div className="h-5 w-14 bg-gray-200 mt-4" />
          <div className="h-16 w-full bg-gray-200 mt-4" />
          <div className="h-12 w-full bg-gray-200 mt-4" />
          <div className="h-12 w-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
