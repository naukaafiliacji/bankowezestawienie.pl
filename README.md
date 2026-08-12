# BankRanking V3 — bankowezestawienie.pl

International static bank-comparison portal for GitHub Pages.

## Coverage
9 markets / 33 researched products:
PL, DE, FR, UK, US, IT, ES, NL, SE.

## Deployment
Copy the CONTENTS of this folder into the root of your local Git repository:
1. GitHub Desktop → Changes
2. Commit to `main`
3. Push origin
4. GitHub Pages source: `main` / `(root)`
5. Custom domain remains `bankowezestawienie.pl`

`CNAME` and `.nojekyll` are included.

## Updating offers
All offer data is centralized in:
`assets/js/data.js`

Every offer has:
- `officialUrl` — evidence/source
- `affiliateUrl` — destination to replace with your affiliate tracking URL
- `promoEnd` — promotion deadline
- `benefit` and `benefitType`
- fee / rate / summary / pros / cons
- `verified` date
- BankRanking score breakdown

At the moment `affiliateUrl == officialUrl` for every offer.

## IMPORTANT — time-sensitive data
Research snapshot: 12.08.2026.
Promotions MUST be rechecked after their deadlines.
The Polish ING promotion in this snapshot has a deadline of 12.08.2026 and is intentionally marked as ending today.

## Contact
Public contact: `kontakt@bankowezestawienie.pl`.
Make sure this mailbox exists before relying on it publicly.

## Legal / analytics
This is a static comparison build. If you add GA4, Meta Pixel, affiliate-network tracking cookies,
personalization, forms, or user accounts, update the privacy/cookies layer accordingly.
