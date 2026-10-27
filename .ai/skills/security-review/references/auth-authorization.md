# Auth Authorization

Check JWT generation/verification, expected algorithm, signature, expiry, applicable issuer/audience, and key handling. Decoding alone does not verify trust; account for middleware verification.

Check session fixation, identifier rotation after login/privilege change, expiry, invalidation/logout, IDOR, client-side-only authorization, horizontal privilege escalation across owners/tenants, and vertical privilege escalation across roles. Compare revocation behavior with the actual intended session/token contract.

For a supported vector give location, severity, starting privileges, what the attacker does, the request/action used, what they obtain, the missing protection, and minimum fix. Check centralized guards before declaring checks absent.
