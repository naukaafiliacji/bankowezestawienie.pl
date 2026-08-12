# BankRanking V4 — English global edition

Ready for GitHub Pages / bankowezestawienie.pl.

## Main changes
- Every market page and guide is now written in English.
- All HTML uses `<html lang="en">`.
- 9 markets / 33 researched offers.
- Automatic on-site translation suggestion for visitors whose browser language is not English.
- The translation button opens Google Translate for the current URL.
- Chrome's native translation UI cannot be forced by page JavaScript; Chrome decides whether to offer it based on browser settings and language detection.
- Full legal/editorial footer added.

## Legal pages
- /legal/privacy/
- /legal/cookies/
- /legal/terms/
- /legal/affiliate-disclosure/
- /legal/legal-notice/
- /legal/financial-disclaimer/
- /legal/editorial-policy/
- /legal/methodology/
- /legal/corrections/
- /legal/accessibility/
- /legal/privacy-choices/
- /legal/contact/

## REQUIRED BEFORE COMMERCIAL LAUNCH
Edit:
`assets/js/operator-config.js`

Fill in the REAL operator details:
- legal entity / sole trader name
- legal form
- registered address
- country of establishment
- company / registry number
- registry
- VAT / tax number if applicable
- authorised representative
- responsible editor / publication director where applicable
- phone if legally required / used
- relevant supervisory authority if applicable

The site intentionally does NOT invent these details.

## Affiliate links
Offer data remains in:
`assets/js/data.js`

Each offer has:
- `officialUrl` — research source
- `affiliateUrl` — replace with your affiliate link
- `promoEnd`
- `benefit`
- `benefitType`
- `verified`

## Translation
The site does not embed the legacy Google Website Translator widget.
For non-English browser languages, it shows an on-page top-right prompt with a “Translate with Google” button.
The close action uses sessionStorage key `br_translate_dismissed`; it is a UI preference, not advertising tracking.

## Analytics / cookies
This build does not add GA4, Meta Pixel or advertising cookies.
If you add any non-essential analytics, remarketing or tracking technology, update Privacy/Cookies and implement consent where required.

## Deploy
Copy the CONTENTS of this folder to the root of your local Git repository, then:
Commit to main → Push origin.
CNAME remains `bankowezestawienie.pl`.
