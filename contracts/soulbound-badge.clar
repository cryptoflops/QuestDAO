
;; Soulbound Developer Badge (`soulbound-badge`)
;; A non-transferable NFT that proves skill acquisition.

(impl-trait .sip-009-nft-trait.sip-009-nft-trait)

(define-non-fungible-token soulbound-badge uint)

;; Constants
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NOT-TRANSFERABLE (err u101))

;; Variables
(define-data-var last-token-id uint u0)
(define-data-var admin principal tx-sender)

;; Read-Only Functions
(define-read-only (get-last-token-id)
    (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
    (ok none) ;; Todo: Dynamic URIs based on Quest ID
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? soulbound-badge token-id))
)

;; Minting (Only Admin/Registry can mint)
(define-public (mint (recipient principal))
    (begin
        ;; Check auth - for now only admin, later QuestRegistry
        (asserts! (is-eq tx-sender (var-get admin)) ERR-NOT-AUTHORIZED)
        (let
            (
                (token-id (+ (var-get last-token-id) u1))
            )
            (try! (nft-mint? soulbound-badge token-id recipient))
            (var-set last-token-id token-id)
            (ok token-id)
        )
    )
)

;; Transfer (Disabled for Soulbound)
;; SIP-009 requires this function signature
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin 
        (asserts! (is-eq sender tx-sender) ERR-NOT-AUTHORIZED)
        ;; Strictly soulbound: No transfers allowed, even by owner.
        ;; Only exception might be burning (transfer to null), but for now we block all.
        ERR-NOT-TRANSFERABLE
    )
)

(define-public (set-admin (new-admin principal))
    (begin
        (asserts! (is-eq tx-sender (var-get admin)) ERR-NOT-AUTHORIZED)
        (var-set admin new-admin)
        (ok true)
    )
)
