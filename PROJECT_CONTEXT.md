# QuestDAO: Project Core & Logic

## Project Overview
- **Name:** QuestDAO
- **Tagline:** "Proof of Skill. Power to Build."
- **Status:** ACTIVE DEVELOPMENT

## Page Specifications

### 1. Landing Page (Hero)
*   **Headline:** "Proof of Skill." (Giant, `Space Grotesk`, Gradient Text `Hyper-Violet` -> `Cyan-Beam`).
*   **Subhead:** "The first meritocratic Stacks academy. Learn Clarity, earn Soulbound Badges, and govern the protocol."
*   **CTA:** "Start Your Journey" (Primary Button, Neumorphic glow).
*   **Visual:** 3D floating badge assets (created via CSS/Spline or Images).

### 2. Quest Board (The Academy)
*   **Grid Layout:** Responsive Grid (1 col mobile, 2 col tablet, 3 col desktop).
*   **Component: `QuestCard`**
    *   **Header:** Icon + Difficulty Level (Beginner/Intermediate/Wizard).
    *   **Body:** Title + Short Description + XP Reward/STX Fee.
    *   **Footer:** Status Indicator.
        *   *Locked:* Greyed out, Lock Icon.
        *   *Available:* "Start Quest" Button (`Cyan-Beam` border).
        *   *Completed:* Golden Glow, "Minted" Badge.

### 3. Quest Details & Submission
*   **Layout:** Split View.
    *   **Left (Content):** Markdown renderer for the tutorial/quest instructions.
    *   **Right (Action):** Verification Panel.
        *   *Input:* "Contract Address" or "Tx ID".
        *   *Action:* "Verify & Mint" (Invokes Wallet to pay fee).

### 4. Governance (The Council)
*   **Gatekeeping:** If `User.badges == 0`, show a "Not Authorized" overlay with a link to Quests.
*   **Proposal List:**
    *   Cards showing "Proposal #ID", "Status" (Active/Passed), and "Votes Cast".
    *   Voting Bar: Visual progress of Yes/No.

## Responsive Rules
*   **Mobile:** Stack all grids. Hide "Center" nav items into a Hamburger menu or Bottom Bar.
*   **Touch:** All interactive elements (`buttons`, `cards`) must have min-height 44px.

## Logic
- Logic: Users complete Quests to earn Soulbound Badges.
- Flow: Landing -> Quest Board -> Quest Details -> Governance.
- Tech: Reown AppKit, Stacks blockchain, Clarity language.

## Visual Direction (DEPRECATED - DO NOT USE)
- **Warning:** Do not use the previous "Cyber-Scholastic" or "Neon" styles.
- **New Instruction:** Refer to `branding_agent.md` in workflows for the 2025 Editorial Luxury aesthetic.
