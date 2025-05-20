# nexus-actions

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge&label=License)](https://github.com/TheMrMilchmann/nexus-actions/blob/master/LICENSE)

A set of [GitHub Actions](https://github.com/features/actions) to automate
publishing to Maven Central. Each action provides access to a primitive
operation for interacting with the [Nexus Staging Suite](https://help.sonatype.com/repomanager2/staging-releases/staging-overview).

## Actions

Each action takes a `base-url` input that can be used to configure the Nexus
instance. By default, this points to the [repository manager for Maven Central](https://central.sonatype.org/)
(`https://oss.sonatype.org/`).

> **Note**: For projects provisioned since February 2021, the `base-url` may
> have to be updated (e.g., to `https://s01.oss.sonatype.org`). Please refer to
> [Sonatype's documentation](https://central.sonatype.org/publish/publish-guide/#releasing-to-central)
> to find out which Nexus instance you should use for your project.

Additionally, each action takes a "username" and a "password" input to
authenticate against the Nexus instance. These can also be provided with the
generated [user token](https://central.sonatype.org/publish/manage-user/#generate-token-on-nxrm-servers)
instead of the plain credentials.


### Create Nexus Staging Repository

Creates a new staging Nexus repository.

```yaml
steps:
  - uses: TheMrMilchmann/nexus-actions/create-staging-repo@v2
    with:
      username: ...
      password: ...
      staging-profile-id: ...
    outputs:
      repository-id: ${{ steps.create.outputs.repository_id }}
```

#### Inputs

| Input                | Description                                            | Default                       |
|----------------------|--------------------------------------------------------|-------------------------------|
| `username`           | The username to use to authenticate against the Nexus. |                               |
| `password`           | The password to use to authenticate against the Nexus. |                               |
| `base-url`           | The base URL of the Nexus instance.                    | `"https://oss.sonatype.org/"` |
| `staging-profile-id` | The ID of the staging profile.                         |                               |
| `description`        | An optional description for the staging repository.    | `"Created by GitHub Actions"` |

#### Outputs

| Output          | Description                                     |
|-----------------|-------------------------------------------------|
| `repository-id` | The ID of the newly created staging repository. |


### Close Nexus Staging Repository

Closes a staging Nexus repository.

```yaml
steps:
  - uses: TheMrMilchmann/nexus-actions/close-staging-repo@v2
    with:
      username: ...
      password: ...
      staging-repository-id: ...
```

#### Inputs

| Input                   | Description                                            | Default                       |
|-------------------------|--------------------------------------------------------|-------------------------------|
| `username`              | The username to use to authenticate against the Nexus. |                               |
| `password`              | The password to use to authenticate against the Nexus. |                               |
| `base-url`              | The base URL of the Nexus instance.                    | `"https://oss.sonatype.org/"` |
| `staging-repository-id` | The ID of the staging repository.                      |                               |
| `description`           | An optional description for the staging repository.    | `"Closed by GitHub Actions"`  |


### Release Nexus Staging Repository

Releases a staging Nexus repository.

```yaml
steps:
  - uses: TheMrMilchmann/nexus-actions/release-staging-repo@v2
    with:
      username: ...
      password: ...
      staging-repository-id: ...
```

#### Inputs

| Input                   | Description                                            | Default                        |
|-------------------------|--------------------------------------------------------|--------------------------------|
| `username`              | The username to use to authenticate against the Nexus. |                                |
| `password`              | The password to use to authenticate against the Nexus. |                                |
| `base-url`              | The base URL of the Nexus instance.                    | `"https://oss.sonatype.org/"`  |
| `staging-repository-id` | The ID of the staging repository.                      |                                |
| `description`           | An optional description for the staging repository.    | `"Released by GitHub Actions"` |
| `auto-drop`             | Whether to automatically drop the repository.          | `true`                         |


### Drop Nexus Staging Repository

Drops a staging Nexus repository.

```yaml
steps:
  - uses: TheMrMilchmann/nexus-actions/drop-staging-repo@v2
    with:
      username: ...
      password: ...
      staging-repository-id: ...
```

#### Inputs

| Input                   | Description                                            | Default                       |
|-------------------------|--------------------------------------------------------|-------------------------------|
| `username`              | The username to use to authenticate against the Nexus. |                               |
| `password`              | The password to use to authenticate against the Nexus. |                               |
| `base-url`              | The base URL of the Nexus instance.                    | `"https://oss.sonatype.org/"` |
| `staging-repository-id` | The ID of the staging repository.                      |                               |
| `description`           | An optional description for the staging repository.    | `"Dropped by GitHub Actions"` |


## Versioning

This action is strictly following [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html).
Thus, it is recommended to pin the action against specific MAJOR version. This
can be achieved by using the `v${MAJOR}` branch.

To get an overview about the action's versions, see the [changelog](docs/changelog/README.md).


## Credits & History

This action was inspired by the [Gradle Nexus Publish Plugin](https://github.com/gradle-nexus/publish-plugin)
and the [GitHub Actions provided by the nexus-actions group](https://github.com/nexus-actions).
Since the former is limited in flexibility due to being a Gradle plugin and the
latter combines closing and promoting (which can be hindering), I decided to
create these actions. They expose the four primitive operations to interact with
staging Nexus repositories and optionally provide select handful shortcuts.


## License

```
Copyright (c) 2023 Leon Linhart

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```