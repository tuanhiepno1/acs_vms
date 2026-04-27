import { AlertTriangle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { Button } from './ui/button';

export function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Something went wrong';
  let description = 'The page could not be loaded. Try refreshing or go back to a safe page.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    description =
      typeof error.data === 'string' && error.data.trim()
        ? error.data
        : 'The requested page returned an unexpected response.';
  } else if (error instanceof Error && error.message) {
    description = error.message;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <AlertTriangle className="size-7" />
        </div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate(-1)} variant="outline" className="gap-2 border-slate-700 text-slate-200 hover:bg-slate-800">
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
          <Button onClick={() => window.location.reload()} className="gap-2 bg-white text-slate-900 hover:bg-slate-100">
            <RefreshCcw className="size-4" />
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}
