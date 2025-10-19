import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LeaseRec, LoanRec } from "../types";

const TOYOTA_RED = "#EB0A1E";
const TOYOTA_GRAY = "#222";

function toUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function CarImage({ src, alt }: { src: string; alt: string }) {
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
  const navigate = useNavigate();
  const goToQuote = () => {
    const params = new URLSearchParams({
      vehicle_amount: String(item.carValue),
      down_payment_cash: String(0),
      term_months: String(60),
      apr_percent: String(item.interestRate),
      tax_rate: String(0.0825),
      vehicle_name: item.vehicleName,
    });
    navigate(`/loan-quote?${params.toString()}`);
  };
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
      <div className="mt-3">
        <button
          onClick={goToQuote}
          className="w-full rounded-xl px-4 py-2.5 font-medium text-white"
          style={{ background: TOYOTA_RED }}
        >
          View Quote
        </button>
      </div>
    </div>
  );
}

function LeaseCard({ item }: { item: LeaseRec }) {
  const navigate = useNavigate();
  const goToLeaseQuote = () => {
    const params = new URLSearchParams({
      vehicle_amount: String(item.carValue),
      term_months: String(36),
      vehicle_name: item.vehicleName,
    });
    navigate(`/lease-quote?${params.toString()}`);
  };
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
      <div className="mt-3">
        <button
          onClick={goToLeaseQuote}
          className="w-full rounded-xl px-4 py-2.5 font-medium text-white"
          style={{ background: TOYOTA_RED }}
        >
          View Lease Quote
        </button>
      </div>
    </div>
  );
}

export default function RecommendationsView({
  loans,
  leases,
  onBack,
  onRefine,
}: {
  loans: LoanRec[];
  leases: LeaseRec[];
  onBack: () => void;
  onRefine: () => void;
}) {
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