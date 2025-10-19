import React, { useMemo, useState } from "react";

/* ───────── Toyota theme ───────── */
const TOYOTA_RED = "#EB0A1E";
const TOYOTA_RED_DARK = "#C40017";
const TOYOTA_GRAY = "#222";

/* ───────── Types ───────── */
type VoidFn = () => void;

interface ToyotaHeaderProps {
  isAuthed: boolean;
  userName?: string;
  onLogoClick: VoidFn;
  onLogout: VoidFn;
}

interface TabButtonProps {
  active: boolean;
  children: React.ReactNode;
  onClick: VoidFn;
}

interface FieldProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (v: string) => void; // input values come as strings
  placeholder?: string;
  required?: boolean;
  name?: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  name?: string;
  placeholder?: string;
}

type BannerKind = "success" | "error" | "info";
interface BannerProps {
  kind?: BannerKind;
  children: React.ReactNode;
  onClose?: VoidFn;
}

interface AuthCardProps {
  onSignupSuccess?: VoidFn;
  onLogin: (u: { name: string; email: string }) => void;
  beginTransition?: (cb: VoidFn) => void;
}

interface ProfileData {
  income_annual_usd: string;
  credit_score: string;
  down_payment_usd: string;
  monthly_budget_usd: string;
  loan_term_months: string;
  lease_term_months: string;
  zipcode: string;
  employment_status: string;
  preferred_body_style: string;
  preferred_fuel_type: string;
}

interface LoanRec {
  imageUrl: string;
  vehicleName: string;
  carValue: number;
  interestRate: number;
  monthlyEmi: number;
}

interface LeaseRec {
  imageUrl: string;
  vehicleName: string;
  carValue: number;
  monthlyRent: number;
}

interface RecommendationsViewProps {
  loans: LoanRec[];
  leases: LeaseRec[];
  onBack: VoidFn;
  onRefine: VoidFn;
}

interface CarImageProps {
  src: string;
  alt: string;
}

/* ───────── Small UI helpers ───────── */
function ToyotaHeader({ isAuthed, userName, onLogoClick, onLogout }: ToyotaHeaderProps) {
  return (
    <header className="w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onLogoClick}>
          <svg
            className="h-8 w-10"
            viewBox="0 0 64 48"
            role="img"
            aria-label="Toyota emblem"
            fill="none"
            stroke={TOYOTA_RED}
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <ellipse cx="32" cy="24" rx="28" ry="18" />
            <ellipse cx="32" cy="24" rx="18" ry="12" />
            <ellipse cx="32" cy="24" rx="8" ry="18" transform="rotate(90 32 24)" />
          </svg>
          <span className="tracking-widest font-semibold text-xl" style={{ color: TOYOTA_RED }}>
            TOYOTA
          </span>
        </div>
        {isAuthed ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Welcome,</span>
            <span className="font-semibold text-gray-900">{userName || "User"}</span>
            <button
              onClick={onLogout}
              className="ml-3 inline-flex items-center rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Sign in to continue</div>
        )}
      </div>
    </header>
  );
}

function TabButton({ active, children, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        "relative px-5 py-2 text-sm font-medium transition-colors " +
        (active ? "text-white" : "text-gray-600 hover:text-gray-900")
      }
      style={{ backgroundColor: active ? TOYOTA_RED : "transparent", borderRadius: 9999 }}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  name,
}: FieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  name,
  placeholder,
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200 bg-white"
      >
        <option value="" disabled>
          {placeholder || "Select an option"}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function Banner({ kind = "success", children, onClose }: BannerProps) {
  const styles = useMemo(() => {
    if (kind === "success") return { bg: "bg-green-50", text: "text-green-800", ring: "ring-green-200" };
    if (kind === "error") return { bg: "bg-red-50", text: "text-red-800", ring: "ring-red-200" };
    return { bg: "bg-gray-50", text: "text-gray-800", ring: "ring-gray-200" };
  }, [kind]);
  return (
    <div className={`${styles.bg} ${styles.text} ring-1 ${styles.ring} rounded-xl px-3 py-2 flex items-start gap-3`}>
      <span className="mt-0.5">✅</span>
      <div className="text-sm flex-1">{children}</div>
      {onClose && (
        <button className="text-xs opacity-70 hover:opacity-100" onClick={onClose}>
          Dismiss
        </button>
      )}
    </div>
  );
}

function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center" role="alert" aria-busy>
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-10 w-10 rounded-full border-4 border-gray-300 animate-spin"
          style={{ borderTopColor: TOYOTA_RED }}
          aria-hidden="true"
        />
        <div className="text-sm text-gray-700">{message}</div>
      </div>
    </div>
  );
}

