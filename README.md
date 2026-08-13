# BankRanking V5 — homepage closely inspired by bank.nl

This build preserves the existing V5 country ranking pages and data.
The homepage has been rebuilt in a much simpler portal style inspired by the structure and visual rhythm of bank.nl, but uses original BankRanking copy and original/local graphics.

Key homepage choices:
- light-blue hero
- account categories immediately visible
- original composition of debit-card graphics using BankRanking's local bank logo assets
- independent-comparison disclosure directly below the primary choices
- featured current-account offers
- editorial account insight
- bank cards
- account knowledge section
- personal / 18–26 / 26+ / business account categories
- simplified footer

Important:
- no USA
- no mortgage / loans / insurance categories
- no Google Translate popup
- CNAME remains bankowezestawienie.pl
- homepage styles are embedded directly in index.html so the page does not collapse into unstyled text if an old CSS asset is cached incorrectly.

## Homepage editorial promotion feature
The former three-card "Worth checking now" section has been replaced by a single editorial "Did you know?" feature about BBVA Spain's current Young Account flight promotion.
The visual uses an original boarding-pass composition and keeps the terms deliberately short.
Source: official BBVA Spain Young Account page, checked 13 Aug 2026.


## Knowledge hub section
Homepage now includes a bank.nl-inspired knowledge/newsroom section:
- large left editorial column with three article-style entries
- right column with two featured/sponsored-style cards
- adapted and original text in EN / ES / DE / FR
- implemented as a homepage replacement for the former simple Guides section

## Insights newsroom update
- Removed the explanatory Knowledge Hub subtitle entirely.
- Section label is now simply “Insights”.
- Editorial cards now use current/recent banking stories inspired by Bank.nl:
  ABN AMRO/NIBC, GoDutch/Messi/Mastercard and payment-fraud growth.
- Featured cards use current Bank.nl product information for Raisin RenteBoost and Bunq savings.


## Expanded footer and product architecture
- Footer rebuilt in a Bank.nl-inspired structure (without the Netherlands-bank column).
- New top-level areas: bank accounts, savings/deposits and investing.
- No loan / mortgage / credit section added.
- Added specific account types: business, joint, student, child and youth.
- Added savings: savings accounts, fixed-term deposits, business savings, child savings and rate overview.
- Added investing: investment accounts, funds, managed, self-directed, retirement, business investing and broker overview.
- Added Research / Services / Disclaimer / Contact information pages.
- Added the disclaimer: BankRanking is not a bank or financial institution.
- Generated 92 supporting category/info pages across EN/ES/DE/FR paths.


## V7 multi-category engine
- 8 country ranking pages, each with 16 category views (128 combinations).
- Personal preserves the existing 18–26 / 26+ score logic and existing product dataset.
- Banking: personal, business, joint, student, youth, children.
- Saving: savings, fixed-term deposits, business savings, child savings.
- Investing: investment account, funds, managed, self-directed, retirement, business investing.
- Investing defaults to Banks & bank groups; Specialist / non-bank market is a separate toggle.
- Former footer placeholders are now category hubs linking to the 8 live country rankings.
- /research-sources/ documents the research-source directory.
- Research snapshot: 13 August 2026.


## V8 three-vertical architecture
Each country is now split into /banking/, /saving/, and /investing/. The old /COUNTRY/ page is a simple 3-card hub. /COUNTRY/banks/ redirects to /COUNTRY/banking/. Ranking typography and spacing were enlarged.


## V17 — EU27 + UK major-bank coverage
Updated 13 August 2026.

- Expanded from 8 to 28 country markets: all 27 EU member states + United Kingdom.
- Featured homepage markets remain the original 8; the other 20 EU states are under an expandable “See other EU countries” directory.
- Every country links directly to /COUNTRY/banking/.
- Created/updated 84 Banking / Saving / Investing vertical pages.
- Expanded Personal rankings to major retail-bank shortlists (typically 6–13 providers depending on market concentration).
- Expanded Business / Joint / Student / Youth / Child / Savings / Deposit rankings beyond the previous 3-provider model.
- Investment rankings retain Banks & bank groups as the default and Specialist market as the second view.
- Country navigation is now a compact dropdown rather than attempting to show 28 markets in one horizontal header.
- Clearbit dependency removed from ranking logos; existing verified full logos are used where available, otherwise official-domain favicons.
- Research source directory updated for all markets.


## V32 — Research methodology 2.0
Expanded /methodology/ into a public research protocol covering scope, evidence grades, data normalisation, category-specific decision rules, promotions, robustness, commercial independence, freshness, corrections, limitations and a 30+ source reference library. Methodology effective 13 August 2026.
