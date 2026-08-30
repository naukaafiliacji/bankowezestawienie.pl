# BankRanking V42 — Ascend-style redesign

This is a visual redesign patch for the existing BankRanking Europe repository.

Included:
- new EN / DE / ES / FR homepages;
- new dark premium homepage CSS + reveal micro-interactions;
- replacement `assets/css/three-verticals.css` that restyles the existing country ranking pages in the same visual language;
- replacement `assets/css/site.css` for research, methodology, services, legal and editorial subpages;
- CNAME remains `bankranking.eu`.

Deployment:
Copy the CONTENTS of this folder into the existing repository root and replace files with matching names.
Do not delete the rest of the existing repository: country pages, data files, logos, methodology, research and other informational pages remain in the project.

The ranking stylesheet is deliberately high-specificity because older ranking pages contain cache-proof inline CSS.