/* ───────── Auth Card ───────── */
function AuthCard({ onSignupSuccess, onLogin, beginTransition }: AuthCardProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [notice, setNotice] = useState<{ kind: BannerKind; msg: string } | null>(null);

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
      data[email] = { name };
      localStorage.setItem("toyota_app_users", JSON.stringify(data));
    } catch {}
  };

  const getNameForEmail = (email: string) => {
    try {
      const raw = localStorage.getItem("toyota_app_users");
      const data = raw ? JSON.parse(raw) : {};
      if (data[email]?.name) return data[email].name as string;
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
              className="mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-medium text-white"
              style={{ backgroundColor: TOYOTA_RED }}
              onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = TOYOTA_RED_DARK)}
              onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = TOYOTA_RED)}
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
              className="mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-medium text-white"
              style={{ backgroundColor: TOYOTA_RED }}
              onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = TOYOTA_RED_DARK)}
              onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = TOYOTA_RED)}
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ───────── Mock data for recommendations ───────── */
const MOCK_LOANS: LoanRec[] = [
  {
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/2025%20Toyota%20Camry%20LE%20Las%20Vegas%202025.jpg",
    vehicleName: "2025 Toyota Camry Hybrid",
    carValue: 32950,
    interestRate: 3.4,
    monthlyEmi: 489,
  },
  {
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/19%20Toyota%20RAV4%20XLE%20Premium.jpg",
    vehicleName: "2025 Toyota RAV4",
    carValue: 29950,
    interestRate: 3.9,
    monthlyEmi: 512,
  },
  {
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Toyota%20Corolla%20Sedan%20(E210)%20Washington%20DC%20Metro%20Area,%20USA%20(3).jpg",
    vehicleName: "2024 Toyota Corolla",
    carValue: 22000,
    interestRate: 4.2,
    monthlyEmi: 399,
  },
];

const MOCK_LEASES: LeaseRec[] = [
  {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/94/2024_Toyota_Prius_Excel_PHEV_-_1987cc_2.0_%28225PS%29_Plug-in_Hybrid_-_Silver_Metallic_-_10-2024%2C_Front_Quarter.jpg",
    vehicleName: "2024 Toyota Prius",
    carValue: 27950,
    monthlyRent: 329,
  },
  {
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Toyota%20Tacoma%20TRD%20Off%20Road%20(N400)%20IMG%209735.jpg",
    vehicleName: "2025 Toyota Tacoma",
    carValue: 37200,
    monthlyRent: 429,
  },
  {
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Toyota%20Highlander%20(XU70)%20Washington%20DC%20Metro%20Area,%20USA.jpg",
    vehicleName: "2025 Toyota Highlander",
    carValue: 39600,
    monthlyRent: 469,
  },
];

function toUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function CarImage({ src, alt }: CarImageProps) {
  const [ok, setOk] = useState(true);
  return ok ? (
    <img src={src} alt={alt} className="w-full h-36 object-contain" onError={() => setOk(false)} />
  ) : (
    <div className="w-full h-36 flex items-center justify-center bg-gray-50 rounded-xl">
      <svg className="h-10 w-12" viewBox="0 0 64 48" fill="none" stroke={TOYOTA_RED} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" role="img" aria-label="Toyota emblem">
        <ellipse cx="32" cy="24" rx="28" ry="18" /><ellipse cx="32" cy="24" rx="18" ry="12" /><ellipse cx="32" cy="24" rx="8" ry="18" transform="rotate(90 32 24)" />
      </svg>
    </div>
  );
}

function LoanCard({ item }: { item: LoanRec }) {
  return (
    <div className="rounded-2xl border border-gray-100 p-4 bg-white shadow-sm">
      <CarImage src={item.imageUrl} alt={item.vehicleName} />
      <h4 className="mt-3 font-semibold text-gray-900">{item.vehicleName}</h4>
      <div className="text-sm text-gray-600">Car value: {toUSD(item.carValue)}</div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border p-2 text-center">
          <div className="text-xs text-gray-500">Interest rate</div>
          <div className="font-semibold">{item.interestRate}% APR</div>
        </div>
        <div className="rounded-xl border p-2 text-center">
          <div className="text-xs text-gray-500">Monthly EMI</div>
          <div className="font-semibold">{toUSD(item.monthlyEmi)}</div>
        </div>
      </div>
    </div>
  );
}

function LeaseCard({ item }: { item: LeaseRec }) {
  return (
    <div className="rounded-2xl border border-gray-100 p-4 bg-white shadow-sm">
      <CarImage src={item.imageUrl} alt={item.vehicleName} />
      <h4 className="mt-3 font-semibold text-gray-900">{item.vehicleName}</h4>
      <div className="text-sm text-gray-600">Car value: {toUSD(item.carValue)}</div>
      <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
        <div className="rounded-xl border p-2 text-center">
          <div className="text-xs text-gray-500">Monthly rent</div>
          <div className="font-semibold">{toUSD(item.monthlyRent)}</div>
        </div>
      </div>
    </div>
  );
}

