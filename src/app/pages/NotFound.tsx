import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <Card className="max-w-md mx-auto bg-slate-900 border-slate-800">
        <CardHeader className="text-center">
          <div className="size-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 font-bold">404</span>
          </div>
          <CardTitle className="text-white">Page Not Found</CardTitle>
          <CardDescription className="text-slate-400">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button variant="outline" asChild className="gap-2 border-slate-700 text-slate-200">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild className="gap-2 bg-white text-slate-800 hover:bg-slate-100">
            <Link to="/">
              <Home className="size-4" />
              Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
