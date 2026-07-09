import * as migration_20260709_160301_migration from './20260709_160301_migration';
import * as migration_20260709_160834_migration from './20260709_160834_migration';
import * as migration_20260709_161806_migration from './20260709_161806_migration';
import * as migration_20260709_162555_migration from './20260709_162555_migration';

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
    name: '20260709_162555_migration'
  },
];