function RecommendationsView({ loans, leases, onBack, onRefine }: RecommendationsViewProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: TOYOTA_GRAY }}>Recommendations</h1>
          <p className="text-gray-600">Based on your inputs. Compare options and pick what suits you.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-xl px-4 py-2.5 border" onClick={onRefine}>Refine inputs</button>
          <button className="rounded-xl px-4 py-2.5" style={{ background: TOYOTA_RED, color: "white" }} onClick={onBack}>Back to Home</button>
        </div>
      </div>

      {/* Loans */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold" style={{ color: TOYOTA_GRAY }}>Loan recommendations</h2>
          <span className="text-sm text-gray-500">{loans.length} result{loans.length === 1 ? "" : "s"}</span>
        </div>
        {loans.length === 0 ? (
          <div className="rounded-2xl border border-dashed text-gray-600 p-6 text-center">No loan recommendations for these inputs.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loans.map((x, i) => <LoanCard key={`loan-${i}`} item={x} />)}
          </div>
        )}
      </section>

      {/* Leases */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold" style={{ color: TOYOTA_GRAY }}>Lease recommendations</h2>
          <span className="text-sm text-gray-500">{leases.length} result{leases.length === 1 ? "" : "s"}</span>
        </div>
        {leases.length === 0 ? (
          <div className="rounded-2xl border border-dashed text-gray-600 p-6 text-center">No lease recommendations for these inputs.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leases.map((x, i) => <LeaseCard key={`lease-${i}`} item={x} />)}
          </div>
        )}
      </section>
    </div>
  );
}

