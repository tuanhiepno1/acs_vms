import { useMemo, useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { StatBar } from '../components/StatBar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  AlertCircle,
  Camera,
  Building2,
  RotateCcw,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { accessLogs, devices, dashboardStats, facePhotos } from '../data/staticData';
import { formatTimeAgo } from '../lib/date';
import { FaceScanOverlay } from '../components/FaceScanOverlay';

interface AccessEvent {
  id: string;
  userName: string;
  deviceName: string;
  branchName: string;
  status: 'granted' | 'denied';
  confidence?: number;
  timestamp: Date;
  reason?: string;
  facePhotoUrl?: string;
}

export function Dashboard() {
  const [accessEvents, setAccessEvents] = useState<AccessEvent[]>(() => {
    return accessLogs.map((log) => ({
      id: log.id,
      userName: log.userName,
      deviceName: log.deviceName,
      branchName: log.branch,
      status: log.status,
      confidence: log.confidence,
      timestamp: new Date(log.timestamp),
      facePhotoUrl: facePhotos[log.userName],
    }));
  });

  const deviceSummary = useMemo(
    () => ({
      total: devices.length,
      online: devices.filter(d => d.status === 'online').length,
      warning: devices.filter(d => d.status === 'warning' || d.status === 'maintenance').length,
      offline: devices.filter(d => d.status === 'offline').length,
    }),
    [],
  );

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      const people = [
        { name: 'David Wilson', photo: facePhotos['David Wilson'] },
        { name: 'Jennifer Martinez', photo: facePhotos['Jennifer Martinez'] },
        { name: 'Robert Thomas', photo: facePhotos['Robert Thomas'] },
        { name: 'Maria Garcia', photo: facePhotos['Maria Garcia'] },
        { name: 'John Smith', photo: facePhotos['John Smith'] },
        { name: 'Sarah Johnson', photo: facePhotos['Sarah Johnson'] },
        { name: 'Emily Davis', photo: facePhotos['Emily Davis'] },
        { name: 'Lisa Anderson', photo: facePhotos['Lisa Anderson'] },
      ];
      const randomDevices = ['HQ Main Door Camera', 'HQ Sub Door Camera', 'Cartersville Door Camera', 'Manteca Door Camera', 'Savannah Door Camera', 'Vietnam Office Door Camera'];
      const randomBranches = ['Headquarters', 'Cartersville', 'Manteca', 'Savannah', 'Vietnam Office'];
      const randomStatus: ('granted' | 'denied')[] = ['granted', 'granted', 'granted', 'denied'];

      const person = people[Math.floor(Math.random() * people.length)];
      const status = randomStatus[Math.floor(Math.random() * randomStatus.length)];

      const newEvent: AccessEvent = {
        id: Date.now().toString(),
        userName: person.name,
        deviceName: randomDevices[Math.floor(Math.random() * randomDevices.length)],
        branchName: randomBranches[Math.floor(Math.random() * randomBranches.length)],
        status,
        confidence: status === 'granted' ? 0.85 + Math.random() * 0.14 : 0.15 + Math.random() * 0.35,
        timestamp: new Date(),
        facePhotoUrl: person.photo,
      };

      setAccessEvents((prev) => [newEvent, ...prev]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const stats = {
    totalToday: dashboardStats.totalAccessEvents,
    granted: dashboardStats.grantedAccess,
    denied: dashboardStats.deniedAccess,
  };

  const timeFormatter = useMemo(() => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const hour12 = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hour12 ?? false;
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12,
    });
  }, []);

  const [selectedEventId, setSelectedEventId] = useState<string>(() => accessEvents[0]?.id ?? '');
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!selectedEventId && accessEvents[0]?.id) {
      setSelectedEventId(accessEvents[0].id);
    }
  }, [accessEvents, selectedEventId]);

  const selectedEvent = useMemo(
    () => accessEvents.find((e) => e.id === selectedEventId) ?? accessEvents[0],
    [accessEvents, selectedEventId],
  );

  const [selectedDateTime, setSelectedDateTime] = useState<string>('');
  const [jumpTime, setJumpTime] = useState<string>('');
  const todayIso = useMemo(() => {
    const d = new Date();
    // YYYY-MM-DD
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);
  const selectedDateValue = selectedDateTime || todayIso;

  const timelineScrollRef = useRef<HTMLDivElement | null>(null);
  const timelineItemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const findClosestEventByLocalTime = (timeStr: string) => {
    // "HH:MM" or "HH:MM:SS"
    const match = timeStr.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) return null;
    const h = Number(match[1]);
    const m = Number(match[2]);
    const s = Number(match[3] ?? '0');
    const target = h * 3600 + m * 60 + s;

    let best: { id: string; diff: number } | null = null;
    for (const e of accessEvents) {
      const t = e.timestamp;
      const seconds = t.getHours() * 3600 + t.getMinutes() * 60 + t.getSeconds();
      const diff = Math.abs(seconds - target);
      if (!best || diff < best.diff) {
        best = { id: e.id, diff };
      }
    }
    return best?.id ?? null;
  };

  const scrollToEvent = (eventId: string) => {
    const el = timelineItemRefs.current[eventId];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Dashboard</h1>
          <p className="text-slate-400 text-sm">
            Real-time access monitoring across all locations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-slate-800 text-slate-100 hover:bg-slate-800">
            Today: {todayIso}
          </Badge>
          <Input
            type="date"
            value={selectedDateValue}
            onChange={(e) => setSelectedDateTime(e.target.value)}
            className="picker-dark w-[190px] bg-slate-800 border-slate-600 text-slate-100 shadow-inner"
          />
        </div>
      </div>

      <StatBar items={[
        { label: 'Total', value: stats.totalToday },
        { label: 'Granted', value: stats.granted, color: 'green' },
        { label: 'Denied', value: stats.denied, color: 'red' },
        { label: 'Devices', value: `${deviceSummary.online}/${deviceSummary.total} online`, color: 'blue' },
      ]} />

      <div className="grid grid-cols-1 gap-4 flex-1 min-h-0">
        {/* Live Access Events + Face Snapshot (paired rows) */}
        <Card className="bg-slate-900 border-slate-800 flex flex-col min-h-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Live Activity</CardTitle>
                <CardDescription className="text-slate-400">
                  Click an event to view image and details
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-500">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <div className="h-full min-h-0 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-slate-500 text-sm">
                  Showing <span className="text-slate-300">{accessEvents.length}</span> events
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-slate-500 text-sm">
                    Hover + mouse wheel to scroll
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-slate-400 text-sm">Jump to</div>
                    <Input
                      type="time"
                      step={1}
                      value={jumpTime}
                      onChange={(e) => {
                        const v = e.target.value;
                        setJumpTime(v);
                        const id = findClosestEventByLocalTime(v);
                        if (!id) return;
                        setSelectedEventId(id);
                        scrollToEvent(id);
                      }}
                      className="picker-dark w-[160px] bg-slate-800 border-slate-600 text-slate-100 tabular-nums shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setJumpTime('');
                        if (timelineScrollRef.current) {
                          timelineScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                        }
                      }}
                      className="inline-flex items-center justify-center size-9 rounded-md border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
                      aria-label="Reset time"
                      title="Reset time"
                    >
                      <RotateCcw className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Horizontal timeline */}
              <div className="relative flex-1 min-h-0">
                <div className="absolute left-0 right-0 top-4 h-px bg-slate-800" />

                <div
                  ref={timelineScrollRef}
                  className="hide-scrollbar h-full min-h-0 overflow-x-auto overflow-y-hidden pb-2"
                  onWheel={(e) => {
                    // Convert vertical wheel to horizontal scroll when hovering the timeline
                    if (!timelineScrollRef.current) return;
                    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
                    e.preventDefault();
                    timelineScrollRef.current.scrollLeft += e.deltaY;
                  }}
                >
                  <div className="min-w-max h-full flex items-stretch gap-4 pr-3">
                    {accessEvents.map((event) => {
                      const isSelected = event.id === selectedEventId;
                      const statusDot =
                        event.status === 'granted' ? 'bg-green-500' : 'bg-red-500';

                      return (
                        <div
                          key={event.id}
                          ref={(el) => {
                            timelineItemRefs.current[event.id] = el;
                          }}
                          className="w-[320px] shrink-0 h-full flex flex-col"
                        >
                          {/* timeline dot */}
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={cn(
                                'size-2 rounded-full ring-4 ring-slate-900',
                                statusDot,
                              )}
                            />
                            <div className="text-slate-300 text-sm tabular-nums">
                              {timeFormatter.format(event.timestamp)}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEventId(event.id);
                              setDetailsOpen(true);
                            }}
                            className={cn(
                              'flex-1 min-h-[308px] rounded-2xl border overflow-hidden bg-slate-950 cursor-pointer',
                              isSelected ? 'border-blue-600/50 ring-1 ring-blue-600/20' : 'border-slate-800',
                            )}
                          >
                            {event.facePhotoUrl ? (
                              <FaceScanOverlay
                                photoUrl={event.facePhotoUrl}
                                name={event.userName}
                                status={event.status}
                                confidence={event.confidence}
                                timestamp={timeFormatter.format(event.timestamp)}
                                deviceName={event.deviceName}
                                className="h-full w-full rounded-2xl"
                              />
                            ) : (
                              <div className="h-full bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 flex items-center justify-center">
                                <div className="flex flex-col items-center text-slate-400">
                                  <Camera className="size-7 mb-1" />
                                  <div className="text-sm">No capture</div>
                                </div>
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details popup */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Access Event Details</DialogTitle>
            <DialogDescription className="text-slate-400">
              Review face snapshot and event metadata
            </DialogDescription>
          </DialogHeader>

          {selectedEvent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                {selectedEvent.facePhotoUrl ? (
                  <FaceScanOverlay
                    photoUrl={selectedEvent.facePhotoUrl}
                    name={selectedEvent.userName}
                    status={selectedEvent.status}
                    confidence={selectedEvent.confidence}
                    timestamp={timeFormatter.format(selectedEvent.timestamp)}
                    deviceName={selectedEvent.deviceName}
                    className="h-[420px] w-full"
                  />
                ) : (
                  <div className="h-[420px] bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 flex items-center justify-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <Camera className="size-10 mb-2" />
                      <div className="text-sm">No capture</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-white truncate">{selectedEvent.userName}</div>
                  <Badge
                    className={cn(
                      selectedEvent.status === 'granted'
                        ? 'bg-green-600 text-white hover:bg-green-600'
                        : 'bg-red-600 text-white hover:bg-red-600'
                    )}
                  >
                    {selectedEvent.status === 'granted' ? 'Granted' : 'Denied'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3 text-slate-300">
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
                    <div className="text-slate-400">Time</div>
                    <div className="tabular-nums text-slate-200">
                      {timeFormatter.format(selectedEvent.timestamp)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
                    <div className="text-slate-400">Device</div>
                    <div className="text-slate-200 truncate">{selectedEvent.deviceName}</div>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
                    <div className="text-slate-400">Branch</div>
                    <div className="text-slate-200 truncate">{selectedEvent.branchName}</div>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                    <div className="text-slate-400 mb-1">Relative time</div>
                    <div className="text-slate-200">{formatTimeAgo(selectedEvent.timestamp)}</div>
                  </div>

                  {selectedEvent.reason ? (
                    <div className="rounded-lg border border-red-900/40 bg-red-950/30 p-3 text-red-200">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="size-4 text-red-400" />
                        <div className="text-red-300">Reason</div>
                      </div>
                      <div className="text-red-200">{selectedEvent.reason}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
