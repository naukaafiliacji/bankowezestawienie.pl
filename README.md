# BankRanking starter

Gotowy statyczny starter pod GitHub Pages.

## Struktura

- `/index.html` — międzynarodowa strona główna
- `/pl/` — Polska
- `/de/` — Niemcy
- `/fr/` — Francja
- `/assets/css/styles.css` — wspólny design
- `/assets/js/app.js` — oferty, sortowanie, filtrowanie i linki afiliacyjne

## Jak podmienić oferty

Otwórz `assets/js/app.js` i znajdź obiekt `offers`.

Każda oferta ma pola:
- `bank`
- `product`
- `category`: `personal`, `savings`, `business`
- `fee`
- `bonus`
- `rating`
- `url`

W `url` wpisz własny link afiliacyjny.

## GitHub Pages

1. Utwórz repozytorium.
2. Wrzuć **zawartość** tego folderu do głównego katalogu repozytorium.
3. W GitHub: Settings → Pages → Deploy from a branch.
4. Wybierz `main` i `/ (root)`.

## Ważne przed publikacją

Dane ofert w tym starterze są demonstracyjne. Nie publikuj fikcyjnych opłat, bonusów ani ocen jako aktualnych informacji.
Dostosuj również disclosure, politykę prywatności/cookies, regulaminy i wymagane informacje prawne dla każdego rynku.
