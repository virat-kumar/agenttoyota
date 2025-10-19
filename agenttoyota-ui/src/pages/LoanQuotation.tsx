import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";

/**
 * This page reproduces your static HTML demo exactly, but in React:
 * - Reads query params (vehicle_amount, down_payment_cash, term_months, apr_percent, tax_rate, vehicle_name)
 * - POSTs to http://machine-virat.eastus2.cloudapp.azure.com:5000/loan/Calculator
 * - Renders two charts and an amortization table using your returned JSON
 * - Includes "Download JSON" and focus buttons + freeze-to-image like your snippet
 */

const TOYOTA_RED = "#EB0A1E";

type FinanceResponse = {
  meta: { mode?: string; notes?: string[] };
  chartjs: {
    labels: string[];
    datasets: { label: string; type: string; stack?: string; data: number[] }[];
  };
  timeseries: {
    cumulative_interest: number[];
    cumulative_total_paid: number[];
    payment_total_per_month: number[];
  };
  totals: {
    // backend returns vehicle_amount; static demo used assumed_vehicle_price
    vehicle_amount?: number;
    assumed_vehicle_price?: number;
    amount_financed: number;
    apr_percent: number;
    term_months: number;
    monthly_payment_base: number;
    monthly_tax: number;
    monthly_payment_total: number;
    total_interest: number;
    total_tax_paid: number;
    total_paid_including_tax: number;
    customer_due_at_signing: number;
    principal_repaid: number;
  };
  schedule: {
    period: number;
    payment_base: string;
    principal: string;
    interest: string;
    tax: string;
    payment_total: string;
    balance_end: string;
  }[];
};

