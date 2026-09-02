export default function ShopLoading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mb-12 md:mb-16 animate-pulse">
        <div className="h-40 md:h-56 w-full bg-gray-100" />
      </div>
      <div className="w-full px-8 pb-24 md:pb-32">
        <div className="flex gap-2 flex-wrap mb-8 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-gray-100" />
          ))}
        </div>
        <div className="flex gap-10">
          <aside className="w-72 shrink-0 hidden md:block animate-pulse">
            <div className="space-y-6">
              <div className="h-4 w-32 bg-gray-100" />
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-3 w-full bg-gray-100" />
              ))}
            </div>
          </aside>
          <div className="flex-1 min-w-0">
            <div className="mb-6 animate-pulse">
              <div className="h-4 w-40 bg-gray-100 ml-auto" />
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-x-2 md:gap-x-6 gap-y-10 animate-pulse">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <div className="aspect-[4/5] md:aspect-square w-full bg-gray-100" />
                  <div className="mt-2.5 h-3 w-16 bg-gray-100" />
                  <div className="mt-2 h-4 w-3/4 bg-gray-100" />
                  <div className="mt-2 h-5 w-20 bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}