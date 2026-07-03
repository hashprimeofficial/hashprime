# Graph Report - hashprime-main  (2026-07-03)

## Corpus Check
- 129 files · ~70,400 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 394 nodes · 410 edges · 89 communities (43 shown, 46 thin omitted)
- Extraction: 69% EXTRACTED · 31% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `049bf15f`
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
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 64 edges
2. `verifyToken()` - 47 edges
3. `getExchangeRate()` - 8 edges
4. `uploadToCloudinary()` - 6 edges
5. `sendEmail()` - 6 edges
6. `POST()` - 5 edges
7. `PATCH()` - 4 edges
8. `POST()` - 4 edges
9. `POST()` - 4 edges
10. `POST()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `verifyToken()`  [INFERRED]
  app/api/admin/deposits/route.js → lib/auth.js
- `GET()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/admin/deposits/route.js → lib/db.js
- `PUT()` --calls--> `verifyToken()`  [INFERRED]
  app/api/admin/deposits/route.js → lib/auth.js
- `PUT()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/admin/deposits/route.js → lib/db.js
- `GET()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/admin/dumpusers/route.js → lib/db.js

## Import Cycles
- 2-file cycle: `lib/cron.js -> lib/db.js -> lib/cron.js`

## Communities (89 total, 46 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (13): PATCH(), POST(), GET(), POST(), GET(), GET(), GET(), PUT() (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (14): DELETE(), PATCH(), DELETE(), DELETE(), PATCH(), PATCH(), verifyToken(), GET() (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (12): POST(), secretKey, generateOTP(), POST(), GET(), PUT(), sendEmail(), transporter (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (7): GET(), uploadToCloudinary(), GET(), PUT(), POST(), GET(), POST()

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (12): GET(), POST(), GET(), INR_SCHEMES, POST(), USD_SCHEMES, GET(), INR_SCHEMES (+4 more)

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

### Community 51 - "Community 51"
Cohesion: 0.20
Nodes (7): initCron(), monthNames, processInterestPayments(), InvestmentSchema, Transaction, TransactionSchema, UserSchema

## Knowledge Gaps
- **60 isolated node(s):** `neonStyle`, `SCHEME_OPTIONS`, `NAV_ITEMS`, `PRIORITY_COLORS`, `STATUS_PILL` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `connectToDatabase()` connect `Community 0` to `Community 2`, `Community 67`, `Community 4`, `Community 5`, `Community 3`, `Community 7`, `Community 77`, `Community 49`, `Community 81`, `Community 51`, `Community 84`, `Community 87`, `Community 23`, `Community 88`, `Community 86`, `Community 56`, `Community 31`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `verifyToken()` connect `Community 2` to `Community 0`, `Community 67`, `Community 4`, `Community 5`, `Community 3`, `Community 7`, `Community 77`, `Community 49`, `Community 81`, `Community 84`, `Community 87`, `Community 23`, `Community 88`, `Community 86`, `Community 56`, `Community 31`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `POST()` connect `Community 5` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 61 inferred relationships involving `connectToDatabase()` (e.g. with `GET()` and `PATCH()`) actually correct?**
  _`connectToDatabase()` has 61 INFERRED edges - model-reasoned connections that need verification._
- **Are the 46 inferred relationships involving `verifyToken()` (e.g. with `GET()` and `DELETE()`) actually correct?**
  _`verifyToken()` has 46 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `getExchangeRate()` (e.g. with `PATCH()` and `GET()`) actually correct?**
  _`getExchangeRate()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `uploadToCloudinary()` (e.g. with `POST()` and `POST()`) actually correct?**
  _`uploadToCloudinary()` has 5 INFERRED edges - model-reasoned connections that need verification._