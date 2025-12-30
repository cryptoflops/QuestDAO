
;; Soulbound Developer Badge v3 (`soulbound-badge-v3`)
;; A non-transferable NFT that proves completion of specific curriculum modules.

(impl-trait .sip-009-nft-trait.sip-009-nft-trait)

(define-non-fungible-token soulbound-badge uint)

;; Constants
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NOT-TRANSFERABLE (err u101))
(define-constant ERR-ALREADY-MINTED (err u102))

;; Variables
(define-data-var last-token-id uint u0)
(define-data-var admin principal tx-sender)
(define-data-var base-uri (string-ascii 128) "https://quest-dao.vercel.app/api/badges/")

;; Maps
(define-map authorized-contracts principal bool)
(define-map token-to-quest uint uint) ;; token-id -> quest-id
(define-map user-to-quest-badge { user: principal, quest-id: uint } bool)

;; Read-Only Functions
(define-read-only (get-last-token-id)
    (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
    (let
        (
            (quest-id (default-to u0 (map-get? token-to-quest token-id)))
        )
        (if (is-eq quest-id u0)
            (ok none)
            (ok (some (var-get base-uri))) ;; For simplicity, we can append ID in a real API
        )
    )
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? soulbound-badge token-id))
)

(define-read-only (get-quest-for-token (token-id uint))
    (map-get? token-to-quest token-id)
)

(define-read-only (is-authorized (contract principal))
    (default-to false (map-get? authorized-contracts contract))
)

;; Minting (Only Admin or Authorized Contracts can mint)
(define-public (mint (recipient principal) (quest-id uint))
    (begin
        (asserts! (or 
            (is-eq tx-sender (var-get admin)) 
            (is-authorized contract-caller)) 
            ERR-NOT-AUTHORIZED)
        ;; Prevent duplicate badges for the same quest
        (asserts! (is-none (map-get? user-to-quest-badge { user: recipient, quest-id: quest-id })) ERR-ALREADY-MINTED)
        
        (let
            (
                (token-id (+ (var-get last-token-id) u1))
            )
            (try! (nft-mint? soulbound-badge token-id recipient))
            (map-set token-to-quest token-id quest-id)
            (map-set user-to-quest-badge { user: recipient, quest-id: quest-id } true)
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

(define-public (set-base-uri (new-uri (string-ascii 128)))
    (begin
        (asserts! (is-eq tx-sender (var-get admin)) ERR-NOT-AUTHORIZED)
        (var-set base-uri new-uri)
        (ok true)
    )
)