/* ───────── Main App ───────── */
export default function ToyotaAuthApp() {
  const [mode, setMode] = useState<"auth" | "home" | "profile" | "chat" | "results">("auth");
  const [user, setUser] = useState<{ name: string; email: string }>({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    income_annual_usd: "",
    credit_score: "",
    down_payment_usd: "",
    monthly_budget_usd: "",
    loan_term_months: "",
    lease_term_months: "",
    zipcode: "",
    employment_status: "",
    preferred_body_style: "",
    preferred_fuel_type: "",
  });

  const [loans, setLoans] = useState<LoanRec[]>([]);
  const [leases, setLeases] = useState<LeaseRec[]>([]);

  const beginTransition = (cb?: VoidFn) => {
    setLoading(true);
    setTimeout(() => {
      try { cb && cb(); } finally { setLoading(false); }
    }, 1000);
  };
  const go = (m: typeof mode) => beginTransition(() => setMode(m));

  const isAuthed = mode !== "auth";
  const setP = (k: keyof ProfileData, v: string) => setProfile((prev) => ({ ...prev, [k]: v }));

  const getRecommendations = () => {
    setLoading(true);
    setTimeout(() => {
      setLoans(MOCK_LOANS);
      setLeases(MOCK_LEASES);
      setMode("results");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div style={{ background: TOYOTA_RED }} className="h-1 w-full" />
      <ToyotaHeader
        isAuthed={isAuthed}
        userName={user.name}
        onLogoClick={() => go(isAuthed ? "home" : "auth")}
        onLogout={() => beginTransition(() => { setUser({ name: "", email: "" }); setMode("auth"); })}
      />
      {loading && <LoadingOverlay message="Please wait..." />}

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-10">
          {mode === "auth" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <AuthCard
                  beginTransition={beginTransition}
                  onLogin={({ name, email }) => beginTransition(() => { setUser({ name, email }); setMode("home"); })}
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-3" style={{ color: TOYOTA_GRAY }}>Toyota Finance Demo: end-to-end flow</h2>
                  <p className="text-gray-600">
                    Create your profile to receive <span className="font-medium">personalized loan & lease options</span> for Toyota vehicles—tailored to your credit profile, income, ZIP code, mileage, down payment, and preferences. Compare offers and quotes side-by-side, then complete checkout and receive confirmation.
                  </p>
                  <ul className="mt-4 space-y-2 text-gray-600 list-disc pl-5">
                    <li>Profile setup → credit score, income, down payment, ZIP code, mileage</li>
                    <li>Personalized loan & lease options per model</li>
                    <li>Side-by-side comparison with detailed quotes</li>
                    <li>Checkout & confirmation</li>
                    <li>Toyota look & feel</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : mode === "home" ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-start">
                <h3 className="text-xl font-semibold mb-2" style={{ color: TOYOTA_GRAY }}>Customize Your Financing</h3>
                <p className="text-gray-600 mb-6">Enter your details to get personalized loan & lease options.</p>
                <button onClick={() => go("profile")} className="rounded-xl px-4 py-2.5 font-medium text-white" style={{ backgroundColor: TOYOTA_RED }}>
                  Continue
                </button>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-start">
                <h3 className="text-xl font-semibold mb-2" style={{ color: TOYOTA_GRAY }}>Ask chatbot</h3>
                <p className="text-gray-600 mb-6">Chat with an assistant to explore vehicles, financing, and leasing.</p>
                <button onClick={() => go("chat")} className="rounded-xl px-4 py-2.5 font-medium text-white" style={{ backgroundColor: TOYOTA_RED }}>
                  Open chatbot
                </button>
              </div>
            </div>
          ) : mode === "profile" ? (
            <ProfileForm profile={profile} setP={setP} onBack={() => go("home")} onGetRecommendations={getRecommendations} />
          ) : mode === "results" ? (
            <RecommendationsView loans={loans} leases={leases} onBack={() => go("home")} onRefine={() => go("profile")} />
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm min-h-[40vh] flex items-center justify-center">
              <div className="text-center max-w-xl">
                <h1 className="text-2xl font-semibold mb-2" style={{ color: TOYOTA_GRAY }}>Chatbot</h1>
                <p className="text-gray-600">Chat experience coming soon.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ───────── Profile Form ───────── */
function ProfileForm({
  profile,
  setP,
  onBack,
  onGetRecommendations,
}: {
  profile: ProfileData;
  setP: (k: keyof ProfileData, v: string) => void;
  onBack: VoidFn;
  onGetRecommendations: VoidFn;
}) {
  const BODY_STYLES = ["Sedan", "Hatchback", "SUV / Crossover", "Truck", "Minivan", "Coupe / Sports"];
  const FUEL_TYPES = ["Gasoline", "Hybrid", "Plug-In Hybrid (PHEV)", "Electric (BEV)", "Hydrogen Fuel Cell (FCEV)"];
  const EMPLOYMENT_STATUSES = ["Employed", "Self-Employed", "Student", "Unemployed", "Prefer not to say"];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: TOYOTA_GRAY }}>Customize Your Financing</h1>
          <p className="text-gray-600">Provide a few details to tailor loan & lease options.</p>
        </div>
        <button onClick={onBack} className="text-sm underline">Back to Home</button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onGetRecommendations(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Annual income (USD)" type="text" value={profile.income_annual_usd} onChange={(v) => setP("income_annual_usd", v)} placeholder="e.g., 85000" required name="income_annual_usd" />
        <Field label="Credit score" type="text" value={profile.credit_score} onChange={(v) => setP("credit_score", v)} placeholder="e.g., 720" required name="credit_score" />
        <Field label="Down payment (USD)" type="number" value={profile.down_payment_usd} onChange={(v) => setP("down_payment_usd", v)} placeholder="e.g., 5000" required name="down_payment_usd" />
        <Field label="Monthly budget (USD)" type="number" value={profile.monthly_budget_usd} onChange={(v) => setP("monthly_budget_usd", v)} placeholder="e.g., 600" required name="monthly_budget_usd" />
        <Field label="Loan term (months)" type="number" value={profile.loan_term_months} onChange={(v) => setP("loan_term_months", v)} placeholder="e.g., 60" required name="loan_term_months" />
        <Field label="Lease term (months)" type="number" value={profile.lease_term_months} onChange={(v) => setP("lease_term_months", v)} placeholder="e.g., 36" required name="lease_term_months" />
        <Field label="ZIP code" type="text" value={profile.zipcode} onChange={(v) => setP("zipcode", v)} placeholder="e.g., 75080" required name="zipcode" />
        <SelectField label="Employment status" value={profile.employment_status} onChange={(v) => setP("employment_status", v)} options={EMPLOYMENT_STATUSES} name="employment_status" placeholder="Choose status" />
        <SelectField label="Preferred body style" value={profile.preferred_body_style} onChange={(v) => setP("preferred_body_style", v)} options={BODY_STYLES} name="preferred_body_style" placeholder="Select style" />
        <SelectField label="Preferred fuel type" value={profile.preferred_fuel_type} onChange={(v) => setP("preferred_fuel_type", v)} options={FUEL_TYPES} name="preferred_fuel_type" placeholder="Select fuel type" />
        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <button type="submit" className="rounded-xl px-4 py-2.5 font-medium text-white"
            style={{ backgroundColor: TOYOTA_RED }}
            onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = TOYOTA_RED_DARK)}
            onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = TOYOTA_RED)}>
            Get Recommendations
          </button>
          <button type="button" className="rounded-xl px-4 py-2.5 border" onClick={onBack}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
