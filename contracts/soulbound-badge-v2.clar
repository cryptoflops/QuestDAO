
;; Soulbound Developer Badge v2 (`soulbound-badge-v2`)
;; A non-transferable NFT that proves skill acquisition.

(impl-trait .sip-009-nft-trait.sip-009-nft-trait)

(define-non-fungible-token soulbound-badge uint)

;; Constants
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NOT-TRANSFERABLE (err u101))

;; Variables
(define-data-var last-token-id uint u0)
(define-data-var admin principal tx-sender)

;; Authorized contracts list
(define-map authorized-contracts principal bool)

;; Read-Only Functions
(define-read-only (get-last-token-id)
    (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
    (ok none)
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? soulbound-badge token-id))
)

(define-read-only (is-authorized (contract principal))
    (default-to false (map-get? authorized-contracts contract))
)

;; Minting (Only Admin or Authorized Contracts can mint)
(define-public (mint (recipient principal))
    (begin
        (asserts! (or 
            (is-eq tx-sender (var-get admin)) 
            (is-authorized contract-caller)) 
            ERR-NOT-AUTHORIZED)
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
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin 
        (asserts! (is-eq sender tx-sender) ERR-NOT-AUTHORIZED)
        ERR-NOT-TRANSFERABLE
    )
)

;; Admin Functions
(define-public (set-admin (new-admin principal))
    (begin
        (asserts! (is-eq tx-sender (var-get admin)) ERR-NOT-AUTHORIZED)
        (var-set admin new-admin)
        (ok true)
    )
)

(define-public (set-authorized (contract principal) (enabled bool))
    (begin
        (asserts! (is-eq tx-sender (var-get admin)) ERR-NOT-AUTHORIZED)
        (map-set authorized-contracts contract enabled)
        (ok true)
    )
)
