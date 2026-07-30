# Graph Report - hashprime-main  (2026-07-30)

## Corpus Check
- 140 files · ~76,665 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 432 nodes · 458 edges · 101 communities (48 shown, 53 thin omitted)
- Extraction: 69% EXTRACTED · 31% INFERRED · 0% AMBIGUOUS · INFERRED: 143 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1994eb83`
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
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
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
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 71 edges
2. `verifyToken()` - 53 edges
3. `getExchangeRate()` - 11 edges
4. `uploadToCloudinary()` - 7 edges
5. `sendEmail()` - 6 edges
6. `PATCH()` - 5 edges
7. `POST()` - 5 edges
8. `POST()` - 5 edges
9. `POST()` - 4 edges
10. `POST()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `PATCH()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/admin/enquiries/[id]/route.js → lib/db.js
- `GET()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/admin/migraterewards/route.js → lib/db.js
- `GET()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/careers/route.js → lib/db.js
- `GET()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/admin/deposits/route.js → lib/db.js
- `PUT()` --calls--> `connectToDatabase()`  [INFERRED]
  app/api/admin/deposits/route.js → lib/db.js

## Import Cycles
- 2-file cycle: `lib/cron.js -> lib/db.js -> lib/cron.js`

## Communities (101 total, 53 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (11): POST(), GET(), GET(), GET(), connectToDatabase(), POST(), GET(), POST() (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (12): GET(), DELETE(), GET(), GET(), POST(), PUT(), POST(), GET() (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (10): POST(), secretKey, generateOTP(), POST(), sendEmail(), transporter, generateOTP(), POST() (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (7): DELETE(), POST(), GET(), POST(), uploadToCloudinary(), GET(), PUT()

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (16): GET(), POST(), GET(), INR_SCHEMES, POST(), USD_SCHEMES, initCron(), monthNames (+8 more)

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

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (8): DELETE(), PATCH(), GET(), INR_SCHEMES, POST(), USD_SCHEMES, calculateReferralCommission(), GET()

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (5): fs, mongoose, path, TransactionSchema, UserSchema

### Community 43 - "Community 43"
Cohesion: 0.29
Nodes (5): envContent, fs, mongoose, mongoUri, path

## Knowledge Gaps
- **71 isolated node(s):** `ads`, `SCHEME_OPTIONS`, `NAV_ITEMS`, `PRIORITY_COLORS`, `STATUS_PILL` (+66 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `connectToDatabase()` connect `Community 0` to `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 7`, `Community 23`, `Community 49`, `Community 51`, `Community 67`, `Community 77`, `Community 84`, `Community 86`, `Community 87`, `Community 88`, `Community 89`, `Community 90`, `Community 94`, `Community 95`, `Community 96`, `Community 97`, `Community 98`, `Community 99`, `Community 100`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `verifyToken()` connect `Community 2` to `Community 0`, `Community 3`, `Community 4`, `Community 5`, `Community 7`, `Community 23`, `Community 49`, `Community 51`, `Community 67`, `Community 77`, `Community 84`, `Community 86`, `Community 87`, `Community 88`, `Community 89`, `Community 90`, `Community 94`, `Community 96`, `Community 98`, `Community 99`, `Community 100`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `POST()` connect `Community 5` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Are the 67 inferred relationships involving `connectToDatabase()` (e.g. with `GET()` and `PATCH()`) actually correct?**
  _`connectToDatabase()` has 67 INFERRED edges - model-reasoned connections that need verification._
- **Are the 52 inferred relationships involving `verifyToken()` (e.g. with `GET()` and `DELETE()`) actually correct?**
  _`verifyToken()` has 52 INFERRED edges - model-reasoned connections that need verification._
- **Are the 8 inferred relationships involving `getExchangeRate()` (e.g. with `PATCH()` and `GET()`) actually correct?**
  _`getExchangeRate()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `uploadToCloudinary()` (e.g. with `POST()` and `POST()`) actually correct?**
  _`uploadToCloudinary()` has 6 INFERRED edges - model-reasoned connections that need verification._