export default function LoanQuotation() {
  const [sp] = useSearchParams();
  const [data, setData] = useState<FinanceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const vehicleName = sp.get("vehicle_name") || "Toyota • Payment & Tax Visualization";
  const payload = useMemo(() => {
    // pull from query params with safe fallbacks
    const vehicle_amount = Number(sp.get("vehicle_amount") || "27500");
    const down_payment_cash = Number(sp.get("down_payment_cash") || "0");
    const term_months = Number(sp.get("term_months") || "60");
    const apr_percent = Number(sp.get("apr_percent") || "4.5");
    const tax_rate = Number(sp.get("tax_rate") || "0.0825");
    return { vehicle_amount, down_payment_cash, term_months, apr_percent, tax_rate };
  }, [sp]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError(null);
        // If you hit CORS issues during local dev, see the proxy tip at the bottom.
        const res = await fetch(
          "http://machine-virat.eastus2.cloudapp.azure.com:5000/loan/Calculator",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: FinanceResponse = await res.json();
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load quote");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [payload]);

  // Set page title to vehicle name (instead of returning a <title> in JSX)
  useEffect(() => {
    if (vehicleName) document.title = vehicleName;
  }, [vehicleName]);

  return (
    <div>
      <style>{CSS}</style>

      <header>
        <div className="wrap">
          <div className="brand">
            <img
              alt="Toyota logo"
              src="data:image/png;base64,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"
            />
            <h1>{vehicleName}</h1>
          </div>
        </div>
      </header>

      <div className="wrap" style={{ paddingTop: 22 }}>
        <div className="toolbar" style={{ marginBottom: 12 }}>
          <button className="btn primary" id="btnFocusBar" onClick={() => pulseById("stacked-title")}>
            Focus: Stacked Payments
          </button>
          <button className="btn" id="btnFocusLine" onClick={() => pulseById("trend-title")}>
            Focus: Cumulative
          </button>
          <button className="btn" id="btnDownload" onClick={() => downloadJSON(data)}>
            Download JSON
          </button>
          <button className="btn" onClick={() => navigate("/?mode=results") }>
            Back
          </button>
          <button
            className="btn"
            style={{ background: TOYOTA_RED, color: "white", marginLeft: "auto" }}
            onClick={() => {
              const params = new URLSearchParams({
                vehicle_name: vehicleName,
                monthly_payment: String(data?.totals.monthly_payment_total || 0),
                down_payment: String(data?.totals.customer_due_at_signing || 0),
                type: "loan",
              });
              navigate(`/payment?${params.toString()}`);
            }}
          >
            Proceed with Payment
          </button>
        </div>

        {error && (
          <div className="card pad" style={{ borderColor: "#ffd9de", background: "#fff7f7" }}>
            <h3>Could not load quote</h3>
            <p style={{ color: "#a30717" }}>{String(error)}</p>
            <p className="fine" style={{ marginTop: 6 }}>
              Check CORS or try again.
            </p>
          </div>
        )}

        {!data ? (
          <div className="card pad">
            <h3>Loading…</h3>
            <p className="fine">Fetching quote from API with your parameters.</p>
          </div>
        ) : (
          <Content data={data} vehicleName={vehicleName} />
        )}
      </div>
    </div>
  );
}

function Content({ data, vehicleName }: { data: FinanceResponse; vehicleName: string }) {
  const barRef = useRef<HTMLCanvasElement | null>(null);
  const lineRef = useRef<HTMLCanvasElement | null>(null);
  const [barChart, setBarChart] = useState<any>(null);
  const [lineChart, setLineChart] = useState<any>(null);
  const didFreezeRef = useRef(false);
  const destroyedByFreezeRef = useRef(false);

  useEffect(() => {
    // Stacked bar chart
    const barCtx = barRef.current?.getContext("2d");
    const _bar = barCtx
      ? new Chart(barCtx, {
          type: "bar",
          data: {
            labels: data.chartjs.labels,
            datasets: (data.chartjs.datasets.map((ds) => ({
              ...ds,
              // match your demo colors
              backgroundColor:
                ds.label === "Principal"
                  ? "#2e7d32"
                  : ds.label === "Interest"
                  ? "#EB0A1E"
                  : "#9e9e9e",
              borderWidth: 0,
              borderRadius: 6,
              barPercentage: 0.9,
              categoryPercentage: 1.0,
            })) as any),
          },
          options: {
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
              tooltip: {
                mode: "index",
                intersect: false,
                callbacks: {
                  label: (ctx) => `${ctx.dataset.label}: ${currency(ctx.parsed.y || 0)}`,
                },
              },
            },
            interaction: { mode: "index", intersect: false },
            scales: {
              x: { stacked: true, grid: { display: false } },
              y: {
                stacked: true,
                beginAtZero: true,
                ticks: { callback: (v) => currency(Number(v)) },
              },
            },
          },
        })
      : null;
    setBarChart(_bar);

    // Line chart
    const lineCtx = lineRef.current?.getContext("2d");
    const _line = lineCtx
      ? new Chart(lineCtx, {
          type: "line",
          data: {
            labels: data.chartjs.labels,
            datasets: [
              {
                label: "Cumulative Interest",
                data: data.timeseries.cumulative_interest,
                borderWidth: 2,
                fill: false,
                tension: 0.25,
              },
              {
                label: "Cumulative Total Paid",
                data: data.timeseries.cumulative_total_paid,
                borderWidth: 2,
                fill: false,
                tension: 0.25,
              },
            ],
          },
          options: {
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  label: (c) => `${c.dataset.label}: ${currency(Number(c.parsed.y))}`,
                },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                beginAtZero: true,
                ticks: { callback: (v) => currency(Number(v)) },
              },
            },
          },
        })
      : null;
    setLineChart(_line);

    // Freeze charts to static images (like your demo) exactly once
    if (!didFreezeRef.current) {
      // allow a paint before freezing
      requestAnimationFrame(() => {
        if (_bar) freezeChartToImage(_bar, "stackedChart");
        if (_line) freezeChartToImage(_line, "trendChart");
        didFreezeRef.current = true;
        destroyedByFreezeRef.current = true; // freezeChartToImage destroys charts
      });
    }

    return () => {
      // Only destroy if not already destroyed by freeze
      if (!destroyedByFreezeRef.current) {
        _bar?.destroy();
        _line?.destroy();
      }
    };
  }, [data]);

  return (
    <div className="grid">
      <section className="card chart-card" aria-labelledby="stacked-title">
        <h3 id="stacked-title">Installment Breakdown (Principal • Interest • Tax)</h3>
        <div style={{ position: "relative", width: "100%", height: 420 }}>
          <canvas id="stackedChart" ref={barRef} aria-label="Stacked bar chart of payments" />
        </div>
        <div className="chart-subtitle">
          Amounts shown per month across the loan term. Animations & zoom are disabled for a stable
          customer-facing view.
        </div>
      </section>

      <aside className="card pad">
        <h3>Summary</h3>
        <div className="kpis">
          {([
            ["Vehicle", vehicleName],
            ["Vehicle Price", currency((data.totals.vehicle_amount ?? data.totals.assumed_vehicle_price ?? 0))],
            ["Monthly Payment", currency(data.totals.monthly_payment_total)],
            ["Interest Rate", `${data.totals.apr_percent}% APR`],
            ["Loan Term", `${data.totals.term_months} months`],
            ["Down Payment", currency(data.totals.customer_due_at_signing)],
            ["Total Interest", currency(data.totals.total_interest)],
            ["Total Cost", currency(data.totals.total_paid_including_tax)],
            ["Interest Savings vs 7%", currency(Math.max(0, (data.totals.total_paid_including_tax - data.totals.amount_financed) * 0.02))],
            ["Monthly Budget Impact", `${Math.round((data.totals.monthly_payment_total / 5000) * 100)}% of $5K income`],
            ["Payoff Timeline", `${data.totals.term_months} months`],
            ["Equity After 2 Years", currency(Math.max(0, (data.totals.vehicle_amount ?? 0) * 0.3 - data.totals.monthly_payment_total * 24))],
          ] as const).map(([label, val]) => (
            <div className="kpi" key={label}>
              <div className="label">{label}</div>
              <div className="value">{val}</div>
            </div>
          ))}
        </div>

        <div className="note" style={{ marginTop: 12 }}>
          <strong>Note:&nbsp;</strong>
          <div>
            {(data.meta?.notes || []).map((n, i) => (
              <p key={i} style={{ margin: "4px 0" }}>
                • {n}
              </p>
            ))}
          </div>
        </div>
      </aside>

      <section className="card chart-card" aria-labelledby="trend-title">
        <h3 id="trend-title">Cumulative Interest & Total Paid Over Time</h3>
        <div style={{ position: "relative", width: "100%", height: 420 }}>
          <canvas id="trendChart" ref={lineRef} aria-label="Line chart of cumulative totals" />
        </div>
        <div className="chart-subtitle">
          Track how total interest and total outlay grow month over month.
        </div>
      </section>

      <section className="card pad" aria-labelledby="schedule-title">
        <h3 id="schedule-title">Amortization Schedule (Monthly)</h3>
        <div style={{ maxHeight: 360, overflow: "auto", border: "1px solid var(--border)", borderRadius: 12 }}>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Base</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Balance End</th>
              </tr>
            </thead>
            <tbody>
              {data.schedule.map((r) => (
                <tr key={r.period}>
                  <td>{r.period}</td>
                  <td>{currency(Number(r.payment_base))}</td>
                  <td>{currency(Number(r.principal))}</td>
                  <td>{currency(Number(r.interest))}</td>
                  <td>{currency(Number(r.tax))}</td>
                  <td>{currency(Number(r.payment_total))}</td>
                  <td>{currency(Number(r.balance_end))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <p className="fine">
          For demonstration only. Actual tax handling can differ (Texas commonly applies sales tax
          upfront on vehicle purchases). This view follows your monthly-tax spec.
        </p>
      </footer>
    </div>
  );
}

/* ------- helpers (match your demo behavior/format) ------- */

function currency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

function pulseById(id: string) {
  const el = document.getElementById(id)?.closest(".card");
  if (!el) return;
  el.classList.add("pulse");
  setTimeout(() => el.classList.remove("pulse"), 900);
}

function downloadJSON(d: FinanceResponse | null) {
  if (!d) return;
  const raw = JSON.stringify(d, null, 2);
  const blob = new Blob([raw], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: "toyota_finance_demo.json",
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function freezeChartToImage(chart: Chart | null, canvasId: string) {
  if (!chart) return;
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return;
  // convert to Base64 image and replace canvas (stable no-animate view)
  const url = chart.toBase64Image("image/png", 1);
  const img = new Image();
  img.src = url;
  img.alt = canvas.getAttribute("aria-label") || "chart";
  img.style.width = "100%";
  img.style.height = "420px";
  canvas.replaceWith(img);
  chart.destroy();
}

/* ------- CSS lifted from your static page ------- */

const CSS = `
:root{
  --toyota-red:#EB0A1E;
  --bg:#ffffff; --text:#0f0f0f; --muted:#f4f4f4; --ink-2:#666; --ink-3:#999; --border:#e8e8e8;
  --card-shadow: 0 8px 24px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.04);
  --radius: 18px;
}
*{box-sizing:border-box}
html{scroll-behavior:auto}
body{overscroll-behavior:contain}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(235,10,30,.35)}100%{box-shadow:0 0 0 6px rgba(235,10,30,0)}}
.pulse{animation:pulse .9s ease-out 1}
html,body{margin:0;height:100%;background:var(--bg);color:var(--text);font-family:Poppins,system-ui,-apple-system,Segoe UI,Roboto,Arial,"Noto Sans",sans-serif}
a{color:var(--toyota-red);text-decoration:none}
header{
  background:linear-gradient(0deg, rgba(235,10,30,.96), rgba(235,10,30,.96)), url('');
  color:#fff;border-bottom:1px solid rgba(255,255,255,.08)
}
.wrap{max-width:1200px;margin:0 auto;padding:18px}
.brand{display:flex;align-items:center;gap:14px}
.brand img{height:36px;filter:drop-shadow(0 1px 0 rgba(0,0,0,.15))}
.brand h1{font-size:18px;margin:0;font-weight:600;letter-spacing:.3px}
.grid{display:grid;gap:22px;grid-template-columns:1.2fr .8fr}
@media (max-width: 980px){ .grid{grid-template-columns:1fr} }
.card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--card-shadow)}
.card h3{margin:0 0 8px;font-size:16px}
.card .pad{padding:16px 18px}
.chart-card{padding:14px 16px 18px}
canvas{width:100%;height:420px;}
.chart-subtitle{font-size:12px;color:var(--ink-2);margin-top:6px}
.kpis{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media (max-width: 560px){ .kpis{grid-template-columns:1fr} }
.kpi{padding:14px 16px;border-radius:14px;border:1px solid var(--border);background:var(--muted)}
.kpi .label{font-size:12px;color:var(--ink-3)}
.kpi .value{font-size:18px;font-weight:600}
.note{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:12px;background:#fff7f7;border:1px solid #ffd9de}
.pill{display:inline-block;padding:2px 8px;border-radius:999px;background:#ffe0e3;color:#a30717;font-weight:600;font-size:12px;letter-spacing:.2px}
table{width:100%;border-collapse:collapse}
th,td{padding:10px 8px;border-bottom:1px dashed var(--border);font-size:12px;text-align:right;white-space:nowrap}
th:first-child, td:first-child{text-align:left}
tbody tr:hover{background:#fafafa}
footer{margin-top:24px;border-top:1px solid var(--border)}
.fine{font-size:12px;color:var(--ink-3)}
.toolbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.btn{appearance:none;border:1px solid var(--border);background:#fff;border-radius:12px;padding:8px 12px;font-weight:600;cursor:pointer}
.btn.primary{background:var(--toyota-red);border-color:var(--toyota-red);color:#fff}
`;
