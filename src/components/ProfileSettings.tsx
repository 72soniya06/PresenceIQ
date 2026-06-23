import React, { useState } from "react";
import { UserRole } from "../types";
import { User, Mail, Shield, Save, ArrowLeft, Building2, CheckCircle2 } from "lucide-react";

interface ProfileSettingsProps {
  initialName: string;
  initialEmail: string;
  initialRole: UserRole;
  onSave: (name: string, email: string, role: UserRole) => void;
  onBack: () => void;
}

export default function ProfileSettings({
  initialName,
  initialEmail,
  initialRole,
  onSave,
  onBack
}: ProfileSettingsProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSave(name, email, role);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onBack(); // go back automatically after showing success animation
    }, 1200);
  };

  return (
    <div id="profile-container" className="w-full max-w-xl mx-auto bg-[#121214] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Visual background gradient accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C0A080] opacity-5 blur-3xl rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-500 opacity-5 blur-3xl rounded-full" />

      {/* Profile Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#C0A080]/20 to-black border border-[#C0A080]/35 rounded-xl flex items-center justify-center font-serif text-lg font-bold text-[#C0A080] shadow-[0_4px_20px_rgba(192,160,128,0.15)] animate-pulse">
            {name.substring(0, 1).toUpperCase() || "P"}
          </div>
          <div>
            <h3 className="text-lg font-serif text-white font-medium flex items-center gap-1.5">
              <span>Personal Profile</span>
            </h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-0.5">Edit credentials and portal roles</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-3.5 py-1.5 border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold uppercase tracking-wider text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tracker</span>
        </button>
      </div>

      {showSuccess ? (
        <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in" id="profile-success-anim">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/45 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-white text-base font-bold font-serif">Credentials Updated</h4>
          <p className="text-white/40 text-xs mt-1">
            Applying configuration changes... Returning to tracking board shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Form input: Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest font-mono text-[#C0A080] font-bold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C0A080]" />
              <span>Full Profile Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Sarah Jenkins"
                className="w-full bg-[#070708] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C0A080] transition-colors"
                required
              />
            </div>
          </div>

          {/* Form input: Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest font-mono text-[#C0A080] font-bold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C0A080]" />
              <span>Verified Email Address</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full bg-[#070708] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C0A080] transition-colors"
                required
              />
            </div>
          </div>

          {/* Form input: Role Choice Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest font-mono text-[#C0A080] font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#C0A080]" />
              <span>Credentials Authorization Tier</span>
            </label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`p-3.5 rounded-xl border transition-all text-left flex flex-col ${
                  role === "teacher"
                    ? "bg-[#C0A080]/10 border-[#C0A080] text-white"
                    : "bg-[#070708] border-white/5 text-white/50 hover:border-white/10"
                }`}
              >
                <span className={`text-[10px] uppercase tracking-widest font-mono font-bold ${role === "teacher" ? "text-[#C0A080]" : "text-white/40"}`}>
                  Teacher Core
                </span>
                <span className="text-[10px] mt-1 leading-normal text-white/60">
                  Full supervisor access to verify presence mappings and export data logs.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("student")}
                className={`p-3.5 rounded-xl border transition-all text-left flex flex-col ${
                  role === "student"
                    ? "bg-[#C0A080]/10 border-[#C0A080] text-white"
                    : "bg-[#070708] border-white/5 text-white/50 hover:border-white/10"
                }`}
              >
                <span className={`text-[10px] uppercase tracking-widest font-mono font-bold ${role === "student" ? "text-cyan-400" : "text-white/40"}`}>
                  Student Portal
                </span>
                <span className="text-[10px] mt-1 leading-normal text-white/60">
                  Standard viewer access to register coordinates and check-in to events.
                </span>
              </button>
            </div>
          </div>

          <div className="h-[1px] bg-white/5 my-2" />

          {/* Save trigger button row */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-white/70 hover:text-white font-bold uppercase tracking-wider text-[10px] rounded-lg transition-all"
            >
              Cancel Changes
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#C0A080] hover:bg-[#C0A080]/90 text-black font-bold uppercase tracking-wider text-[10px] rounded-lg transition-all flex items-center gap-1.5 hover:scale-102"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Portal Settings</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
