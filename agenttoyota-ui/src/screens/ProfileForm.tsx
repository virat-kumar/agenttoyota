import { Field, SelectField } from "../components/Fields";
import type { ProfileData, VoidFn } from "../types";

const TOYOTA_RED = "#EB0A1E";
const TOYOTA_RED_DARK = "#C40017";
const TOYOTA_GRAY = "#222";

export default function ProfileForm({
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