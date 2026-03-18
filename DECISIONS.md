# DECISIONS

## Scope

Assumptions: the data provided is representative of usual shape and quantity of data.

### What you decided to implement

1. Stats and grouping by status

A new dashboard page with a summary easier to navigate than the Evalutions table.
Given the quantity of items, grouping them by status and adding some statistics at the top seemed most valuable for understanding the compliance gap at a glance.

The accordions make it faster to navigate.

2. Submit info modal

Given that most of the data is "missing info", next steps for the user could realistically be to submit the missing information.

### What you intentionally did not implement

1. A table with filters

Given the amount of data, this would add more noise and little value to the user experience.

2. An AI summary

Rewording the data into an other summary at the top of the page did not seem to add much value, only more information to read for the user.

## Key Tradeoffs

1. Accordions vs table

The accordions make it faster to navigate but users have to click through each item. If the title and summary are usually not enough to understand the item, this UI may not be ideal.

## Summary Logic

1. Server-side grouping

In case there is actually larger amounts of data in production, I implemented grouping on the server. Also mostly "just" to show I know how to use Nuxt's server endpoints.

## Validation

- What you tested

I tested the UI and the API endpoints, as well as light and dark mode.

- What remains untested

Handling files in the backend from submissions was not fully tested as this depends on the actual storage provider.

## If I Had More Time

1. Add a database and storage provider
2. Handle missing info submissions
3. Validate the submitted information with an LLM to verify compliance
4. Update statuses in the frontend
