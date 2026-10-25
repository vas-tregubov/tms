# Supply Chain

Inspect actual resolved direct/transitive dependency versions in manifests and lockfiles, known CVEs/advisories, outdated packages, risky transitive dependencies, and relevant install/build scripts. Age alone does not prove vulnerability.

Verify current CVEs and recommended safe versions against authoritative advisories or maintainer releases. Cite source, lookup date, affected range, installed version, applicability, and fixed version. Never invent a CVE or safe version. If external lookup is unavailable, explicitly state it is needed and advisory status is not verified.

Recommend the smallest safe update with breaking-change risk, release-note evidence, and compatibility checks. Distinguish confirmed vulnerability, uncertain exposure, and routine maintenance. Do not change dependencies during review or treat an audit result alone as proof of exploitability.
