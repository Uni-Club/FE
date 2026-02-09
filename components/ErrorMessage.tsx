import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative flex items-center gap-3" role="alert">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="block sm:inline flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-shrink-0 text-sm font-medium text-red-700 hover:text-red-800 underline underline-offset-2 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
