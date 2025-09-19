interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading suggestions..." }: LoadingStateProps) {
  return (
    <div className="font-sans min-h-screen">
      <div className="sticky top-0 bg-background z-10 border-b border-border px-4 py-3 sm:p-20 sm:pb-6">
        <div className="w-full">
          <header>
            <h1 className="text-2xl font-bold">MSK Suggestion Management Board</h1>
          </header>
        </div>
      </div>
      <main className="px-4 py-3 sm:p-20 sm:pt-6">
        <div className="w-full">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>{message}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
