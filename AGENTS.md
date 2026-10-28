# Repository guide

## Support desk page — S01E03

Live support desk page:
[https://michal-megadev-repo.github.io/mega-dev-s01e03/](https://michal-megadev-repo.github.io/mega-dev-s01e03/).

The support desk page is **`index.html` in the repository root**:
[open the HTML file](index.html).

All paths below are relative to this repository's root.

| Artifact | Location |
| --- | --- |
| Standalone page for the support desk | [index.html](index.html) |
| Signed source in the knowledge base | [src/routes/kb/decisions/0002-review-4471/+page.svx](src/routes/kb/decisions/0002-review-4471/+page.svx) |
| Rendered page at the original KB route | [dist/kb/decisions/0002-review-4471/index.html](dist/kb/decisions/0002-review-4471/index.html) |
| Full-page screenshot | [rendered/review-4471.jpg](rendered/review-4471.jpg) |

The page is titled **0002 · Split #4471 by evidence before merging**.
Its owner and signature are **michal-megadev-repo**.
It describes the separate problems in ticket #4471, report counts, engineering
dispositions, unresolved exceptions and source evidence.

The root HTML is a complete static document with embedded styles and chart.
Download it and open it in a browser; no JavaScript, package installation or server
is needed to view that file. GitHub's file viewer displays HTML source code.

The `.svx` file is the editable KB source. Its component output is already present
in both HTML versions. Further navigation and build instructions are in [README.md](README.md).
