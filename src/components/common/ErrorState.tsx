import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
  onReset: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage,
  onRetry,
  onReset,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto my-12 animate-in fade-in duration-200">
      <Card padding="lg" className="border-rose-200 bg-rose-50/30 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Research Pipeline Notice
        </h3>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
          {errorMessage || 'Unable to complete query research at this time. Please check your query syntax and try again.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onReset}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Clear & Try Another Query
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Retry Search
          </Button>
        </div>
      </Card>
    </div>
  );
};
