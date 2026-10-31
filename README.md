# CampusLoop — Campus Lost & Found

CampusLoop is a responsive, browser-based lost-and-found board prototype created for an ELC3143 Software Engineering practice-based assignment.

> **Prototype warning:** This is not a live campus service. Listings and saved claims are stored in the current browser profile only. There is no backend, account system, cross-device sync, verified ownership, or real messaging. Seed listings are fictional.

## Features
- Browse all listings, lost-only listings, found-only listings, and locally saved claims.
- Create a lost-item or found-item listing with required-field validation.
- Search by item name, category, location, colour, description, or listing type.
- Filter by category and sort by newest or oldest.
- View listing details.
- Save or remove a local follow-up flag in My Claims.
- Mark a listing as reunited.
- Delete user-created listings after confirmation; seeded demo records are protected in the UI.
- Responsive layout for desktop and mobile viewports.
- Fictional sample data for demonstrations.

## Run the website

No package installation is required.

1. Extract the project folder.
2. Open `index.html` in a modern browser.
3. If your browser restricts local-file storage, run a local server from this folder:

   ```bash
   python -m http.server 8000
   ```

4. Open `http://localhost:8000` in the browser.

## Project structure

```text
campus_lost_found/
├── index.html
├── css/style.css
├── js/app.js
├── docs/
│   ├── REQUIREMENTS_SPECIFICATION.md
│   ├── DEVELOPMENT_PLAN.md
│   ├── ARCHITECTURE.md
│   ├── TEST_PLAN.md
│   ├── ISSUE_LOG.md
│   ├── DEMO_PLAN.md
│   ├── FINAL_CHECKLIST.md
│   └── diagrams/
├── tests/
│   ├── TRACEABILITY_MATRIX.csv
│   └── browser_smoke_test.py
└── README.md
```

## Quick manual smoke test

1. Open the site and confirm the sample listings and summary counts appear.
2. Search for `earbuds` and confirm a matching listing appears.
3. Filter by `Electronics` and confirm displayed listings belong to that category.
4. Create a fictional found listing and confirm it appears on the board.
5. Open a listing, save it to My Claims, and confirm it appears in that view.
6. Mark an open listing as reunited and confirm the status/count updates.
7. Refresh the page and confirm saved data persists when browser storage is available.
8. Clear filters and confirm the full board returns.
9. Inspect the layout at a narrow mobile width.
10. Record actual outcomes in `docs/TEST_PLAN.md`; report failures in `docs/ISSUE_LOG.md`.

## Optional automated browser smoke tests

The website itself needs no Python dependencies. To run the optional browser test script, install Python Playwright and its Chromium browser in your environment:

```bash
python -m pip install playwright
python -m playwright install chromium
python tests/browser_smoke_test.py
```

The script starts a temporary local server and writes observed outcomes to `tests/browser_smoke_results.json`. Do not report results as passed unless the script actually completes successfully in your environment.

## Documentation and assignment artefacts
- `docs/REQUIREMENTS_SPECIFICATION.md` — problem, scope, stakeholders, assumptions, functional/non-functional requirements, user stories, risks.
- `docs/DEVELOPMENT_PLAN.md` — process choice, work breakdown, effort estimate, milestones, architecture.
- `docs/ARCHITECTURE.md` and `docs/diagrams/` — architecture and conceptual models.
- `docs/TEST_PLAN.md` — planned cases and result-recording instructions.
- `tests/TRACEABILITY_MATRIX.csv` — requirements-to-test mapping.
- `docs/ISSUE_LOG.md` — record only issues actually observed.
- `docs/DEMO_PLAN.md` — suggested 5–7 minute walkthrough.
- `docs/FINAL_CHECKLIST.md` — final readiness checklist.

## Limitations and safety
- Listings and claims are local to one browser profile; other users cannot see them.
- Clearing site data may remove stored records.
- Claims are only local flags and do not contact the listing poster.
- Ownership is not verified and reports are not moderated.
- Do not enter real student IDs, passwords, phone numbers, confidential details, or sensitive item identifiers.
- A production version would require a backend, access control, moderation, secure handover procedures, and privacy/security review.

## Technology and AI declaration
- HTML5, CSS3, vanilla JavaScript, browser `localStorage`.
- No JavaScript framework or external runtime library is required. Google Fonts are an optional remote visual enhancement when online.
- AI assistance was used to draft/assist with the initial prototype and project documentation. The student should inspect, understand, verify, and disclose this assistance according to the course's academic-integrity requirements.

## Testing integrity
A test plan is not evidence that tests passed. Record results only after running each test. Do not invent defects, results, interviews, commits, or contributions. Confirm any course-specific submission requirements with the instructor.
