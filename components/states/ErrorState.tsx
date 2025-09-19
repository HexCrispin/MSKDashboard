import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function ErrorState({ error, onRetry, isRetrying = false }: ErrorStateProps) {
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <AlertCircle
                aria-hidden="true"
                className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold mb-2">Unable to Load Suggestions</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={onRetry}
                  disabled={isRetrying}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isRetrying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw
                        aria-hidden="true"
                        className="w-4 h-4"
                      />
                      Try Again
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
