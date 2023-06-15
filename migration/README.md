# migration

This package is responsible for migrating data from VizHub V2 to V3. This involves translation from the old data model to the new data model, which is fairly involved. The aim is to have an incremental migration algorithm that can be run any time or periodically to migrate discrete intervals of time (`fromTime`, `toTime`).

## Migration Phases

The migration process is broken into phases, each of which is responsible for migrating a particular aspect of the data model. The phases are as follows:

- Incremental migration of Vizzes based on time
- As needed to support migrated Vizzes, the following additional entities are migrated:
  - Users
  - Commits (revision history for the vizzes)
  - Upvotes
  - Analytics events (e.g. view count history for particular vizzes)

### Pre-Private Beta Phase

Before private beta, the V3 database will be unstable and subject to being completely wiped at any time. This is because the data model is still in flux, and we are still experimenting with different approaches. During this time, the VizHub V2 production database will be used as the source of truth for the data model. The VizHub V3 production database will be used as the destination for the data model. Experiments will be conducted to identify the ideal incremental migration approach.

### Private Beta Phase

During the private beta phase, we will be incrementally migrating Vizzes from V2 to V3. This will be done in batches, with each batch being a discrete time interval. The first batch will be the first 1000 Vizzes created on V2. The second batch will be the next 1000 Vizzes created on V2, and so on. The migration process will be run periodically to migrate new batches of Vizzes. The VizHub V2 production database will be used as the source of truth for the data model. The VizHub V3 production database will be used as the destination for the data model.

During this time, the VizHub V2 production site will be fully operational and will experience no interference from this process. The VizHub V3 production site will be fully operational, but will not have the full set of Vizzes migrated from V2. The VizHub V3 production site will be able to display Vizzes that have been migrated, but will not be able to display Vizzes that have not yet been migrated.

During the private beta phase, migrated vizzes will be considered "read-only". This means they will not be editable, but they can however be forked. The forks will only exist in VizHub V3, and will not be migrated back to VizHub V2. This is because the VizHub V3 data model is not compatible with the VizHub V2 data model. The VizHub V3 data model is designed to be more flexible and extensible, and is designed to support future features such as private vizzes, private forks, and private comments.

### Public Beta Phase

Before entering the public beta phase, all vizzes will be migrated from V2 to V3. This means that V3 will be "caught up" to V2 at the time of public beta launch. During this time, the most recent changes from V2 will be migrated daily. This will ensure that V3 is always up to date with V2, lagging behind by at most one day. The VizHub V2 production site will be fully operational and will experience no interference from this process. The VizHub V3 production site will be fully operational, and will be able to display all Vizzes from V2.

### Production Phase

Eventually, the VizHub V2 site will be moved to another domain, `v2-readonly.vizhub.com`. This will be a read-only version of the VizHub V2 site, and will be used for archival purposes. The VizHub V3 site will be the primary site, and will be the only site that is actively maintained. The VizHub V3 site will be fully operational, and will be able to display all Vizzes from V2. The VizHub V2 site will be read-only, and will not be able to display any new Vizzes created on V3.

At this time, the VizHub V3 site will be able to not only display all Vizzes migrated from V2, but will also be able to **edit** them (a capability not available in Public Beta). This completes the migration process. Thereafter, VizHub V3 will be the only site that is actively maintained.
