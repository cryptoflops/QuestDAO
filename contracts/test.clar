(define-read-only (test-hash (input (string-ascii 256)))
    (sha256 input)
)
