# CDN Metadata

This directory contains metadata files used by the Shindo Launcher.

## Files

### `client.json`
Global client metadata used by legacy launcher versions.
- `updatelink` — GitHub releases URL for client updates
- `launcherLink` — GitHub releases URL for launcher updates
- `latestversionstring` — Human-readable latest version
- `latestversion` — Integer version code
- `discord` — Discord invite URL
- `discontinued` — Whether the project is discontinued
- `soar8released` — Internal feature flag
- `versioningUrl` — URL to the versioning manifest
- `javaMetaUrl` — URL to the Java runtime manifest

### `versioning.json`
Full version manifest (schema: shindo.versioning.v3).
- Channels: `stable` and `dev` with latest build pointers
- Versions array: each MC version with its builds (buildId, semver, type, artifacts)
- Artifacts include: jsonUrl (Minecraft metadata), changelogUrl, versionUrl
- Default version and recommended channel

### `dev.json`
Development roadmap tracker.
- Lists in-progress features with progress percentage and status

### `java.json`
Java runtime download manifest (schema: shindo.java.v1).
- Per-version, per-OS, per-arch download URLs
- SHA256 checksums and file sizes for verification
