# Server Process Monitoring Dashboard

React + Vite demo dashboard based on Chapter 18, "Server Process Monitoring," from *The Big Book of Dashboards*.

## Demo Story

The dashboard answers the morning administrator question: did overnight Tableau Server refresh processes succeed, and which failed or delayed tasks need investigation?

Default demo state:

- Date: Sunday, March 20, 2016
- Failure rate: 6.7%
- Main failed process: Epic Radiant Orders
- Interaction path: overview -> daily timeline -> process detail history

## Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verify

```bash
npm run test
npm run build
```

## Deploy To GitHub Pages

This project is configured for GitHub Pages through GitHub Actions.

1. Push the branch to a GitHub repository.
2. In the GitHub repository, open `Settings -> Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Merge or push to `master`, or run the `Deploy to GitHub Pages` workflow manually from the Actions tab.

The Vite base path is detected automatically in GitHub Actions:

- `https://<username>.github.io/<repo>/` uses `/<repo>/`.
- `https://<username>.github.io/` uses `/`.

## Capstone Talking Points

- Objective: monitor overnight server processes before users arrive.
- Story: identify abnormal failure rate, inspect failed process, determine whether failure is recurring.
- Display choices: overview bar chart, Gantt-style process timeline, reference lines, tooltip, history detail.
- Strengths: simple top-down flow, fast diagnosis, details on demand.
- Weaknesses in original: overlapping labels/reference lines and limited presentation polish.
- Improvements in this demo: KPI strip, cleaner controls, modern visual hierarchy, clearer selected states.
