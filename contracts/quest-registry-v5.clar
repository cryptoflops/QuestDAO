
;; Quest Registry v5 (`quest-registry-v5`)
;; Manages available quests and verifies completion with Knowledge Proofs.

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-QUEST-NOT-FOUND (err u101))
(define-constant ERR-ALREADY-COMPLETED (err u102))
(define-constant ERR-REQUIREMENT-NOT-MET (err u104))
(define-constant ERR-INVALID-PROOF (err u105))
(define-constant ERR-NOT-BNS-OWNER (err u106))

;; Mainnet BNS Contract
(define-constant BNS-CONTRACT 'SP000000000000000000002Q6VF78.bns)

;; Data Maps
(define-map quests
    uint ;; Quest ID
    {
        title: (string-ascii 64),
        xp-reward: uint,
        fee: uint,
        active: bool,
        proof-hash: (buff 32) ;; SHA-256 hash of the knowledge secret
    }
)

(define-map user-progress
    { user: principal, quest-id: uint }
    bool ;; Completed?
)

(define-map user-xp principal uint)

;; Variables
(define-data-var last-quest-id uint u0)
(define-data-var protocol-wallet principal tx-sender)

;; Read-Only Functions
(define-read-only (get-quest (id uint))
    (map-get? quests id)
)

(define-read-only (get-last-quest-id)
    (ok (var-get last-quest-id))
)

(define-read-only (has-completed (user principal) (quest-id uint))
    (default-to false (map-get? user-progress { user: user, quest-id: quest-id }))
)

(define-read-only (get-user-xp (user principal))
    (default-to u0 (map-get? user-xp user))
)

;; Admin Functions
(define-public (create-quest (title (string-ascii 64)) (xp uint) (fee uint) (hash (buff 32)))
    (begin
        (asserts! (is-eq tx-sender (var-get protocol-wallet)) ERR-NOT-AUTHORIZED)
        (let
            (
                (quest-id (+ (var-get last-quest-id) u1))
            )
            (map-set quests quest-id { 
                title: title, 
                xp-reward: xp, 
                fee: fee, 
                active: true,
                proof-hash: hash
            })
            (var-set last-quest-id quest-id)
            (ok quest-id)
        )
    )
)

;; User Functions
(define-public (complete-quest (quest-id uint) (secret (buff 256)))
    (let
        (
            (quest (unwrap! (map-get? quests quest-id) ERR-QUEST-NOT-FOUND))
            (fee (get fee quest))
            (xp (get xp-reward quest))
            (expected-hash (get proof-hash quest))
            (user tx-sender)
            (current-xp (get-user-xp user))
        )
        ;; 1. Check if already completed
        (asserts! (is-none (map-get? user-progress { user: user, quest-id: quest-id })) ERR-ALREADY-COMPLETED)
        
        ;; 2. Verify Knowledge Proof
        (asserts! (is-eq (sha256 secret) expected-hash) ERR-INVALID-PROOF)

        ;; 3. Verify Prerequisites (Modular checks)
        (if (> quest-id u1)
            (asserts! (has-completed user (- quest-id u1)) ERR-REQUIREMENT-NOT-MET)
            true
        )

        ;; Special XP check for high council modules (Quest 4+)
        (if (>= quest-id u4)
            (asserts! (>= current-xp u350) ERR-REQUIREMENT-NOT-MET)
            true
        )

        ;; 4. Pay Protocol Fee
        (if (and (> fee u0) (not (is-eq user (var-get protocol-wallet))))
            (try! (stx-transfer? fee user (var-get protocol-wallet)))
            true
        )

        ;; 5. Mark as complete & Add XP
        (map-set user-progress { user: user, quest-id: quest-id } true)
        (map-set user-xp user (+ current-xp xp))
        
        ;; 6. Mint Badge
        (contract-call? .soulbound-badge-v2 mint user)
    )
)

;; BNS Special Quest
(define-public (claim-bns-quest (quest-id uint) (name (buff 48)) (namespace (buff 20)))
    (let
        (
            (quest (unwrap! (map-get? quests quest-id) ERR-QUEST-NOT-FOUND))
            (xp (get xp-reward quest))
            (user tx-sender)
            (current-xp (get-user-xp user))
            ;; Verify ownership via BNS contract
            (owner-info (unwrap! (contract-call? BNS-CONTRACT name-resolve namespace name) ERR-NOT-BNS-OWNER))
        )
        ;; 1. Check if already completed
        (asserts! (is-none (map-get? user-progress { user: user, quest-id: quest-id })) ERR-ALREADY-COMPLETED)
        
        ;; 2. Verify tx-sender is the owner
        (asserts! (is-eq (get owner owner-info) user) ERR-NOT-BNS-OWNER)

        ;; 3. Mark as complete & Add XP
        (map-set user-progress { user: user, quest-id: quest-id } true)
        (map-set user-xp user (+ current-xp xp))
        
        ;; 4. Mint Badge
        (contract-call? .soulbound-badge-v2 mint user)
    )
)
