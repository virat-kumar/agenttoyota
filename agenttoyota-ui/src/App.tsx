import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ToyotaHeader from "./components/ToyotaHeader";
import { LoadingOverlay } from "./components/Fields";
import AuthCard from "./screens/Auth";
import Home from "./screens/Home";
import ProfileForm from "./screens/ProfileForm";
import RecommendationsView from "./screens/Recommendations";
import type { ProfileData, LoanRec, LeaseRec } from "./types";
import { MOCK_LOANS, MOCK_LEASES } from "./mock";

const TOYOTA_RED = "#EB0A1E";
const TOYOTA_GRAY = "#222";

type Mode = "auth" | "home" | "profile" | "chat" | "results";

export default function App() {
  const [mode, setMode] = useState<Mode>("auth");
  const [user, setUser] = useState<{ name: string; email: string }>({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const location = useLocation();

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

  const beginTransition = (cb?: () => void) => {
    setLoading(true);
    setTimeout(() => {
      try { cb && cb(); } finally { setLoading(false); }
    }, 1000);
  };

  const go = (m: Mode) => beginTransition(() => setMode(m));
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

  // Support deep-linking back to results page: /?mode=results
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get("mode");
    if (m === "results") {
      if (loans.length === 0 && leases.length === 0) {
        setLoans(MOCK_LOANS);
        setLeases(MOCK_LEASES);
      }
      setMode("results");
    }
  }, [location.search]);

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
            <Home goProfile={() => go("profile")} goChat={() => go("chat")} />
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