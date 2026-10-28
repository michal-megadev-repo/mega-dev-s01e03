# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 review

Course exercise: this repository contains the fictional support-desk export and an
evidence-based review of ticket #4471. It is not a live product bug tracker.

The review separates 412 unique reports (427 exported rows) into 374 shared-parser
reports, 33 booking-v3 hint reports, and five unresolved one-day/chronology reports.
The last group is an investigation queue, not a proven shared root cause. Counts are
computed from the exported source data. Report IDs are listed in the separate issues.

- Source page: [0002 review](src/routes/kb/decisions/0002-review-4471/+page.svx)
- Rendered page: [HTML](dist/kb/decisions/0002-review-4471/index.html)
- Render evidence: [manifest](render-manifest.json)
- Visual copy: [full-page screenshot](rendered/review-4471.jpg)
- Issues: [shared parser](https://github.com/michal-megadev-repo/mega-dev-s01e03/issues/1),
  [form hint](https://github.com/michal-megadev-repo/mega-dev-s01e03/issues/2),
  [unresolved symptoms](https://github.com/michal-megadev-repo/mega-dev-s01e03/issues/3)

The new decision is a proposal replacing subject-only deduplication. The accepted
historical decision remains unchanged. Original event offsets are preserved; received
and merged timestamps are not interpreted as booking-event times.

A later [course engineering update](https://hq.mega.dev/challenges/what-it-shows#engineering-update)
marks #4471 closed on “05 oct”: parser fixed; hint won't fix because booking-v3 was
retired. Issue 1 is completed and issue 2 is not planned on that evidence. Issue 3
retains the five unresolved exceptions; the update does not explain them. No year,
time or timezone is added to the engineering update's date.

### View the actual page

Use Node.js 22 or newer. Dependencies install locally; lifecycle scripts stay disabled
by `.npmrc`. The checked-in `dist` contains the rendered pages and browser assets, so
the static preview can also run without installing dependencies:

```sh
node tooling/serve.mjs
```

Open `http://127.0.0.1:4173/kb/decisions/0002-review-4471`.
GitHub's file viewer displays HTML source; the local preview displays the desk's page.

To reproduce the build:

```sh
npm ci --ignore-scripts
npm run build
```

The direct packages and relevant Rollup/Prism resolutions are pinned. At the review
date, npm audit reported one low-severity advisory in `deepmerge` (also propagated to
its two dependents). The Svelte plugin uses it only for configuration; this harness
disables config autodiscovery and the inspector. It never merges report data into
plugin options. This containment is not a patch, and the audit warning remains.
