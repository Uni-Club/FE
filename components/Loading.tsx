export default function Loading({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      {text && (
        <p className="text-sm text-slate-500">{text}</p>
      )}
    </div>
  );
}
