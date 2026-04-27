import { Video, Clock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function ComingSoon() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-600/20 blur-3xl rounded-full" />
            <div className="relative flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-violet-700 shadow-2xl shadow-violet-600/30">
              <Video className="size-12 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          Video Management System
        </h1>
        <p className="text-xl text-slate-400 mb-12 max-w-lg mx-auto">
          Advanced video surveillance, AI-powered analytics, and intelligent monitoring solutions are on the way.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur">
            <div className="flex justify-center mb-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-violet-600/20">
                <Video className="size-6 text-violet-400" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Live Monitoring</h3>
            <p className="text-slate-400 text-sm">Real-time camera feeds with multi-view support</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur">
            <div className="flex justify-center mb-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600/20">
                <Clock className="size-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Smart Recording</h3>
            <p className="text-slate-400 text-sm">AI-triggered recording with cloud storage</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur">
            <div className="flex justify-center mb-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-600/20">
                <Mail className="size-6 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">Alert System</h3>
            <p className="text-slate-400 text-sm">Instant notifications for security events</p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
          <p className="text-slate-400 mb-6">Get notified when we launch</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Button className="gap-2 bg-violet-600 text-white hover:bg-violet-700">
              Notify Me
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowRight className="size-4 mr-2 rotate-180" />
          Back to Hub
        </Button>
      </div>
    </div>
  );
}
