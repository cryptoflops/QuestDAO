
;; DAO Voting v4 (`dao-voting-v4`)
;; Linked to soulbound-badge-v2

(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-ALREADY-VOTED (err u101))
(define-constant ERR-NO-BADGE (err u102))
(define-constant ERR-INVALID-VOTE (err u103))

(define-map proposals
    uint
    {
        title: (string-ascii 64),
        yes-votes: uint,
        no-votes: uint,
        abstain-votes: uint,
        end-block: uint
    }
)

(define-map votes
    { proposal-id: uint, voter: principal }
    (string-ascii 10) ;; "yes", "no", "abstain"
)

(define-map delegations
    principal ;; Deletagor
    principal ;; Delegatee
)

(define-data-var last-proposal-id uint u0)

(define-read-only (get-last-proposal-id)
    (ok (var-get last-proposal-id))
)

(define-read-only (get-proposal (proposal-id uint))
    (map-get? proposals proposal-id)
)

(define-public (create-proposal (title (string-ascii 64)) (duration uint))
    (begin
        ;; Gatekeeping: Must hold a Soulbound Badge v2 to propose
        (asserts! (> (unwrap! (contract-call? .soulbound-badge-v2 get-last-token-id) (err u0)) u0) ERR-NO-BADGE) 
        
        (let
            (
                (proposal-id (+ (var-get last-proposal-id) u1))
            )
            (map-set proposals proposal-id {
                title: title,
                yes-votes: u0,
                no-votes: u0,
                abstain-votes: u0,
                end-block: (+ block-height duration)
            })
            (var-set last-proposal-id proposal-id)
            (ok proposal-id)
        )
    )
)

(define-public (delegate (to principal))
    (begin
        (map-set delegations tx-sender to)
        (ok true)
    )
)

(define-public (vote (proposal-id uint) (vote-for (string-ascii 10)))
    (let
        (
            (proposal (unwrap! (map-get? proposals proposal-id) (err u404)))
            (previous-vote (map-get? votes { proposal-id: proposal-id, voter: tx-sender }))
        )
        ;; Valid Inputs
        (asserts! (or (is-eq vote-for "yes") (is-eq vote-for "no") (is-eq vote-for "abstain")) ERR-INVALID-VOTE)
        
        ;; Gatekeeping
        (asserts! (> (unwrap! (contract-call? .soulbound-badge-v2 get-last-token-id) (err u0)) u0) ERR-NO-BADGE)
        
        ;; 1. Revert Previous Vote (If exists)
        (match previous-vote
            prev-choice 
            (map-set proposals proposal-id 
                (merge proposal {
                    yes-votes: (if (is-eq prev-choice "yes") (- (get yes-votes proposal) u1) (get yes-votes proposal)),
                    no-votes: (if (is-eq prev-choice "no") (- (get no-votes proposal) u1) (get no-votes proposal)),
                    abstain-votes: (if (is-eq prev-choice "abstain") (- (get abstain-votes proposal) u1) (get abstain-votes proposal))
                })
            )
            false ;; No previous vote, do nothing
        )

        ;; 2. Refresh Proposal State (after potential revert)
        (let 
            (
                (current-proposal (unwrap! (map-get? proposals proposal-id) (err u404)))
            )
            ;; 3. Apply New Vote
            (map-set votes { proposal-id: proposal-id, voter: tx-sender } vote-for)
            
            (map-set proposals proposal-id 
                (merge current-proposal {
                    yes-votes: (if (is-eq vote-for "yes") (+ (get yes-votes current-proposal) u1) (get yes-votes current-proposal)),
                    no-votes: (if (is-eq vote-for "no") (+ (get no-votes current-proposal) u1) (get no-votes current-proposal)),
                    abstain-votes: (if (is-eq vote-for "abstain") (+ (get abstain-votes current-proposal) u1) (get abstain-votes current-proposal))
                })
            )
            (ok true)
        )
    )
)
