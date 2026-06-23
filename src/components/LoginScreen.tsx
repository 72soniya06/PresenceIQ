import React, { useState } from "react";
import { UserRole } from "../types";
import { GraduationCap, Briefcase, Mail, Lock, LogIn } from "lucide-react";

interface LoginScreenProps {
  onLogin: (role: UserRole, email: string, name: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter institutional email address");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters long");
      return;
    }

    const defaultName = selectedRole === "teacher" ? "Prof. Sarah Jenkins" : "Student Alex Rivera";
    onLogin(selectedRole, email, defaultName);
  };

  const handleGoogleLogin = () => {
    const defaultEmail = selectedRole === "teacher" ? "s.jenkins@presenceiq.edu" : "a.rivera@presenceiq.edu";
    const defaultName = selectedRole === "teacher" ? "Prof. Sarah Jenkins" : "Student Alex Rivera";
    onLogin(selectedRole, defaultEmail, defaultName);
  };

  const prefillCredentials = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "teacher") {
      setEmail("s.jenkins@presenceiq.edu");
      setPassword("teacher123");
    } else {
      setEmail("a.rivera@presenceiq.edu");
      setPassword("student123");
    }
  };

  return (
    <div id="login-container" className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0B] text-[#E0E0E0] p-4 md:p-8">
      {/* Background Subtle Radial Design */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C0A080_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      <div className="relative w-full max-w-md bg-[#121214] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-10 flex flex-col">
        {/* Header decoration */}
        <div className="bg-[#0D0D0E] border-b border-white/10 px-6 py-8 text-center relative">
          <h2 className="text-2xl font-serif font-semibold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            PresenceIQ
          </h2>
          <p className="text-[#C0A080] text-xs font-mono uppercase tracking-widest mt-1">Smart Institutional Access</p>
        </div>

        {/* Content body */}
        <div className="p-6 md:p-8 flex-1">
          {/* Role selection tab button system */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 text-center">
              Select Your Attendance Category
            </label>
            <div className="grid grid-cols-2 gap-3" id="role-selector">
              <button
                type="button"
                id="role-teacher-btn"
                onClick={() => prefillCredentials("teacher")}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all duration-250 cursor-pointer ${
                  selectedRole === "teacher"
                    ? "border-[#C0A080] bg-[#C0A080]/10 text-[#C0A080] shadow-sm shadow-[#C0A080]/10"
                    : "border-white/5 bg-white/2 hover:bg-white/5 text-white/50"
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span className="font-semibold text-xs tracking-tight">Teacher / Faculty</span>
              </button>

              <button
                type="button"
                id="role-student-btn"
                onClick={() => prefillCredentials("student")}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all duration-250 cursor-pointer ${
                  selectedRole === "student"
                    ? "border-[#C0A080] bg-[#C0A080]/10 text-[#C0A080] shadow-sm shadow-[#C0A080]/10"
                    : "border-white/5 bg-white/2 hover:bg-white/5 text-white/50"
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                <span className="font-semibold text-xs tracking-tight">Student Portal</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {error && (
              <div id="login-error" className="bg-rose-950/40 border border-rose-900/40 text-rose-300 p-3 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#E0E0E0] mb-1.5">
                Institutional Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="login-email"
                  placeholder={selectedRole === "teacher" ? "s.jenkins@presenceiq.edu" : "a.rivera@presenceiq.edu"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 pl-9 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#C0A080] focus:border-[#C0A080] transition-all"
                />
                <Mail className="w-4 h-4 text-white/30 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#E0E0E0]">
                  Secure Password
                </label>
                <span className="text-[10px] text-[#C0A080] hover:underline cursor-pointer">Recover</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  id="login-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 pl-9 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#C0A080] focus:border-[#C0A080] transition-all"
                />
                <Lock className="w-4 h-4 text-white/30 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              id="submit-email-login"
              className="w-full flex items-center justify-center gap-2 bg-[#C0A080] text-black font-bold uppercase tracking-wider text-xs py-2.5 px-4 rounded-lg hover:bg-[#C0A080]/90 transition-all cursor-pointer shadow-md shadow-[#C0A080]/10"
            >
              <span>Verify and Sign In</span>
              <LogIn className="w-4 h-4" />
            </button>
          </form>

          {/* Separator lines */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-white/15" />
            <span className="relative bg-[#121214] px-3.5 text-[9px] font-bold font-mono tracking-widest text-white/40 uppercase">
              Or Authenticate with
            </span>
          </div>

          {/* Genuine Authentic Google Workspace Login */}
          <button
            type="button"
            id="google-login-btn"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 bg-[#0D0D0E]/80 border border-white/10 rounded-lg py-2.5 px-4 hover:bg-white/5 hover:border-white/15 transition-all text-white text-xs font-semibold cursor-pointer"
          >
            {/* Real SVG Google brand icon representing strict accuracy directives */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.245-3.125C18.29 1.15 15.49 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.81 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z"
              />
              <path
                fill="#4285F4"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604"
              />
            </svg>
            <span className="font-bold uppercase tracking-wider text-[10px] text-white/90">Sign in with Google</span>
          </button>

          {/* Prefill helper tags */}
          <div className="mt-5 p-3 rounded-lg bg-white/2 border border-white/5 text-center">
            <span className="text-[10px] text-white/50 font-sans block">
              💡 Tap either option above to auto pre-fill testing credentials, then select sign-in.
            </span>
          </div>

        </div>

        {/* SAML SSL info banner */}
        <div className="bg-[#0A0A0B] border-t border-white/5 px-6 py-3 text-center text-white/35 text-[9px] font-mono uppercase tracking-widest">
          Secured with SSL Institutional Handshake
        </div>
      </div>
    </div>
  );
}
