# Inquiry measurement: implementation is not reporting availability

As checked on 2026-10-21, the Vercel dashboard requires Pro for custom events.
Do not interpret “No custom events” as zero interactions. No plan upgrade,
new analytics account, or alternative external collector was configured.
The `dataLayer` and browser custom events are not a persistent analytics store.

## Funnel and evidence

| Stage | Evidence | What it does NOT prove |
| --- | --- | --- |
| Visit | Vercel visitors/page views | A unique person across devices or an inquiry |
| Brief entry | `Brief entry opened` | Editing, sending or receipt |
| Brief preparation | `Brief started`, `Brief copied` | That copied text was sent |
| Contact intent | `Inquiry intent`, `Brief email opened` | Successful email/WhatsApp delivery |
| Received inquiry | Actual inbox/WhatsApp message | A qualified opportunity or sale |
| Outcome | Manually recorded qualification, quote and result | Causation by a website change |

One interaction can emit multiple event types; never add them as separate leads.
`Inquiry CTA selected` describes placement; `Inquiry intent` carries the actual
channel. Email button labels must not retain `_whatsapp` after rerouting.

## Immediate workflow without another paid service

Use the existing source/landing-page context included in contact drafts when
the sender retains it. Record only observed source information, otherwise mark
“unknown”; a customer may remove the context or contact through another route.
This supports attribution of received inquiries, not a full click-to-lead rate.

Maintain a private lead log outside this public repository:

- Received date, channel and private conversation reference.
- Service, stated source and website landing page if present.
- First reply date, missing information and next action.
- Status: awaiting information / reviewing / quoted / declined / won / lost.
- Decline or loss reason only if known; never infer it from silence.

Review weekly: received inquiries, unreplied inquiries, time to first reply,
qualified inquiries and quotes. Deduplicate repeat emails and WhatsApp messages
about the same project. Compare equal periods and allow time for open leads to
mature. Use the [reply playbook](inquiry-reply-playbook.md) for manual responses.

## Activation decision still needed

Before choosing Vercel Pro or another analytics provider, compare event
availability, retention, cost and privacy requirements. Obtain approval before
creating accounts, starting subscriptions or sending telemetry to a new service.
After activation, verify in the actual dashboard that one controlled interaction
arrives with the intended event and categorical properties. Never send brief
text, customer names, email addresses, attachments or message bodies as event
properties. Do not claim a conversion rate until both numerator and denominator
are available on a consistent basis.

## Release and regression checklist

- Run `npm run contact:check`, `npm run brief:check`, `npm run architecture:check`,
  `npm run seo:check` and `npm run build`.
- Preview desktop and mobile contact paths, without sending messages.
- After an explicitly authorised release, record the production commit/date.
- Keep unpublished brief changes separate from historical production results.
- Verify that email buttons open email drafts, WhatsApp links stay WhatsApp,
  and no contact protocol is prefixed with `/`.
