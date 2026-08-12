# BankRanking / bankowezestawienie.pl — V2

Professional static comparison portal for GitHub Pages.

## Publish
Copy the **contents** of this folder into the root of your local Git repository, then:
1. Commit to `main`
2. Push origin
3. GitHub → Settings → Pages → `main` / `(root)`
4. Custom domain: `bankowezestawienie.pl`

`CNAME` and `.nojekyll` are already included.

## Affiliate links
All product data is in:
`assets/js/data.js`

Each offer contains:
- `officialUrl` — source / official product page
- `affiliateUrl` — replace this with your affiliate tracking URL

Right now `affiliateUrl` points to the official bank page, because your affiliate URLs were not provided.

## Editing product data
The production version should update:
- fee
- bonus
- interest rate
- summary
- conditions
- verification date
- score breakdown

whenever the bank changes its offer.

## Important
The site includes a real editorial/affiliate architecture, but the privacy/contact/legal pages still contain explicit reminders to insert your company's actual legal and contact data before commercial launch.

## Structure
- `/` international homepage
- `/pl/`, `/de/`, `/fr/`
- country-specific category URLs
- editorial policy / methodology / disclosure
- guides
- filters
- 2–3 offer comparison drawer
- score detail modal
- SEO sitemap / canonical URLs / CNAME

## Contact email
Public pages use `kontakt@bankowezestawienie.pl`. Create/configure this mailbox before relying on it for customer contact.
