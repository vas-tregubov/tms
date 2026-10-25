# Application Security

Inspect reachable SQL injection (including raw queries/dynamic identifiers), NoSQL injection through untrusted operators, reflected/stored/DOM XSS, unsafe deserialization, auth/authz defects, sensitive-data leakage, and unsafe command/file/path operations where relevant.

Trace untrusted values to sinks and verify parameterization, allowlists, context-appropriate encoding/sanitization, access checks, and centralized protections. Ordinary React text interpolation alone is not XSS evidence. Do not assume an unused datastore exists.

For each issue provide severity, location, vulnerability, realistic exploitation scenario with attacker prerequisites, impact, and concrete fix. Put Critical/High first. Explicitly state no issue when reviewed categories have no supported findings; missing evidence means not verified.
