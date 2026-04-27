import { Camera, DoorOpen } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { devices, doors } from '../data/staticData';
import { Devices } from './Devices';
import DoorManagement from './DoorManagement';

export default function AccessPoints() {
  return (
    <Tabs defaultValue="devices" className="h-full flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-white mb-0.5 text-xl font-bold">Access Points</h1>
          <p className="text-slate-400 text-sm">Manage face-scan devices and door access controls</p>
        </div>

        <TabsList className="bg-slate-800/60 border border-slate-700/50 self-start sm:self-auto">
          <TabsTrigger
            value="devices"
            className="gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
          >
            <Camera className="size-4" />
            Devices
            <Badge variant="outline" className="ml-0.5 h-5 min-w-5 justify-center border-slate-600 bg-slate-800/80 text-[11px] text-slate-300 px-1.5">
              {devices.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="doors"
            className="gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
          >
            <DoorOpen className="size-4" />
            Doors
            <Badge variant="outline" className="ml-0.5 h-5 min-w-5 justify-center border-slate-600 bg-slate-800/80 text-[11px] text-slate-300 px-1.5">
              {doors.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="devices" className="flex-1 min-h-0">
        <Devices />
      </TabsContent>
      <TabsContent value="doors" className="flex-1 min-h-0">
        <DoorManagement />
      </TabsContent>
    </Tabs>
  );
}
