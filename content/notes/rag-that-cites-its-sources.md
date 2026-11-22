---
title: 'RAG that cites its sources: lessons from KnowledgeHub AI'
date: 2026-11-22
# Set the real date and a one-line summary when you publish, then delete `draft: true`.
summary: TODO(pulkit) one sentence for the notes list, the RSS feed and the meta description.
draft: true
---

> **Draft outline — not published.** This file stays out of the site, the feed and the sitemap
> until `draft: true` is removed. Everything below is a note to yourself: facts from
> `src/data/portfolio.ts`, and the questions the post should answer. Write the post in your own words.

## The problem

- Plain LLMs invent answers about your documents. KnowledgeHub AI retrieves before it generates, so
  every answer is traced to the source chunks it came from.

## The pipeline

- Ingestion: text extraction → chunking → Google Embeddings → ChromaDB, built with LangChain.
- Query: embed the question → semantic similarity search → assemble the retrieved context → only then
  call Gemini 2.5 Flash.
- A FastAPI service with ingestion endpoints (upload, extraction, chunking, indexing as one pipeline),
  served through a React + Vite client and a Streamlit surface for internal testing; deployed across
  Render and Vercel.

## Chunking decided answer quality

- Too small and a chunk loses the context a question needs; too large and similarity search returns
  mostly noise. Tuning chunk size and overlap against real enterprise PDFs mattered more to answer
  quality than any prompt change.
- TODO(pulkit): the size and overlap you settled on, and how you compared candidates.

## Grounding the model instead of trusting it

- Gemini will answer from parametric memory if you let it. The prompt assembles retrieved context
  explicitly and asks for citations, which makes an ungrounded answer visible rather than plausible.
- TODO(pulkit): the citation format, and what happens when retrieval finds nothing useful.

## How I would evaluate it

- TODO(pulkit): a small question set with known answers; citation accuracy (does the cited chunk
  actually support the claim?); retrieval hit rate. Report only what you run.

## What is next

- Hybrid retrieval — BM25 alongside dense vectors — for queries that hinge on exact identifiers.
- A reranking pass over retrieved chunks before prompt assembly.
- Per-document access control, so teams only query what they own.
