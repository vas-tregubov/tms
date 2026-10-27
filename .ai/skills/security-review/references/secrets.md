# Secrets

Inspect relevant API keys, tokens, passwords, connection strings, private keys/certificates, commented credentials, and secrets in constants/configs. Distinguish placeholders, public IDs, and public certificates from private authentication material; keyword matches alone are insufficient. Do not expand into Git history unless requested.

For each finding give location, type, severity, risk, and recommended storage via server-side environment injection or a secret manager with appropriate access controls. Frontend build variables are public bundle data, not secret storage.

Do not reproduce secret values in reports or logs. Recommend revocation/rotation for exposed credentials; deleting a literal does not revoke it. Do not rotate credentials or rewrite history during review. State no issue found when appropriate.
