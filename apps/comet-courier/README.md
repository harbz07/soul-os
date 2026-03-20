# Comet Courier

This is the system transit layer. It navigates, researches, and delivers messages/artifacts across the AI ecosystem without manual bottlenecks.

- Environment: Cloudflare Workers
- Main File: comet-courier.js
- Responsibilities:
  - Executes `dispatch()` for conditional delivery
  - Maintains `waypoint()` persistent anchors
  - Handles `passage()` system transit
  - Syncs data gracefully to The Atlas (Notion)
