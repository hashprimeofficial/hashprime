# Graph Report - /Users/mohammedarif/hashprime-main  (2026-06-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 372 nodes · 370 edges · 95 communities (40 shown, 55 thin omitted)
- Extraction: 71% EXTRACTED · 29% INFERRED · 0% AMBIGUOUS · INFERRED: 109 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae1214a6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 55 edges
2. `verifyToken()` - 40 edges
3. `sendEmail()` - 6 edges
4. `getExchangeRate()` - 6 edges
5. `POST()` - 5 edges
6. `uploadToCloudinary()` - 5 edges
7. `PATCH()` - 4 edges
8. `POST()` - 4 edges
9. `GET()` - 4 edges
10. `POST()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/auth/make-admin/route.js → lib/db.js
- `GET()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/auth/referrer/[code]/route.js → lib/db.js
- `POST()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/business-enquiry/route.js → lib/db.js
- `GET()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/careers/route.js → lib/db.js
- `GET()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/admin/deposits/route.js → lib/db.js

## Import Cycles
- None detected.

## Communities (95 total, 55 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (9): PATCH(), GET(), GET(), GET(), PUT(), connectToDatabase(), GET(), POST() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.17
Nodes (10): GET(), PUT(), verifyToken(), GET(), PATCH(), GET(), POST(), PUT() (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (10): POST(), secretKey, generateOTP(), POST(), sendEmail(), transporter, generateOTP(), POST() (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (7): GET(), GET(), POST(), POST(), uploadToCloudinary(), GET(), PUT()

### Community 5 - "Community 5"
Cohesion: 0.20
Nodes (5): GET(), POST(), GET(), getExchangeRate(), POST()

### Community 6 - "Community 6"
Cohesion: 0.33
Nodes (3): AdminLayout(), NAV_ITEMS, useAdminBadges()

### Community 7 - "Community 7"
Cohesion: 0.29
Nodes (4): key, signToken(), POST(), POST()

### Community 12 - "Community 12"
Cohesion: 0.33
Nodes (3): STATUS_PILL, WALLET_COLOR, WALLET_ICON

### Community 13 - "Community 13"
Cohesion: 0.40
Nodes (3): dmSans, metadata, spaceGrotesk

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): CoinTile(), FALLBACK_COINS, formatPrice()

## Knowledge Gaps
- **59 isolated node(s):** `neonStyle`, `NAV_ITEMS`, `PRIORITY_COLORS`, `STATUS_PILL`, `WALLET_ICON` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **55 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `connectToDatabase()` connect `Community 1` to `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 7`, `Community 34`, `Community 35`, `Community 37`, `Community 55`, `Community 56`, `Community 58`, `Community 59`, `Community 60`, `Community 61`, `Community 67`, `Community 68`, `Community 74`, `Community 80`, `Community 92`, `Community 93`, `Community 94`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `verifyToken()` connect `Community 2` to `Community 1`, `Community 34`, `Community 35`, `Community 4`, `Community 5`, `Community 37`, `Community 7`, `Community 3`, `Community 74`, `Community 92`, `Community 93`, `Community 55`, `Community 56`, `Community 58`, `Community 59`, `Community 60`, `Community 61`, `Community 94`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `POST()` connect `Community 3` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Are the 54 inferred relationships involving `connectToDatabase()` (e.g. with `GET()` and `PATCH()`) actually correct?**
  _`connectToDatabase()` has 54 INFERRED edges - model-reasoned connections that need verification._
- **Are the 39 inferred relationships involving `verifyToken()` (e.g. with `GET()` and `DELETE()`) actually correct?**
  _`verifyToken()` has 39 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `sendEmail()` (e.g. with `POST()` and `POST()`) actually correct?**
  _`sendEmail()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `getExchangeRate()` (e.g. with `PATCH()` and `GET()`) actually correct?**
  _`getExchangeRate()` has 5 INFERRED edges - model-reasoned connections that need verification._