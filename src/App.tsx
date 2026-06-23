import React, { useState, useEffect } from "react";
import { UserRole, LoggedPerson } from "./types";
import LandingScreen from "./components/LandingScreen";
import LoginScreen from "./components/LoginScreen";
import CameraModule from "./components/CameraModule";
import ProfileSettings from "./components/ProfileSettings";
import { 
  Users, 
  LogOut, 
  Sparkles, 
  CheckCircle,
  Eye,
  Video,
  User as UserIcon,
  Shield,
  Settings,
  History,
  Sliders,
  Copy,
  Check,
  TrendingUp,
  Download,
  Trash2,
  PieChart
} from "lucide-react";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("teacher");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [activeView, setActiveView] = useState<"tracker" | "profile">("tracker");

  // Scan state configuration
  const [latestScan, setLatestScan] = useState<{
    count: number;
    people: LoggedPerson[];
    confidence?: number;
    summary: string;
    isEmulated: boolean;
    imageSrc: string;
  } | null>(null);

  // --- NEW EXTREMELY UNIQUE PREMIUM ADDITIONS ---
  // Load History from localStorage on load
  const [scanHistory, setScanHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("piq_scan_history_v1");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Target expected capacity (default 10)
  const [targetCapacity, setTargetCapacity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("piq_target_capacity_v1");
      return saved ? parseInt(saved, 10) : 10;
    } catch (e) {
      return 10;
    }
  });

  const [copiedIndicator, setCopiedIndicator] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  // Auto load active user from localStorage if exists
  useEffect(() => {
    const cachedUser = localStorage.getItem("piq_cached_user");
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUserRole(parsed.role);
        setUserEmail(parsed.email);
        setUserName(parsed.name);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem("piq_cached_user");
      }
    }
  }, []);

  const handleLoginSuccess = (role: UserRole, email: string, name: string) => {
    setUserRole(role);
    setUserEmail(email);
    setUserName(name);
    setIsAuthenticated(true);
    localStorage.setItem("piq_cached_user", JSON.stringify({ role, email, name }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("piq_cached_user");
    setLatestScan(null);
  };

  const handleScanResult = (result: typeof latestScan) => {
    setLatestScan(result);
    // Auto-save successful scans to local history
    if (result && result.count > 0) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
      
      const newHistoryItem = {
        id: "scan_" + Date.now(),
        timestamp: `${dateStr}, ${timeStr}`,
        count: result.count,
        people: result.people,
        summary: result.summary,
        isEmulated: result.isEmulated,
        imageSrc: result.imageSrc,
        roomName: "Sensing Area B",
        className: userRole === "teacher" ? "Lecturers Forum" : "Active Study Session"
      };

      setScanHistory(prev => {
        // Avoid adding duplicate frames consecutively
        if (prev.length > 0 && prev[0].imageSrc === result.imageSrc && prev[0].count === result.count) {
          return prev;
        }
        const updated = [newHistoryItem, ...prev].slice(0, 10);
        localStorage.setItem("piq_scan_history_v1", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleRestoreFromHistory = (item: any) => {
    setLatestScan({
      count: item.count,
      people: item.people,
      summary: item.summary,
      isEmulated: item.isEmulated ?? false,
      imageSrc: item.imageSrc
    });
    setSelectedHistoryId(item.id);
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem("piq_scan_history_v1");
    setSelectedHistoryId(null);
  };

  const handleRemoveHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setScanHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem("piq_scan_history_v1", JSON.stringify(updated));
      return updated;
    });
    if (selectedHistoryId === id) {
      setSelectedHistoryId(null);
    }
  };

  // --- DYNAMIC SPATIAL & DEMOGRAPHIC ANALYTICS MATHS ---
  const totalCount = latestScan ? latestScan.count : 0;
  
  // Teachers vs Students Ratio
  const teacherCount = latestScan ? latestScan.people.filter(p => 
    (p.label && p.label.toLowerCase().includes("teacher")) || 
    (p.description && p.description.toLowerCase().includes("teacher"))
  ).length : 0;
  const studentCount = Math.max(0, totalCount - teacherCount);

  // Left vs Right Spatial Distribution (X limit split at 50)
  const leftCount = latestScan ? latestScan.people.filter(p => p.x <= 50).length : 0;
  const rightCount = latestScan ? latestScan.people.filter(p => p.x > 50).length : 0;
  const leftPerc = totalCount > 0 ? Math.round((leftCount / totalCount) * 100) : 50;
  const rightPerc = totalCount > 0 ? 100 - leftPerc : 50;

  // Front vs Back Spatial Distribution (Y limit split at 50)
  const frontCount = latestScan ? latestScan.people.filter(p => p.y <= 50).length : 0;
  const backCount = latestScan ? latestScan.people.filter(p => p.y > 50).length : 0;
  const frontPerc = totalCount > 0 ? Math.round((frontCount / totalCount) * 100) : 50;
  const backPerc = totalCount > 0 ? 100 - frontPerc : 50;

  // Capacity Threshold Evaluation status object
  const capacityStatus = (() => {
    if (totalCount === 0) return { label: "Awaiting scan...", color: "text-slate-400 bg-slate-500/10 border-slate-500/20", progressColor: "bg-slate-700" };
    if (totalCount === targetCapacity) {
      return { 
        label: "🎯 Expected Attendance Met", 
        color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25", 
        progressColor: "bg-emerald-500" 
      };
    } else if (totalCount < targetCapacity) {
      const diff = targetCapacity - totalCount;
      return { 
        label: `⚠️ Under Expected Capacity (Missing ${diff})`, 
        color: "text-amber-400 bg-amber-500/15 border-amber-500/25", 
        progressColor: "bg-amber-400" 
      };
    } else {
      const overflow = totalCount - targetCapacity;
      return { 
        label: `🚨 Capacity Overflow (Exceeded by ${overflow})`, 
        color: "text-rose-400 bg-rose-500/15 border-rose-500/25", 
        progressColor: "bg-rose-500" 
      };
    }
  })();

  // Plain Text formatted corporate report compiler
  const attendanceReport = (() => {
    if (!latestScan) return "";
    const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    
    let report = `--- PRESENCEIQ SEATING & ATTENDANCE REPORT ---\n`;
    report += `Timestamp: ${dateStr}, ${timeStr} | Venue: Sensing Area B\n`;
    report += `Assigned Class: ${userRole === "teacher" ? "Lecturers Forum" : "Active Study Session"}\n`;
    report += `--------------------------------------------------\n`;
    report += `Expected Target: ${targetCapacity} Attendees\n`;
    report += `Present Active Count: ${totalCount} Participants (${capacityStatus.label})\n`;
    report += `Demographics: ${studentCount} Students, ${teacherCount} Teachers\n`;
    report += `Spatial Distribution Split:\n`;
    report += `  - Horizontal Split: Left Wing ${leftPerc}% | Right Wing ${rightPerc}%\n`;
    report += `  - Row Depth Split: Front Seats ${frontPerc}% | Back Seats ${backPerc}%\n`;
    report += `--------------------------------------------------\n`;
    report += `Detected Participant coordinates:\n`;
    
    latestScan.people.forEach((p, idx) => {
      report += `  [#${idx + 1}] Type: ${p.label || "Student"} | Position: Left-Right ${p.x}%, Vert-Depth ${p.y}%\n`;
    });
    
    if (latestScan.summary) {
      report += `\nOccupancy Cognitive Remarks: ${latestScan.summary}\n`;
    }
    report += `--------------------------------------------------`;
    return report;
  })();

  const handleCopyReport = () => {
    if (!attendanceReport) return;
    navigator.clipboard.writeText(attendanceReport).then(() => {
      setCopiedIndicator(true);
      setTimeout(() => setCopiedIndicator(false), 2000);
    });
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!latestScan) return;
    
    const targetElement = e.target as HTMLElement;
    if (targetElement.closest(".pin-marker")) {
      return; 
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));

    const newPerson = {
      x: boundedX,
      y: boundedY,
      label: `Student #${latestScan.people.length + 1}`
    };

    const updatedPeople = [...latestScan.people, newPerson];
    setLatestScan({
      ...latestScan,
      people: updatedPeople,
      count: updatedPeople.length,
      summary: `Manual adjustment applied: Added student coordinate. Total present count updated to ${updatedPeople.length}.`
    });
  };

  const handleRemovePin = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!latestScan) return;

    const updatedPeople = latestScan.people.filter((_, idx) => idx !== indexToRemove);
    setLatestScan({
      ...latestScan,
      people: updatedPeople,
      count: updatedPeople.length,
      summary: `Manual adjustment applied: Removed student coordinate. Total present count updated to ${updatedPeople.length}.`
    });
  };

  if (showSplash) {
    return <LandingScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <div 
      id="presence-iq-premium-viewport"
      className="min-h-screen bg-[#0A0A0B] text-[#E0E0E0] font-sans flex flex-col selection:bg-[#C0A080] selection:text-black overflow-y-auto"
    >
      
      {/* Sophisticated Dark Header */}
      <nav id="nav-system" className="h-20 border-b border-white/10 flex items-center justify-between px-6 md:px-10 bg-[#0D0D0E] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3A3A40] to-[#1A1A1D] border border-white/20 rounded-lg flex items-center justify-center font-serif text-xl font-bold tracking-tighter text-[#C0A080] shadow-[0_0_15px_rgba(192,160,128,0.1)]">
            PIQ
          </div>
          <div>
            <span className="text-xl font-serif tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60">
              PresenceIQ
            </span>
          </div>
        </div>

        {/* User Badge Profile summary */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView(activeView === "profile" ? "tracker" : "profile")}
            className="group/badge text-left flex items-center gap-3 hover:bg-white/5 border border-transparent hover:border-white/5 p-2 rounded-xl transition-all duration-200 cursor-pointer"
            title="Edit User profile settings"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C0A080]/30 to-black border border-[#C0A080]/40 flex items-center justify-center font-serif text-xs font-bold text-[#C0A080] group-hover/badge:border-white transition-all">
              {userName.substring(0, 1).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] uppercase tracking-widest text-[#C0A080] font-mono leading-none mb-1">
                {userRole === "teacher" ? "Faculty Panel" : "Student Portal"}
              </span>
              <span className="text-xs font-medium text-white flex items-center gap-1.5 leading-none">
                {userName}
                <span className={`w-1.5 h-1.5 rounded-full ${userRole === "teacher" ? "bg-amber-400" : "bg-cyan-400"} animate-pulse`} />
              </span>
              <span className="text-[9px] text-white/40 leading-none mt-1">{userEmail}</span>
            </div>
          </button>

          <div className="h-8 w-[1px] bg-white/10" />

          {/* Logout Action Button */}
          <button
            onClick={handleLogout}
            id="nav-logout-btn"
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-rose-950/40 hover:border-rose-900/40 hover:text-rose-400 transition-all duration-250 cursor-pointer"
            title="Sign out of current account"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Main Single-View Constraint: Camera centered on screen */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 max-w-5xl w-full mx-auto">
        {activeView === "profile" ? (
          <ProfileSettings
            initialName={userName}
            initialEmail={userEmail}
            initialRole={userRole}
            onBack={() => setActiveView("tracker")}
            onSave={(name, email, role) => {
              setUserName(name);
              setUserEmail(email);
              setUserRole(role);
              localStorage.setItem("piq_cached_user", JSON.stringify({ name, email, role }));
            }}
          />
        ) : (
          <div className="w-full flex flex-col gap-6" id="dashboard-center">
          
          {/* Header context info bar */}
          <div className="text-center max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-[#C0A080] font-mono mb-3">
              <Video className="w-3.5 h-3.5 text-[#C0A080]" />
              <span>Smart Occupancy Analyzer</span>
            </div>
            <h2 className="text-3xl font-serif text-white tracking-tight">Center Occupancy Counter</h2>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Use your live webcam stream or upload a classroom photograph file. PresenceIQ will automatically isolate and count human coordinates in real-time.
            </p>
          </div>

          {/* Interactive Screen Container */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Center Grid: Left column holds the Camera scanning element */}
            <div className="md:col-span-7 flex flex-col">
              <CameraModule 
                onScanResult={handleScanResult} 
                currentClass={userRole === "teacher" ? "Lecturers Forum" : "Active Study Session"}
                currentRoom="Sensing Area B"
              />
            </div>

            {/* Right column holds the spatial results and visual feedback overlay */}
            <div className="md:col-span-5 flex flex-col bg-[#121214] border border-white/10 rounded-2xl p-5 md:p-6 relative overflow-hidden h-full min-h-[350px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C0A080] opacity-5 blur-3xl rounded-full" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C0A080]" />
                    <span>Presence IQ Overlay Mapping</span>
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">Real-time coordinate recognition</p>
                </div>

                {latestScan && (
                  <span className={`px-2 py-0.5 text-[9px] font-mono rounded tracking-widest ${
                    latestScan.isEmulated ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {latestScan.isEmulated ? "SIMULATED" : "LIVE AI"}
                  </span>
                )}
              </div>

              {/* Pinpoint display preview */}
              <div className="relative flex-1 min-h-[360px] sm:min-h-[420px] md:min-h-[480px] bg-black/50 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                {latestScan ? (
                  <div 
                    className="absolute inset-0 w-full h-full cursor-crosshair group-hover:brightness-105 transition-all"
                    onClick={handleImageClick}
                    title="Click anywhere to add student marker"
                  >
                    {/* Visual target snapshot background */}
                    <img
                      src={latestScan.imageSrc}
                      alt="PresenceIQ Scan Target"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 select-none pointer-events-none"
                    />

                    {/* Laser scanner light bars */}
                    <div className="absolute inset-x-0 h-0.5 bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-[scan_3s_infinite_ease-in-out] pointer-events-none" />

                    {/* Coordinate pins */}
                    {latestScan.people.map((p, idx) => (
                      <div
                        key={idx}
                        className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center pointer-events-auto hover:scale-125 hover:brightness-125 active:scale-95 transition-all cursor-pointer pin-marker z-20 group/pin"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                        }}
                        onClick={(e) => handleRemovePin(idx, e)}
                        title="Click to remove student pin"
                      >
                        <div className="absolute inset-0 border border-amber-400 rounded-full animate-ping opacity-60 pointer-events-none" />
                        <div className="absolute inset-0.5 border-2 border-[#C0A080] bg-[#121214]/60 rounded-full opacity-100 pointer-events-none" />
                        <span className="w-1.5 h-1.5 bg-[#C0A080] rounded-full pointer-events-none" />
                        
                        {/* Inline Tag Tooltips */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/95 backdrop-blur-xs border border-white/15 text-[9px] font-mono text-white px-2 py-1 rounded opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl flex flex-col gap-0.5 min-w-[140px] max-w-[200px] text-center">
                          <span className="font-semibold text-[#C0A080] block sm:inline">{p.label || `Person #${idx + 1}`}</span>
                          {p.description && (
                            <span className="text-[8px] text-white/70 block mt-0.5 leading-snug whitespace-normal break-words">
                              {p.description}
                            </span>
                          )}
                          <span className="text-amber-300 text-[8px] block mt-1 hover:underline">
                            Click to remove pin
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center max-w-xs flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-white/30" />
                    </div>
                    <h4 className="text-white/80 text-xs font-bold font-serif">Spatial Feed Awaiting Scan</h4>
                    <p className="text-white/40 text-2xs mt-1.5 leading-relaxed">
                      Start your camera to snap a live photo or upload a classroom image to execute an AI occupancy scan!
                    </p>
                  </div>
                )}
              </div>

              {latestScan && (
                <div className="mt-2 text-[10px] text-amber-300 flex items-center justify-center gap-1.5 bg-amber-500/5 py-1 px-3 border border-amber-500/10 rounded-lg">
                  <span className="inline-block w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  <span>Interactive Map: Tap image to add missing attendees or tap existing coordinates to remove them.</span>
                </div>
              )}

              {/* Occupied Metrics Output */}
              <div className="mt-4">
                <div className="p-4 bg-white/2 border border-white/10 rounded-xl text-center">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block font-mono">Total Present Count</span>
                  <span className="text-3xl font-serif font-light text-[#C0A080] mt-1 block">
                    {latestScan ? `${latestScan.count} Attendees` : "--"}
                  </span>
                  <span className="text-[10px] text-white/40 block mt-0.5">Detected Classroom Presence Structure</span>
                </div>
              </div>

              {/* PREMIUM ADDITION 1: Capacity Threshold Gauge & Interactive Slider */}
              <div className="mt-3.5 p-4 bg-white/[0.02] border border-white/10 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Expected Capacity Target</span>
                  <span className="text-xs font-mono font-medium text-[#C0A080] bg-[#C0A080]/10 px-2 py-0.5 rounded border border-[#C0A080]/20">
                    {targetCapacity} Attendees
                  </span>
                </div>
                
                {/* Capacity slider input */}
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-white/30" />
                  <input 
                    type="range" 
                    min="1" 
                    max="24" 
                    value={targetCapacity} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setTargetCapacity(val);
                      localStorage.setItem("piq_target_capacity_v1", val.toString());
                    }}
                    className="w-full accent-[#C0A080] bg-white/10 h-1 rounded-lg range-sm cursor-col-resize scale-y-110"
                  />
                </div>

                {/* Capacity metric comparison gauge progress line */}
                {latestScan && (
                  <div className="mt-1">
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${capacityStatus.progressColor} transition-all duration-500`}
                        style={{ width: `${Math.min(100, (totalCount / targetCapacity) * 100)}%` }}
                      />
                    </div>
                    <div className={`mt-2 py-1 px-2.5 rounded text-[10px] font-mono border text-center ${capacityStatus.color}`}>
                      {capacityStatus.label}
                    </div>
                  </div>
                )}
              </div>

              {/* PREMIUM ADDITION 2: Detailed Placement & Spatial Layout Analytics */}
              {latestScan && (
                <div className="mt-3.5 p-4 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <PieChart className="w-3.5 h-3.5 text-[#C0A080]" />
                      <span>Spatial Distribution Breakdown</span>
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/10">Active</span>
                  </div>

                  {/* Demographic Split */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 bg-white/[0.01] border border-white/5 rounded-lg flex flex-col">
                      <span className="text-[9px] text-white/40 font-mono">STUDENTS</span>
                      <span className="text-sm font-serif font-medium text-[#C0A080] mt-0.5">{studentCount}</span>
                    </div>
                    <div className="p-2 bg-white/[0.01] border border-white/5 rounded-lg flex flex-col">
                      <span className="text-[9px] text-white/40 font-mono">FACULTY / TEACHER</span>
                      <span className="text-sm font-serif font-medium text-white mt-0.5">{teacherCount}</span>
                    </div>
                  </div>

                  {/* Horizontal Distribution */}
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex justify-between text-[9px] font-mono text-white/60">
                      <span>Left Side ({leftCount})</span>
                      <span>Right Side ({rightCount})</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
                      <div className="h-full bg-[#C0A080] transition-all duration-500" style={{ width: `${leftPerc}%` }} title="Left-wing density" />
                      <div className="h-full bg-white/10 transition-all duration-500" style={{ width: `${rightPerc}%` }} title="Right-wing density" />
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-white/40 mt-0.5 leading-none">
                      <span>{leftPerc}%</span>
                      <span>{rightPerc}%</span>
                    </div>
                  </div>

                  {/* Depth Distribution */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[9px] font-mono text-white/60">
                      <span>Front rows ({frontCount})</span>
                      <span>Back rows ({backCount})</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex flex">
                      <div className="h-full bg-[#C0A080] transition-all duration-500" style={{ width: `${frontPerc}%` }} title="Front-row density" />
                      <div className="h-full bg-white/10 transition-all duration-500" style={{ width: `${backPerc}%` }} title="Back-row density" />
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-white/40 mt-0.5 leading-none">
                      <span>{frontPerc}%</span>
                      <span>{backPerc}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PREMIUM ADDITION 3: Plain Format Attendance Logger & Export */}
              {latestScan && (
                <button
                  onClick={handleCopyReport}
                  className="mt-3.5 w-full py-2.5 px-4 bg-[#C0A080]/15 hover:bg-[#C0A080]/25 border border-[#C0A080]/20 hover:border-[#C0A080]/30 rounded-xl text-xs text-white flex items-center justify-center gap-2 transition-all cursor-pointer font-medium"
                >
                  {copiedIndicator ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copy Dynamic Report Success!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#C0A080]" />
                      <span>Export Structured Seating Report</span>
                    </>
                  )}
                </button>
              )}

              {/* Status Report Text */}
              {latestScan && (
                <div className="mt-3.5 p-3 rounded-xl bg-white/2 border border-white/5 text-xs text-white/70 leading-relaxed font-sans">
                  <p className="text-[10px] text-[#C0A080] uppercase font-mono tracking-wider mb-1">AI Cognitive Summary:</p>
                  {latestScan.summary}
                </div>
              )}
            </div>

          </div>

          {/* PREMIUM ADDITION 4: Local chronology session archive log feed */}
          <div className="mt-8 border-t border-white/5 pt-8 w-full" id="chronology-archive-feed">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-base font-serif flex items-center gap-2">
                  <History className="w-4.5 h-4.5 text-[#C0A080]" />
                  <span>Logged Scan Session Chronology & Archive</span>
                </h3>
                <p className="text-[10px] text-white/40 font-mono mt-0.5">Instant secure cache of previous scans. Click card to load back into view.</p>
              </div>
              {scanHistory.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[9px] font-mono text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/25 px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Archive</span>
                </button>
              )}
            </div>

            {scanHistory.length === 0 ? (
              <div className="p-8 border border-white/5 bg-[#121214] rounded-2xl text-center text-white/30 text-xs shadow-inner">
                <History className="w-8 h-8 mx-auto text-white/10 mb-2" />
                <span className="font-mono text-[10px] block uppercase tracking-wider text-white/40 mb-1">No scanned items archived</span>
                Scan images using the webcam or file uploads to populate this chronological log!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-x-auto pb-2 scrollbar-thin">
                {scanHistory.map((item) => {
                  const isActiveSelected = selectedHistoryId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleRestoreFromHistory(item)}
                      className={`group/hist relative border rounded-xl overflow-hidden cursor-pointer transition-all ${
                        isActiveSelected 
                          ? "border-[#C0A080] bg-[#C0A080]/5 shadow-[0_0_15px_rgba(192,160,128,0.15)]" 
                          : "border-white/10 bg-[#121214] hover:border-white/20 hover:bg-[#151518]"
                      }`}
                    >
                      {/* Delete single chronology entry */}
                      <button
                        onClick={(e) => handleRemoveHistoryItem(item.id, e)}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 hover:bg-rose-950/80 border border-white/5 hover:border-rose-900/40 text-white/60 hover:text-rose-400 transition-all opacity-0 group-hover/hist:opacity-100 z-10 cursor-pointer"
                        title="Remove individual card"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      {/* Snapshot background thumbnail preview */}
                      <div className="relative h-24 bg-black overflow-hidden border-b border-white/5">
                        <img 
                          src={item.imageSrc} 
                          alt="Record Snapshot" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-60 group-hover/hist:scale-105 transition-all"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                        <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-[#C0A080] text-black text-[9px] font-mono font-semibold tracking-wide">
                          {item.count} Present
                        </span>
                      </div>

                      {/* Meta context block */}
                      <div className="p-3">
                        <span className="text-[10px] text-[#C0A080] font-mono block leading-none font-semibold truncate">
                          {item.className}
                        </span>
                        <span className="text-[9px] text-white/40 block mt-1 leading-none font-mono font-mono">
                          {item.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
        )}
      </main>

      {/* Corporate secured footer */}
      <footer id="footer-system" className="h-12 border-t border-white/5 flex items-center justify-between px-6 md:px-10 text-[10px] text-white/20 uppercase tracking-widest bg-[#080809] shrink-0 mt-auto">
        <span>PresenceIQ Secure Intelligence Network</span>
        <span>Ver. 2026.06.17</span>
      </footer>
    </div>
  );
}
