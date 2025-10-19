def apr_percent_from_credit_score(score: int) -> float:
    """
    Map a U.S. FICO credit score (300–850) to an estimated auto-loan APR percent.
    Returns a PERCENT (e.g., 7.9 for 7.9%). Demo heuristic, not a quote.

    Args:
        score: FICO score (300–850). Values are clamped to this range.

    Buckets (illustrative):
      781–850: ~5.9%
      661–780: ~7.9%
      601–660: ~11.5%
      501–600: ~16.9%
      300–500: ~22.9%
    """
    s = max(300, min(850, int(score)))
    tiers = [
        (781, 850, 5.9),
        (661, 780, 7.9),
        (601, 660, 11.5),
        (501, 600, 16.9),
        (300, 500, 22.9),
    ]
    for lo, hi, apr in tiers:
        if lo <= s <= hi:
            return apr
    return 9.9  # fallback (shouldn't hit due to clamping)
