---
title: "My Website Now Has an MCP Server. Your AI Can Run My Scorecard."
date: 2026-07-13
description: "builtwithjon.com now exposes a free, public MCP server, so Claude and other AI clients can run the Hidden Profit scorecard, calculate workflow leaks, and search 96 worked use cases without leaving the conversation."
story: 2
tags: ["mcp", "ai-agents", "small-business", "workflows", "scorecard"]
draft: false
---

builtwithjon.com now has a free, public MCP server. Connect Claude or another MCP client and your AI can run my Hidden Profit scorecard, calculate what a missed-call or invoice-chase leak costs, and search 96 worked small-business use cases without leaving the conversation. It is read-only, requires no login, and stores none of the numbers you give it.

The endpoint is simple:

`https://builtwithjon.com/mcp`

If you just want to look around, there is a no-install path: open the [tools hub](/tools/). It links to the normal scorecard, all ten leak calculators, the 96-example use case library, the frameworks and articles, and the Hidden Profit Review. Those are ordinary webpages — no MCP connection, setup command, or AI client required.

The tools hub and the MCP server are two different ways to reach the same public work:

- **Normal webpage:** you click through the scorecard and calculators yourself in a browser.
- **MCP connection:** a compatible AI client discovers documented tools and runs them as part of a conversation.

The MCP path is read-only. The normal webpages can also offer clearly labeled optional email forms or a review waitlist. Choose the webpage when you want to explore on your own; connect MCP when you want your AI to ask the questions and keep the thread for you.

MCP stands for Model Context Protocol. The useful version of that definition is shorter: it gives an AI a documented set of tools it can call instead of making the AI guess from a webpage.

## The scorecard works better as a conversation

The scorecard on this site asks where deals, time, and cash are slipping through the business. A normal web quiz works. You click answers, get a result, and read the breakdown.

An AI can make the same process feel less like a form.

It can ask the questions one at a time. You can stop and explain that "a day or two" really means Monday inquiries sometimes wait until Thursday. The AI can keep that context, send the structured answers to the scorecard tool, and return the same deterministic result as the website.

For example, give it these answers for a home services business:

- New inquiries wait a day or two.
- Unanswered leads usually get no follow-up.
- Staff copy a lot of information by hand.
- Admin work disrupts most weeks.
- Invoice follow-up slips, and some of it never happens.

The result is **Wide open**. Deals score 83 out of 100, time scores 67, and cash scores 100. The first move is not "add AI everywhere." It is to make the handoff from completed work to sent invoice visible, timed, and reviewed.

Same scoring. Better interface.

## Ten tools, all read-only

The server exposes ten tools. The scorecard is one. Another prices a specific leak using the same calculators already on this site.

Miss 30 calls in a month. Assume one in three was a real job request and the average ticket was $450. The calculator returns an estimated **$4,500 per month**, or $54,000 per year. It also tells the AI to pull the real call log before treating the estimate as fact.

The other tools search and read the 96-example use case library, list its 15 categories, explain my decide-before-you-automate frameworks, describe the Hidden Profit Review, and search the articles.

Nothing captures a lead. Nothing writes to a CRM. Nothing sends an email. The server only reads information already published here and runs fixed calculations against inputs you choose to provide.

That boundary matters. A public website tool should not become a side door into private business systems because somebody discovered MCP last Tuesday.

## Connect it to Claude Code

Run this once:

```bash
claude mcp add --transport http builtwithjon https://builtwithjon.com/mcp
```

Then start a Claude Code session and ask:

> Run the Built with Jon scorecard with me. Ask one question at a time, then explain which leak I should fix first.

Claude will discover the tool schema, ask for the required answers, call `run_scorecard`, and bring the result back into the chat.

In Claude's web or desktop apps, open Settings, go to Connectors, choose **Add custom connector**, and paste the endpoint. Cursor, VS Code, ChatGPT developer mode, and other MCP clients can add the same URL as a remote Streamable HTTP server with no authentication.

The full tool list and copy-paste instructions live on the [MCP server page](/mcp/). If you do not want to connect anything, use the [no-install tools hub](/tools/) instead.

## Why put this on the website?

Most small-business AI advice stops at content. A blog post can explain the missed-call problem. A calculator can price it. A scorecard can rank it. But the reader still has to move between pages and translate the result back into the conversation they were already having with an AI.

MCP removes that handoff.

The website still does the math. The AI handles the conversation around it. Each side keeps the job it is good at.

This is also a cleaner distribution model for the work. The use case library is not trapped in one interface. The scorecard is not limited to one quiz page. An assistant can use both without scraping the site, inventing a formula, or copying a stale version into its own prompt.

There is still one source for the scorecard logic, calculator math, and use cases. The website and the MCP server import the same data. Fix it once and both surfaces change.

That's the part I care about. Not "my website has ten AI tools." The useful thing is that your AI can now help you find one real leak, price it, and choose the first fix without pretending it needs control of the whole business.

Connect it, run the scorecard, and pull the actual records before believing the estimate.

*Full source: [github.com/jonathanmalkin/builtwithjon](https://github.com/jonathanmalkin/builtwithjon)*
