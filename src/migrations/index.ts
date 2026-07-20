import * as migration_20260709_160301_migration from './20260709_160301_migration';
import * as migration_20260709_160834_migration from './20260709_160834_migration';
import * as migration_20260709_161806_migration from './20260709_161806_migration';
import * as migration_20260709_162555_migration from './20260709_162555_migration';
import * as migration_20260709_163657_migration from './20260709_163657_migration';
import * as migration_20260710_121125_migration from './20260710_121125_migration';
import * as migration_20260710_121326_migration from './20260710_121326_migration';
import * as migration_20260710_123116_migration from './20260710_123116_migration';
import * as migration_20260710_123211_migration from './20260710_123211_migration';
import * as migration_20260716_165730_migration from './20260716_165730_migration';
import * as migration_20260716_171359_migration from './20260716_171359_migration';
import * as migration_20260720_120000_livefeed_text_to_richtext from './20260720_120000_livefeed_text_to_richtext';

export const migrations = [
  {
    up: migration_20260709_160301_migration.up,
    down: migration_20260709_160301_migration.down,
    name: '20260709_160301_migration',
  },
  {
    up: migration_20260709_160834_migration.up,
    down: migration_20260709_160834_migration.down,
    name: '20260709_160834_migration',
  },
  {
    up: migration_20260709_161806_migration.up,
    down: migration_20260709_161806_migration.down,
    name: '20260709_161806_migration',
  },
  {
    up: migration_20260709_162555_migration.up,
    down: migration_20260709_162555_migration.down,
    name: '20260709_162555_migration',
  },
  {
    up: migration_20260709_163657_migration.up,
    down: migration_20260709_163657_migration.down,
    name: '20260709_163657_migration',
  },
  {
    up: migration_20260710_121125_migration.up,
    down: migration_20260710_121125_migration.down,
    name: '20260710_121125_migration',
  },
  {
    up: migration_20260710_121326_migration.up,
    down: migration_20260710_121326_migration.down,
    name: '20260710_121326_migration',
  },
  {
    up: migration_20260710_123116_migration.up,
    down: migration_20260710_123116_migration.down,
    name: '20260710_123116_migration',
  },
  {
    up: migration_20260710_123211_migration.up,
    down: migration_20260710_123211_migration.down,
    name: '20260710_123211_migration',
  },
  {
    up: migration_20260716_165730_migration.up,
    down: migration_20260716_165730_migration.down,
    name: '20260716_165730_migration',
  },
  {
    up: migration_20260716_171359_migration.up,
    down: migration_20260716_171359_migration.down,
    name: '20260716_171359_migration'
  },
  {
    up: migration_20260720_120000_livefeed_text_to_richtext.up,
    down: migration_20260720_120000_livefeed_text_to_richtext.down,
    name: '20260720_120000_livefeed_text_to_richtext',
  },
];
