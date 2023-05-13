"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body className="border-box scroll-smooth flex flex-col p-0 m-0 text-gray-800 bg-slate-100 dark:bg-slate-900">
        <main className="relative min-h-screen flex-grow p-0 overflow-y-auto">
          <h2>Something went wrong!</h2>
          <button onClick={() => reset()}>Try again</button>
        </main>
      </body>
    </html>
  );
}
