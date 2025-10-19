from __future__ import annotations
from decimal import Decimal, ROUND_HALF_UP, getcontext
from typing import Dict, Any, List

getcontext().prec = 28

def _D(x) -> Decimal:
    return x if isinstance(x, Decimal) else Decimal(str(x))

def _q2(x: Decimal) -> Decimal:
    return x.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def _residual_rate_for_term(term_months: int) -> Decimal:
    t = int(term_months)
    table = {24: Decimal("0.68"), 30: Decimal("0.64"), 36: Decimal("0.58"),
             39: Decimal("0.56"), 42: Decimal("0.54"), 48: Decimal("0.50")}
    if t in table:
        return table[t]
    if t < 24:
        return Decimal("0.70")
    if t > 60:
        return Decimal("0.42")
    # linear interpolate between 24→0.68 and 60→0.45
    hi_t, hi_r = 24, Decimal("0.68")
    lo_t, lo_r = 60, Decimal("0.45")
    span = lo_t - hi_t
    drop = (hi_r - lo_r) * Decimal((t - hi_t) / span)
    return (hi_r - drop).quantize(Decimal("0.0001"))

def build_lease_chartjs_data_no_tax(
    *,
    vehicle_amount: float | Decimal,
    term_months: int,
    money_factor: float | Decimal = 0.00190,  # ~4.56% APR
    acquisition_fee: float | Decimal = 695.00,
) -> Dict[str, Any]:
    """
    Lease breakdown WITHOUT applying sales tax anywhere.
    Returns Chart.js-ready stacked bars (Depreciation + Finance) and cumulative totals.
    """
    cap_cost = _q2(_D(vehicle_amount))
    mf = _D(money_factor)
    acq = _q2(_D(acquisition_fee))
    n = int(term_months)
    if n <= 0:
        raise ValueError("term_months must be > 0")

    adj_cap_cost = _q2(cap_cost + acq)
    resid_rate = _residual_rate_for_term(n)
    residual_value = _q2(_D(vehicle_amount) * resid_rate)

    depreciation = _q2((adj_cap_cost - residual_value) / Decimal(n))
    finance = _q2((adj_cap_cost + residual_value) * mf)
    payment_total = _q2(depreciation + finance)

    labels: List[str] = [str(i) for i in range(1, n + 1)]
    dep_series = [depreciation] * n
    fin_series = [finance] * n
    pay_series = [payment_total] * n

    cumulative_finance, cumulative_total = [], []
    cum_f = cum_t = Decimal("0.00")
    for i in range(n):
        cum_f += fin_series[i]
        cum_t += pay_series[i]
        cumulative_finance.append(_q2(cum_f))
        cumulative_total.append(_q2(cum_t))

    total_depreciation = _q2(depreciation * n)
    total_finance = _q2(finance * n)
    total_paid = _q2(payment_total * n)

    chartjs = {
        "labels": labels,
        "datasets": [
            {"label": "Depreciation", "type": "bar", "stack": "lease",
             "data": [float(x) for x in dep_series]},
            {"label": "Finance (Rent)", "type": "bar", "stack": "lease",
             "data": [float(x) for x in fin_series]},
        ]
    }

    timeseries = {
        "cumulative_finance": [float(x) for x in cumulative_finance],
        "cumulative_total_paid": [float(x) for x in cumulative_total],
        "payment_total_per_month": [float(x) for x in pay_series],
    }

    totals = {
        "vehicle_amount": float(cap_cost),
        "term_months": n,
        "residual_rate": float(resid_rate),
        "residual_value": float(residual_value),
        "money_factor": float(mf),
        "apr_percent_est": float(_q2(mf * Decimal(2400))),
        "acquisition_fee_financed": float(acq),
        "monthly_depreciation": float(depreciation),
        "monthly_finance": float(finance),
        "monthly_payment_total": float(payment_total),
        "total_depreciation": float(total_depreciation),
        "total_finance": float(total_finance),
        "total_paid": float(total_paid),
    }

    schedule = [
        {
            "period": i + 1,
            "depreciation": float(depreciation),
            "finance": float(finance),
            "payment_total": float(payment_total),
            "residual_value_end": float(residual_value),
        }
        for i in range(n)
    ]

    return {
        "meta": {"notes": ["Tax intentionally excluded for parity with a tax-free loan setup."]},
        "chartjs": chartjs,
        "timeseries": timeseries,
        "totals": totals,
        "schedule": schedule,
    }
