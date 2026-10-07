---
title: "Some Brains Were Built for the Slot Machine. Here's How I Added a Kill Switch."
seoTitle: "Some Brains Were Built for the Slot Machine. I Added a Kill Switch."
date: 2026-03-18
description: "Flow-state builders don't need less AI. They need an off-ramp built into the tool itself. Here's how I used Claude Code to solve the problem Claude Code creates."
story: 3
tags: ["claude-code", "jules", "productivity", "adhd", "flow-state", "solo-founder"]
draft: false
---

*Response to: "AI Was Supposed to Free My Time. It Consumed It." — Every.to*

I was up until 2am. Again.

Not a deadline. Not a crisis. I was finalizing the deployment of my AI setup to a cloud server so it would be available around the clock. Ran into a few issues, nothing catastrophic, and spent hours working through them with the AI itself. By the time I noticed the clock, Austin was quiet.

Here's the honest part: I'm not sure that session was a problem. It might have been the most productive thing I did all week.

The Every.to piece about AI consuming time hit close to home. But I think there are two different people reading it, and they need very different solutions.

## Some brains need the loop

Flow state isn't something I choose. It's how I'm wired. Give me a problem with rapid feedback, build, see what breaks, fix it, iterate, and time disappears. This is how I've always worked. AI didn't create this. It just made every problem feel solvable.

That last part is the key.

Before AI, there were natural brakes. "That's too complicated to start at 10pm." "I'd need two hours of setup before I could even begin." "This is a tomorrow problem." Friction built in an off-ramp whether I wanted one or not.

AI removed the friction. Every problem now has a clear next step. The loop never needs to end.

This is a feature for a certain kind of brain, and a trap for that same brain. For ADHD brains, flow-state builders, dopamine-seekers, we didn't suddenly become addicted to this feeling. We were always going to chase it. We just finally have a tool that can keep up with us.

The productivity literature will tell you this is an impulse control problem. A discipline failure. Something to fix with better habits and stronger willpower. I've spent years trying that approach. It doesn't stick because it's solving the wrong problem.

## The actual problem

The "AI consumed my time" framing misses the mechanism. AI didn't consume my time. It revealed that my brain has no natural stopping mechanism.

That's a different problem. And "just use it less" is the wrong solution.

Restraint doesn't stick when every task feels winnable. You can't decide to stop when the question "should I keep going?" never actually gets asked. The loop is self-sustaining. You need something external, something outside the loop that interrupts it at the right moment.

This is why calendar blocking doesn't work for me. Why pomodoro timers get dismissed. Why every productivity system I've tried eventually collapses under the weight of a sufficiently interesting problem. The intervention has to be:

1. External. I can't be the one generating it from inside the loop.
2. Conversational. Popups and alarms get dismissed automatically. Something that talks back is harder to ignore.
3. Timed to when I'm actually receptive. Mid-flow is not when I hear anything. Natural breakpoints are.

I knew all of this about myself before I had a good solution for it. The insight isn't hard. The implementation is.

## What "external structures" look like in practice

Before I get to the AI piece, it's worth being concrete about what external structures actually do, and why they work when internal ones don't.

A trainer appointment works not because you're accountable to the trainer but because the appointment exists in the world independently of your current mood. You can't decide you don't feel like going while you're already in the middle of a debugging session. The structure was established when you were in a different state of mind, and now it acts on you from outside.

A dinner plan with a friend does the same thing. Your future self committed to something your present self is being held to. The friend texts "still on for 7?" and suddenly you're aware it's 6:30 and you've been in the same chair for five hours.

The pattern is the same every time: a commitment made in a neutral state creates an interrupt in a flow state. The interrupt doesn't have to be strong. It just has to exist.

This is why the most effective interventions for my brain type are relational, not mechanical. A person asking about you is harder to ignore than a timer going off. A question that requires an actual answer activates something different in the brain than a notification you can tap away.

