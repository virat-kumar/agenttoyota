import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
    assumed_vehicle_price: number;
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

  return (
    <html lang="en">
      <head>
        <title>{vehicleName}</title>
        {/* Optional: font like your static page. You can also move this link to index.html. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <style>{CSS}</style>

        <header>
          <div className="wrap">
            <div className="brand">
              <img
                alt="Toyota logo"
                src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_logo.png"
              />
              <h1>{vehicleName}</h1>
            </div>
          </div>
        </header>

        <div className="wrap" style={{ paddingTop: 22 }}>
          <div className="toolbar" style={{ marginBottom: 12 }}>
            <span className="pill">Dynamic from API</span>
            <button className="btn primary" id="btnFocusBar" onClick={() => pulseById("stacked-title")}>
              Focus: Stacked Payments
            </button>
            <button className="btn" id="btnFocusLine" onClick={() => pulseById("trend-title")}>
              Focus: Cumulative
            </button>
            <button className="btn" id="btnDownload" onClick={() => downloadJSON(data)}>
              Download JSON
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
            <Content data={data} />
          )}
        </div>
      </body>
    </html>
  );
}

function Content({ data }: { data: FinanceResponse }) {
  const barRef = useRef<HTMLCanvasElement | null>(null);
  const lineRef = useRef<HTMLCanvasElement | null>(null);
  const [barChart, setBarChart] = useState<Chart | null>(null);
  const [lineChart, setLineChart] = useState<Chart | null>(null);

  useEffect(() => {
    // Stacked bar chart
    const barCtx = barRef.current?.getContext("2d");
    const _bar = barCtx
      ? new Chart(barCtx, {
          type: "bar",
          data: {
            labels: data.chartjs.labels,
            datasets: data.chartjs.datasets.map((ds) => ({
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
            })),
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

    // Freeze charts to static images (like your demo)
    freezeChartToImage(_bar, "stackedChart");
    freezeChartToImage(_line, "trendChart");

    return () => {
      _bar?.destroy();
      _line?.destroy();
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
            ["Vehicle Price", currency(data.totals.assumed_vehicle_price)],
            ["Amount Financed", currency(data.totals.amount_financed)],
            ["APR", `${data.totals.apr_percent}%`],
            ["Term", `${data.totals.term_months} months`],
            ["Monthly (Base)", currency(data.totals.monthly_payment_base)],
            ["Monthly Tax", currency(data.totals.monthly_tax)],
            ["Monthly (Total)", currency(data.totals.monthly_payment_total)],
            ["Total Interest", currency(data.totals.total_interest)],
            ["Total Tax", currency(data.totals.total_tax_paid)],
            ["Total Paid (incl. tax)", currency(data.totals.total_paid_including_tax)],
            ["Due at Signing", currency(data.totals.customer_due_at_signing)],
            ["Principal Repaid", currency(data.totals.principal_repaid)],
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
