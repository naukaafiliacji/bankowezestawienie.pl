# BankRanking V6 — data-first European bank portal

## Architecture
- `/` — data-first homepage: latest rankings, bank search, banking snapshot, bank directory preview, offers, comparisons, guides
- `/banks/` — directory of 33 bank brands
- `/banks/<bank>/` — bank profile with markets and tracked products
- `/rankings/` — ranking hub
- `/<market>/` — mini country portal
- `/<market>/rankings/current-accounts/` — full compact ranking with 18–26 / 26+
- `/offers/` — time-sensitive offers separated from editorial rankings
- `/compare/` — selected bank-vs-bank comparisons
- `/accounts/` and `/guides/` — product/category and guide hubs

## Research snapshot
12.08.2026. Product offers remain time-sensitive and should be rechecked after deadlines.

## Affiliate links
Edit `affiliateUrl` in `assets/js/data.js`. Keep `officialUrl` as the evidence/source link.

## Deployment
Copy the CONTENTS of this folder into the repository root, Commit to main, Push origin. `CNAME` remains `bankowezestawienie.pl`.
