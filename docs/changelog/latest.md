### 2.1.0

_Released 2025 Jun 17_

#### Overview

This is a maintenance release only and does not contain any behavioral change.

In accordance with the sunset of Nexus Repository Manager 2 and the Sonatype
OSSRH (OSS Repository Hosting) service, this is the final release of this set of
GitHub Actions. The actions remain available and may still be used with
instances of Nexus Repository Manager 2 or to publish to the Central Portal with
[some limitations](https://central.sonatype.org/publish/publish-portal-ossrh-staging-api#known-limitations).
However, it will not receive further development.

It is recommended to migrate to [publishing via the Central Portal](https://central.sonatype.org/publish/publish-portal-guide/)
instead. The [central-portal-actions](https://github.com/TheMrMilchmann/central-portal-actions)
provide similar capabilities to this repository using the new Central Publisher
API.