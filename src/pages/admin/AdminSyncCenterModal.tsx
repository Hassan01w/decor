import React, { useState, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  Radio, 
  Download, 
  Upload, 
  Wrench, 
  Trash2, 
  X, 
  Clock, 
  HardDrive, 
  Activity, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface AdminSyncCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSyncCenterModal: React.FC<AdminSyncCenterModalProps> = ({ isOpen, onClose }) => {
  const { 
    syncNow, 
    purgeAndRepairDatabase, 
    exportDatabase, 
    importDatabase, 
    getSyncDiagnosticInfo, 
    activityLogs, 
    clearActivityLogs,
    showToast 
  } = useBlog();

  const [diagnostic, setDiagnostic] = useState(getSyncDiagnosticInfo());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  useEffect(() => {
    if (isOpen) {
      setDiagnostic(getSyncDiagnosticInfo());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleForceSync = () => {
    setIsSyncing(true);
    syncNow();
    setTimeout(() => {
      setDiagnostic(getSyncDiagnosticInfo());
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString());
      showToast('All open tabs and storefront views synchronized instantly.', 'success');
    }, 600);
  };

  const handleDeepRepair = () => {
    setIsRepairing(true);
    setTimeout(() => {
      const res = purgeAndRepairDatabase();
      setDiagnostic(getSyncDiagnosticInfo());
      setIsRepairing(false);
      showToast(res.message, 'success');
    }, 500);
  };

  const handleExport = () => {
    const jsonStr = exportDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decor-diary-full-snapshot-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Complete snapshot downloaded successfully.', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDatabase(content);
        if (ok) {
          setDiagnostic(getSyncDiagnosticInfo());
          showToast('Database snapshot restored and synchronized.', 'success');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#D9CFC4] flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#1A1816] text-white flex items-center justify-between border-b border-[#2E2925]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8C6D53] flex items-center justify-center text-white shadow-md">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                  Live Sync & System Diagnostics
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-[#A89F95] mt-0.5">
                Real-time BroadcastChannel bridge between Admin CMS and Storefront Visitors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#A89F95] hover:text-white hover:bg-[#2E2925] transition-colors cursor-pointer"
            title="Close diagnostics"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-[#E8DFD5] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#8A7E73]">
                <span>Broadcast Channel</span>
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-[#2D2A26] mt-1 font-mono truncate">
                {diagnostic.channelName}
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> 0ms Cross-Tab Sync
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#E8DFD5] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#8A7E73]">
                <span>Storage Quota</span>
                <HardDrive className="w-3.5 h-3.5 text-[#8C6D53]" />
              </div>
              <p className="text-sm font-bold text-[#2D2A26] mt-1">
                ~{diagnostic.storageQuotaUsedKb} KB
              </p>
              <span className="text-[10px] text-[#8A7E73] mt-0.5 block">
                &lt; 2% of browser quota
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#E8DFD5] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#8A7E73]">
                <span>Synced Entities</span>
                <Database className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-[#2D2A26] mt-1">
                {diagnostic.totalPosts + diagnostic.totalCategories + diagnostic.totalMedia} items
              </p>
              <span className="text-[10px] text-[#8A7E73] mt-0.5 block truncate">
                {diagnostic.totalPosts} Posts • {diagnostic.totalCategories} Cats
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#E8DFD5] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#8A7E73]">
                <span>Last Broadcast</span>
                <Clock className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <p className="text-sm font-bold text-[#2D2A26] mt-1">
                {lastSyncTime}
              </p>
              <span className="text-[10px] text-purple-700 font-semibold mt-0.5 block">
                Heartbeat every 15s
              </span>
            </div>
          </div>

          {/* Quick Actions Action Bar */}
          <div className="p-4 bg-white rounded-xl border border-[#E8DFD5] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7E73] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#8C6D53]" />
              Diagnostic Actions & Multi-Tab Synchronization
            </h3>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleForceSync}
                disabled={isSyncing}
                className="px-4 py-2 bg-[#8C6D53] hover:bg-[#735841] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronizing...' : 'Force Sync All Tabs Now'}</span>
              </button>

              <button
                onClick={handleDeepRepair}
                disabled={isRepairing}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                title="Verify post categories and integrity"
              >
                <Wrench className={`w-3.5 h-3.5 ${isRepairing ? 'animate-spin' : ''}`} />
                <span>Deep Data Integrity Check</span>
              </button>

              <button
                onClick={handleExport}
                className="px-4 py-2 bg-white hover:bg-[#F7F4EF] text-[#2D2A26] border border-[#D9CFC4] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#8C6D53]" />
                <span>Export Snapshot JSON</span>
              </button>

              <label className="px-4 py-2 bg-white hover:bg-[#F7F4EF] text-[#2D2A26] border border-[#D9CFC4] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#8C6D53]" />
                <span>Restore Backup File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Activity Logs & Audit Stream */}
          <div className="p-4 bg-white rounded-xl border border-[#E8DFD5] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7E73] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Live System & Editorial Audit Log ({activityLogs.length})
              </h3>
              {activityLogs.length > 0 && (
                <button
                  onClick={clearActivityLogs}
                  className="text-[11px] text-[#A89F95] hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Logs</span>
                </button>
              )}
            </div>

            <div className="divide-y divide-[#F0EAE1] max-h-48 overflow-y-auto pr-1">
              {activityLogs.length === 0 ? (
                <p className="text-xs text-[#A89F95] py-4 text-center">No recent activity logged yet.</p>
              ) : (
                activityLogs.slice(0, 15).map((log) => (
                  <div key={log.id} className="py-2 flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        log.type === 'post' ? 'bg-blue-500' :
                        log.type === 'category' ? 'bg-amber-500' :
                        log.type === 'comment' ? 'bg-emerald-500' :
                        log.type === 'settings' ? 'bg-purple-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <span className="font-semibold text-[#2D2A26]">{log.action}</span>
                        <p className="text-[#8A7E73] text-[11px] leading-snug">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#A89F95] font-mono block">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[9px] text-[#8C6D53] font-medium block">
                        {log.user}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F2ECE4] border-t border-[#D9CFC4] flex items-center justify-between text-xs text-[#8A7E73]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Automatic background sync active across all client instances
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2D2A26] hover:bg-[#1A1816] text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
