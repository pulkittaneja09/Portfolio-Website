---
title: Predicting battery RUL with a Random Forest
date: 2026-11-22
# Set the real date and a one-line summary when you publish, then delete `draft: true`.
summary: TODO(pulkit) one sentence for the notes list, the RSS feed and the meta description.
draft: true
---

> **Draft outline — not published.** This file stays out of the site, the feed and the sitemap
> until `draft: true` is removed. Everything below is a note to yourself: facts from
> `src/data/portfolio.ts`, and the questions the post should answer. Write the post in your own words.

## The question

- Retired EV batteries get scrapped with life left. Scrap 2 Spark turns cycle-level telemetry into a
  second-life decision: remaining useful life with a confidence score, a battery grade, a risk
  category and a recommended application. Built at the SDG hackathon.

## The data

- The NASA Battery Dataset: 2,716 charge/discharge cycles across 34 cells.
- TODO(pulkit): how the held-out set was split — by cell or by cycle — and the ratio. This decides
  whether R² = 0.879 measures generalisation to batteries the model has never seen.

## Features, not raw readings

- Capacity degradation trend, voltage stability, temperature variance and current consistency,
  engineered across each cell's cycle history rather than per-cycle snapshots.
- Thirty-four cells is a small training set and per-cell variance is large, so a high-variance model
  memorises individual batteries; trend features gave the forest signal that generalises across cells.

## Why a Random Forest

- It handles the nonlinear capacity-fade relationship, resists overfitting on a small cell count, and
  needs minimal preprocessing.
- Result: R² = 0.879 on held-out data.
- TODO(pulkit): baseline numbers (for example a linear model) if you ran them.

## From a number to a decision

- RUL → risk classification → deployment recommendation → sustainability estimate, so the output is
  actionable rather than a bare prediction float.
- TODO(pulkit): the thresholds the service really uses for grades and risk categories.

## Shipping it during a hackathon

- The API runs on Render's free tier (which sleeps) and the frontend on Vercel; the client handles the
  cold start explicitly with request state, so a judge never sees a silent failure.

## What is next

- Compare against gradient boosting and a small sequence model on the same split.
- Report prediction intervals, not just a point estimate and a confidence score.
- Persist uploaded fleets so degradation can be tracked over time.
