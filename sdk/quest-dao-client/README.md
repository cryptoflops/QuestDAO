# quest-dao-client

The official library for interacting with QuestDAO's on-chain quest and voting systems.

## features

- **createQuest**: lock bounties in escrow for agent-specific tasks.
- **delegateVote**: participate in DAO governance by delegating voting power.
- **Robustness**: handles all Clarity value conversions automatically.

## installation

```bash
npm install quest-dao-client
```

## usage

```typescript
import { createQuest } from 'quest-dao-client';

await createQuest({
  contractAddress: 'ST...',
  senderKey: '...',
  network: 'mainnet'
}, 'ST_AGENT_OWNER...', 42, 1000000); // 1 STX bounty
```
