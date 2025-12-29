
;; Quest Registry v4 (`quest-registry-v4`)
;; Manages available quests and verifies completion.

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-QUEST-NOT-FOUND (err u101))
(define-constant ERR-ALREADY-COMPLETED (err u102))
(define-constant ERR-INSUFFICIENT-PAYMENT (err u103))

;; Data Maps
(define-map quests
    uint ;; Quest ID
    {
        title: (string-ascii 64),
        xp-reward: uint,
        fee: uint,
        active: bool
    }
)

(define-map user-progress
    { user: principal, quest-id: uint }
    bool ;; Completed?
)

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

;; Admin Functions
(define-public (create-quest (title (string-ascii 64)) (xp uint) (fee uint))
    (begin
        (asserts! (is-eq tx-sender (var-get protocol-wallet)) ERR-NOT-AUTHORIZED)
        (let
            (
                (quest-id (+ (var-get last-quest-id) u1))
            )
            (map-set quests quest-id { title: title, xp-reward: xp, fee: fee, active: true })
            (var-set last-quest-id quest-id)
            (print { event: "quest-created", id: quest-id, title: title })
            (ok quest-id)
        )
    )
)

;; User Functions
(define-public (complete-quest (quest-id uint))
    (let
        (
            (quest (unwrap! (map-get? quests quest-id) ERR-QUEST-NOT-FOUND))
            (fee (get fee quest))
            (user tx-sender)
        )
        ;; 1. Check if already completed
        (asserts! (is-none (map-get? user-progress { user: user, quest-id: quest-id })) ERR-ALREADY-COMPLETED)
        
        ;; 2. Pay Protocol Fee (only if sender is NOT the wallet and fee > 0)
        (if (and (> fee u0) (not (is-eq user (var-get protocol-wallet))))
            (try! (stx-transfer? fee user (var-get protocol-wallet)))
            true
        )

        ;; 3. Mark as complete
        (map-set user-progress { user: user, quest-id: quest-id } true)
        
        ;; 4. Mint Badge (Call v2 Badge contract)
        (print { event: "quest-completed", user: user, quest: quest-id })
        (contract-call? .soulbound-badge-v2 mint user)
    )
)
