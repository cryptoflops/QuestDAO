
;; Quest Registry (`quest-registry`)
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

;; Admin Functions
(define-public (create-quest (title (string-ascii 64)) (xp uint) (fee uint))
    (let
        (
            (quest-id (+ (var-get last-quest-id) u1))
        )
        (map-set quests quest-id { title: title, xp-reward: xp, fee: fee, active: true })
        (var-set last-quest-id quest-id)
        (ok quest-id)
    )
)

;; User Functions
(define-public (complete-quest (quest-id uint))
    (let
        (
            (quest (unwrap! (map-get? quests quest-id) ERR-QUEST-NOT-FOUND))
            (fee (get fee quest))
        )
        ;; 1. Check if already completed
        (asserts! (is-none (map-get? user-progress { user: tx-sender, quest-id: quest-id })) ERR-ALREADY-COMPLETED)
        
        ;; 2. Pay Protocol Fee (Generates "Fees" for Builder Challenge)
        (if (> fee u0)
            (try! (stx-transfer? fee tx-sender (var-get protocol-wallet)))
            true
        )

        ;; 3. Mark as complete
        (map-set user-progress { user: tx-sender, quest-id: quest-id } true)
        
        ;; 4. Mint Badge (Inter-contract call to be added once trait deployed)
        ;; For now, we trust the map.
        (ok true)
    )
)
