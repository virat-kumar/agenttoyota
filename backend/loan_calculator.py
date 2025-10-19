from __future__ import annotations
from decimal import Decimal, ROUND_HALF_UP, getcontext
from typing import Dict, Any, List

# Money math setup
getcontext().prec = 28

def _D(x) -> Decimal:
    return x if isinstance(x, Decimal) else Decimal(str(x))

def _q2(x: Decimal) -> Decimal:
    return x.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)



# Money math setup
getcontext().prec = 28

def _D(x) -> Decimal:
    return x if isinstance(x, Decimal) else Decimal(str(x))

def _q2(x: Decimal) -> Decimal:
    return x.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def build_loan_chartjs_data(
    *,
    vehicle_amount: float | Decimal,            # <-- added parameter
    down_payment_cash: float | Decimal = 0,
    term_months: int,
    apr_percent: float | Decimal,
    tax_rate: float | Decimal = 0.0825,         # Dallas combined 8.25% as default
) -> Dict[str, Any]:
    """
    Compute a vehicle LOAN breakdown (monthly-tax visualization) and return a Chart.js-ready payload.

    Inputs:
      - vehicle_amount: total vehicle price used for the demo visualization
      - down_payment_cash: cash paid today (default 0)
      - term_months: loan term in months
      - apr_percent: APR percentage (e.g., 4.5 for 4.5%)
      - tax_rate: monthly tax on each base payment (default 0.0825 for Dallas)

    Note: For visualization, sales tax is applied monthly to each payment per your spec.
    """
    # ---------- Normalize inputs ----------
    vehicle_amt = _q2(_D(vehicle_amount))
    dp = _q2(_D(down_payment_cash))
    n = int(term_months)
    apr = _D(apr_percent) / Decimal(100)
    tax = _D(tax_rate)

    if n <= 0:
        raise ValueError("term_months must be > 0")

    # ---------- Amount financed ----------
    financed = vehicle_amt - dp
    if financed < 0:
        financed = Decimal("0.00")

    # ---------- Base payment (no tax) ----------
    i = apr / Decimal(12)
    if i == 0:
        payment_base = _q2(financed / Decimal(n))
    else:
        payment_base = _q2(i * financed / (Decimal(1) - (Decimal(1) + i) ** (Decimal(-n))))

    # Monthly tax applied to payment (per your requirement; demo visualization)
    monthly_tax = _q2(payment_base * tax)
    monthly_payment_total = _q2(payment_base + monthly_tax)

    # ---------- Amortization loop ----------
    balance = financed
    principal_series: List[Decimal] = []
    interest_series: List[Decimal] = []
    tax_series: List[Decimal] = []
    labels: List[str] = []
    schedule: List[Dict[str, Any]] = []

    cum_interest = Decimal("0.00")
    cum_total_paid = Decimal("0.00")
    cumulative_interest_series: List[Decimal] = []
    cumulative_total_series: List[Decimal] = []
    payment_total_per_month: List[Decimal] = []

    total_interest = Decimal("0.00")

    for k in range(1, n + 1):
        interest = _q2(balance * i) if i > 0 else Decimal("0.00")
        principal = payment_base - interest
        # Guard final period rounding
        if principal > balance:
            principal = balance
            payment_this_base = _q2(interest + principal)
        else:
            payment_this_base = payment_base

        balance = _q2(balance - principal)

        # Bar series data
        principal_series.append(principal)
        interest_series.append(interest)
        tax_series.append(monthly_tax)
        labels.append(str(k))

        # Timeseries
        cum_interest += interest
        cum_total_paid += _q2(payment_this_base + monthly_tax)
        cumulative_interest_series.append(_q2(cum_interest))
        cumulative_total_series.append(_q2(cum_total_paid))
        payment_total_per_month.append(_q2(payment_this_base + monthly_tax))

        total_interest += interest

        schedule.append({
            "period": k,
            "payment_base": payment_this_base,
            "interest": interest,
            "principal": principal,
            "tax": monthly_tax,
            "payment_total": _q2(payment_this_base + monthly_tax),
            "balance_end": balance
        })

    total_interest = _q2(total_interest)
    total_tax_paid = _q2(monthly_tax * n)
    total_paid_including_tax = _q2(sum(payment_total_per_month))

    # ---------- Chart.js payload ----------
    chartjs = {
        "labels": labels,
        "datasets": [
            {
                "label": "Principal",
                "type": "bar",
                "stack": "payment",
                "data": [float(_q2(x)) for x in principal_series],
            },
            {
                "label": "Interest",
                "type": "bar",
                "stack": "payment",
                "data": [float(_q2(x)) for x in interest_series],
            },
            {
                "label": "Tax",
                "type": "bar",
                "stack": "payment",
                "data": [float(_q2(x)) for x in tax_series],
            },
        ]
    }

    timeseries = {
        "cumulative_interest": [float(x) for x in cumulative_interest_series],
        "cumulative_total_paid": [float(x) for x in cumulative_total_series],
        "payment_total_per_month": [float(x) for x in payment_total_per_month],
    }

    totals = {
        "vehicle_amount": float(vehicle_amt),          # <-- renamed from assumed_vehicle_price
        "down_payment_cash": float(dp),
        "amount_financed": float(financed),
        "apr_percent": float(_q2(apr * 100)),
        "term_months": n,
        "tax_rate": float(_q2(tax)),
        "monthly_payment_base": float(payment_base),
        "monthly_tax": float(monthly_tax),
        "monthly_payment_total": float(monthly_payment_total),
        "total_interest": float(total_interest),
        "total_tax_paid": float(total_tax_paid),
        "total_paid_including_tax": float(total_paid_including_tax),
        "customer_due_at_signing": float(dp),
        "principal_repaid": float(financed),
    }

    return {
        "meta": {
            "mode": "monthly_tax_visualization",
            "notes": [
                "Dallas default tax 8.25% applied to each monthly payment for visualization.",
                "This is for demo/visualization; lenders/dealers may apply taxes differently."
            ]
        },
        "chartjs": chartjs,
        "timeseries": timeseries,
        "totals": totals,
        "schedule": schedule,
    }