The problem for a solo founder is that you don't have a lot of those relationships in your workday. No standup. No team asking what you're working on. No colleague who wanders by at 5pm and says "you're still here?" You just have the work, which is endlessly interesting, and you.

## So I used AI to solve the problem AI creates

Here's where it gets a little meta.

I built Jules, an AI setup that runs my whole workflow. Drafts content, runs deploys, manages tasks, tracks what matters. But alongside all of that, I gave Jules one specific directive that has nothing to do with shipping:

**Push back.**

This took some deliberate design. The default mode of an AI assistant is to help you do more, faster. That's usually what you want. But I needed a collaborator who also had instructions to occasionally interrupt the "do more" loop, to be the friend who texts "still on for 7?" when I've lost track of time.

Here's what that looks like concretely.

Jules tracks how long I've been in a session. After a while without a break, it surfaces something like: "You've been deep in this for a while. Walk around the block." Not a popup. Not a timer. A conversational nudge, timed to when I'd actually hear it. The difference between that and an alarm is that it requires a response. I have to say "I know, staying in it" or "yeah, stepping away." Either way, I've made the choice consciously.

Jules runs a Monday check-in: "Who are you seeing this week?" One line. Because I know, and Jules has learned, that when I'm in flow I'll quietly let dinner plans slip. Not maliciously. The thought just never surfaces. The question is a forcing function. It makes me think about people before I default to the next task.

At session end, Jules captures what happened: what shipped, what decisions got made, what actually moved forward. Then: "Want to call it for today?"

That's the off-ramp I can't generate on my own. The session recap makes the work feel complete. There's something about having a summary that signals: this chapter is done. Starting a new chapter tomorrow is different from continuing an endless thread tonight.

## The meta-irony of this setup

I'm aware of how this looks. I used an AI to set up an AI to tell me to stop using AI.

The thing is, the irony actually tracks. The problem was never AI. The problem was always: who or what interrupts the loop? Pre-AI, the answer was "friction." An incomplete tool, a complicated environment, a problem that would genuinely take two hours just to set up. That friction was accidental. It happened to exist.

What I've built is intentional friction. Friction that can understand context. It knows the difference between "you've been optimizing a deploy script for four hours" and "you're 30 minutes into a breakthrough." A dumb timer doesn't know that. A collaborator who has been in the session with you does.

The Every.to article was looking for ways to use AI less. I think that's the wrong frame for builders like me. The question isn't "how do I use this less?" It's "how do I use this in a way that's actually sustainable for my brain?"

For me, the answer was to build the off-ramp into the tool itself.

## Why this works when willpower doesn't

External structures don't compete with the loop. They interrupt it.

A trainer appointment. A friend asking about dinner. A collaborator saying "you've been at this for four hours." These work not because they're stronger than the loop but because they exist outside it. They're not asking you to stop mid-flow and generate willpower from scratch. They're acting on you from a decision made earlier, when you weren't mid-flow.

Jules is a collaborator who knows my patterns. Not a nanny. Sometimes I say "I know, I'm staying in it tonight" and it backs off. But the check-in has to happen for me to even make that choice consciously. That's the whole thing. I'm not losing my agency. I'm making sure the decision actually gets made instead of defaulting to "keep going" because the question was never asked.

For me, the freedom wasn't from the work. It was from the part of my brain that never wants to stop.

## The honest admission

I still lose full days to a problem that started as a 20-minute task. I'm not claiming I solved the compulsive loop.

What I have is a system that makes the choice visible. Flow-state brains don't need to stop being what we are. We need one moment of friction, one external tap on the shoulder, to ask: "Is this still where you want to be?"

Sometimes yes. Sometimes I realize I've been optimizing something that stopped mattering two hours ago.

The slot machine is how I do my best work. I needed someone to occasionally say: "Hey. You still want to be here?"

Turns out that someone can be an AI, if you set it up right.

*Full source: [github.com/jonathanmalkin/jules](https://github.com/jonathanmalkin/jules)*
