---
title: Building an MCP server with 10+ enterprise tools
date: 2026-11-22
# Set the real date and a one-line summary when you publish, then delete `draft: true`.
summary: TODO(pulkit) one sentence for the notes list, the RSS feed and the meta description.
draft: true
---

> **Draft outline — not published.** This file stays out of the site, the feed and the sitemap
> until `draft: true` is removed. Everything below is a note to yourself: facts from
> `src/data/portfolio.ts` and the résumé, and the questions the post should answer. Write the post in
> your own words.

## The setup

- Where: SDG Corporation, AI & Hyper Automation Intern, Jun – Jul 2026, Noida.
- What: an MCP server exposing 10+ enterprise tools; LangGraph agent workflows that route each request
  by intent; Python/FastAPI integrations for ITSM ticket creation, retrieval, updates and workflow
  execution, replacing manual intervention.
- TODO(pulkit): what resolving a request looked like before — the manual steps you removed.

## Why MCP rather than one-off tool APIs

- TODO(pulkit): what MCP gave you over hand-written function-calling schemas (one protocol for every
  client, tool discovery, …) and what it cost.

## The tool surface

- TODO(pulkit): the 10+ tools, grouped (tickets, lookups, workflows, …), and the one that was hardest
  to design well.

## Routing by intent with LangGraph

- Each request is classified by intent and routed to the right tool chain.
- TODO(pulkit): the graph's nodes and edges, what happens on a low-confidence intent, and retries.

## The ITSM integration

- Ticket creation, retrieval and updates through Python/FastAPI integrations.
- TODO(pulkit): authentication to the ITSM system, idempotency for create/update, what you log.

## What I would change

- TODO(pulkit): an honest list.

## Numbers worth adding — only ones you measured

- TODO(pulkit): resolution time before and after, tool-call success rate, requests per day.
