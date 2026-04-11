# Security Policy

## Supported Versions

Security fixes are currently provided on a **best-effort basis** for the latest code on the `main` branch.

## Reporting a Vulnerability

Please **do not** open public GitHub issues for suspected vulnerabilities.

Instead, use one of these private channels:

1. **GitHub Security Advisories (preferred):**  
   https://github.com/harbz07/soul-os/security/advisories/new
2. **Direct maintainer contact:** reach out privately to a project maintainer if advisory reporting is unavailable.

When reporting, include:

- A clear description of the issue and affected component(s) (for example: `apps/siddhartha`, `apps/soul-os-api`, `apps/bridge-worker`).
- Reproduction steps or proof-of-concept details.
- Potential impact and any suggested mitigation.

## What to Expect

After a report is received, maintainers will:

- Acknowledge receipt as quickly as possible (target: within 72 hours).
- Triage severity and scope.
- Work on a fix and coordinate disclosure timing.
- Credit the reporter if they want public acknowledgment.

## Disclosure Guidelines

- Please allow time for investigation and patching before public disclosure.
- Once fixed, maintainers may publish a security advisory and release notes.

## Secrets and Configuration Hygiene

This repository uses Cloudflare Workers across `apps/*`. Secrets should be managed through Cloudflare secret storage (for example `wrangler secret put`) and **must never be committed** to source control.

If you discover exposed credentials, report them immediately through the private channels above.
