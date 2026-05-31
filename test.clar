(define-read-only (hash-test (input (string-ascii 256)))
  (sha256 input)
)
