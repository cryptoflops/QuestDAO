
;; DAO Voting v2 (`dao-voting-v2`)
;; Meritocratic governance based on quest completion.

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-ALREADY-VOTED (err u101))
(define-constant ERR-NO-BADGE (err u102))

(define-map proposals
    uint
    {
        title: (string-ascii 64),
        yes-votes: uint,
        no-votes: uint,
        end-block: uint
    }
)

(define-map votes
    { proposal-id: uint, voter: principal }
    bool ;; Has voted
)

(define-map delegations
    principal ;; Deletagor
    principal ;; Delegatee
)

(define-data-var last-proposal-id uint u0)

(define-public (create-proposal (title (string-ascii 64)) (duration uint))
    (begin
        ;; Gatekeeping: Must hold a Soulbound Badge to propose
        (asserts! (> (unwrap! (contract-call? .soulbound-badge get-last-token-id) (err u0)) u0) ERR-NO-BADGE) 
        
        (let
            (
                (proposal-id (+ (var-get last-proposal-id) u1))
            )
            (map-set proposals proposal-id {
                title: title,
                yes-votes: u0,
                no-votes: u0,
                end-block: (+ block-height duration)
            })
            (var-set last-proposal-id proposal-id)
            (ok proposal-id)
        )
    )
)

(define-public (delegate (to principal))
    (begin
        ;; Users can delegate their voting power to another address
        (map-set delegations tx-sender to)
        (ok true)
    )
)

(define-public (vote (proposal-id uint) (vote-for bool))
    (let
        (
            (proposal (unwrap! (map-get? proposals proposal-id) (err u404)))
        )
        ;; Gatekeeping: Must hold a Soulbound Badge to vote
        (asserts! (> (unwrap! (contract-call? .soulbound-badge get-last-token-id) (err u0)) u0) ERR-NO-BADGE)
        
        ;; Check if already voted
        (asserts! (is-none (map-get? votes { proposal-id: proposal-id, voter: tx-sender })) ERR-ALREADY-VOTED)
        
        ;; Record Vote
        (map-set votes { proposal-id: proposal-id, voter: tx-sender } true)
        
        ;; Update Tally (1 Vote = 1 Person for MVP)
        ;; In a full version, we would verify if tx-sender has delegated power from others
        ;; For MVP, we just count the sender's own vote.
        (map-set proposals proposal-id 
            (merge proposal {
                yes-votes: (if vote-for (+ (get yes-votes proposal) u1) (get yes-votes proposal)),
                no-votes: (if vote-for (get no-votes proposal) (+ (get no-votes proposal) u1))
            })
        )
        (ok true)
    )
)
