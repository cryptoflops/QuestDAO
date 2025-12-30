export interface QuestContent {
    id: number;
    objectives: string[];
    readingTime: string;
    content: string;
}

export const QUESTS_LEARNING_DATA: Record<number, QuestContent> = {
    1: {
        id: 1,
        objectives: ["Understand Clarity's decidability", "Learn data-var and define-map", "Execute read-only functions"],
        readingTime: "5 min",
        content: `
# Clarity Fundamentals: The Logic of Certainty

Unlike Solidity, Clarity is **interpreted**, not compiled. There is no EVM bytecode. The code you write is exactly what runs on the node. This visibility is the foundation of Stacks' security.

### 1. Variables and Constants
In Clarity, constants are immutable. Data variables (\`define-data-var\`) can be updated, but only via specific functions.
\`\`\`clarity
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-data-var counter uint u0)
\`\`\`

### 2. Data Maps
Maps link keys to values. They are the bedrock of state management.
\`\`\`clarity
(define-map user-scores principal uint)
\`\`\`

### 3. Decidability
A Clarity contract's execution path is predictable. There are no infinite loops. You always know exactly how much gas a transaction will consume before it runs.
        `
    },
    2: {
        id: 2,
        objectives: ["Master Post-Conditions", "Implement unwrap! and asserts!", "Protect against re-entrancy"],
        readingTime: "8 min",
        content: `
# Smart Contract Safety: Shielding the Ledger

Security in Clarity isn't an afterthought; it's built into the language syntax.

### 1. Post-Conditions
The most powerful tool in Stacks. You don't just trust the contract; you set a limit on what it can transfer. If the contract tries to take more than you authorized, the transaction aborts.

### 2. Defensive Coding
Use \`asserts!\` and \`unwrap!\` to exit early if conditions aren't met.
\`\`\`clarity
(asserts! (is-eq tx-sender protocol-wallet) (err u403))
(let ((data (unwrap! (map-get? registry id) (err u404)))) ...)
\`\`\`

### 3. Readable Logic
Avoid complex, clever shortcuts. Writing readable Clarity is the best way to ensure your contract is auditable by the guild.
        `
    },
    3: {
        id: 3,
        objectives: ["Understand SIP-009 standard", "Implement non-transferable traits", "Minting logic"],
        readingTime: "6 min",
        content: `
# SIP-009 NFT Mastery: Identity as an Asset

QuestDAO uses specialized NFTs called Soulbound Badges. These follow the SIP-009 standard but with a critical twist: they cannot be transferred.

### 1. The Trait
A trait is a shared interface. All NFTs on Stacks must adhere to the SIP-009 trait to be recognized by wallets and marketplaces.

### 2. Implementation
We implement the standard functions (\`get-last-token-id\`, \`get-owner\`, \`get-token-uri\`) but restrict \`transfer\` to always return an error.

### 3. Minting Reputation
Minting is authorized only by the Registry. This ensures that badges represent actual work, not market activity.
        `
    },
    4: {
        id: 4,
        objectives: ["Build voting mechanisms", "Implement merit-weighted logic", "Governance execution"],
        readingTime: "10 min",
        content: `
# DAO Architect Suite: The Logic of Collective Power

Governance is the final step in the Architect's journey. We move beyond simple token voting into merit-weighted consensus.

### 1. Weighted Voting
In QuestDAO, your vote weight isn't tied to your balance, but to your \`architect-level\`.
\`\`\`clarity
(let ((voter-level (get-level tx-sender)))
  (map-set votes { proposal: id, voter: tx-sender } { weight: voter-level }))
\`\`\`

### 2. Proposal Lifecycle
Steps from proposal to execution. Each step is verifiable and requires a quorum of fellow architects.

### 3. Sovereign Authority
The DAO has the power to update protocol constants and authorize new curriculum modules. You are now the guardian of the guild.
        `
    }
};
