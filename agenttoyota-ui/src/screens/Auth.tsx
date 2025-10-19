import { useState } from "react";
import { Banner, Field, TabButton } from "../components/Fields";

export default function AuthCard({
  onSignupSuccess,
  onLogin,
  beginTransition,
}: {
  onSignupSuccess?: () => void;
  onLogin: (u: { name: string; email: string }) => void;
  beginTransition?: (cb: () => void) => void;
}) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [notice, setNotice] = useState<{ kind: "success" | "error" | "info"; msg: string } | null>(null);

  // Signup state
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sPhone, setSPhone] = useState("");
  const [sPassword, setSPassword] = useState("");
  const [sDob, setSDob] = useState("");

  // Login state
  const [lEmail, setLEmail] = useState("");
  const [lPassword, setLPassword] = useState("");

  const saveUser = (email: string, name: string) => {
    try {
      const raw = localStorage.getItem("toyota_app_users");
      const data = raw ? JSON.parse(raw) : {};
      (data as any)[email] = { name };
      localStorage.setItem("toyota_app_users", JSON.stringify(data));
    } catch {}
  };

  const getNameForEmail = (email: string) => {
    try {
      const raw = localStorage.getItem("toyota_app_users");
      const data = raw ? JSON.parse(raw) : {};
      if ((data as any)[email]?.name) return (data as any)[email].name as string;
    } catch {}
    const local = (email || "").split("@")[0];
    if (!local) return "User";
    return local.charAt(0).toUpperCase() + local.slice(1);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    saveUser(sEmail, sName || "User");
    setNotice({ kind: "success", msg: "Sign up successful. Redirecting to login..." });
    beginTransition?.(() => setTab("login"));
    onSignupSuccess?.();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const derivedName = getNameForEmail(lEmail);
    onLogin({ email: lEmail, name: derivedName });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {notice && (
        <div className="mb-4">
          <Banner kind={notice.kind} onClose={() => setNotice(null)}>
            {notice.msg}
          </Banner>
        </div>
      )}

      <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-gray-200 w-max mx-auto mb-6">
        <TabButton active={tab === "login"} onClick={() => setTab("login")}>
          Login
        </TabButton>
        <TabButton active={tab === "signup"} onClick={() => setTab("signup")}>Sign up</TabButton>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {tab === "signup" ? (
          <form onSubmit={handleSignup} className="grid grid-cols-1 gap-4">
            <Field label="Name" value={sName} onChange={setSName} placeholder="Jane Doe" required name="name" />
            <Field label="Email" type="email" value={sEmail} onChange={setSEmail} placeholder="jane@example.com" required name="email" />
            <Field label="Phone no" type="tel" value={sPhone} onChange={setSPhone} placeholder="(555) 123-4567" required name="phone" />
            <Field label="Password" type="password" value={sPassword} onChange={setSPassword} placeholder="••••••••" required name="password" />
            <Field label="Date of birth" type="date" value={sDob} onChange={setSDob} required name="dob" />
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-medium text-white bg-[#EB0A1E]"
            >
              Create account
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="grid grid-cols-1 gap-4">
            <Field label="Email" type="email" value={lEmail} onChange={setLEmail} placeholder="enter your email" required name="login_email" />
            <Field label="Password" type="password" value={lPassword} onChange={setLPassword} placeholder="••••••••" required name="login_password" />
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-medium text-white bg-[#EB0A1E]"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}