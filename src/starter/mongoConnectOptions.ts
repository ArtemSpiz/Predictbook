export interface MongoConnectOptions {
  maxPoolSize: number
  minPoolSize: number
  serverSelectionTimeoutMS: number
  socketTimeoutMS: number
}

const num = (value: string | undefined, fallback: number): number => {
  if (value == null || value.trim() === '') return fallback
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : fallback
}

/** Bounded mongoose pool options; keep maxPoolSize small on serverless so
 * per-instance pool × concurrency stays under the Atlas connection cap. */
export function mongoConnectOptions(
  env?: Partial<NodeJS.ProcessEnv>,
): MongoConnectOptions {
  const vars = env ?? process.env
  return {
    maxPoolSize: num(vars.MONGO_MAX_POOL_SIZE, 10),
    minPoolSize: num(vars.MONGO_MIN_POOL_SIZE, 0),
    serverSelectionTimeoutMS: num(vars.MONGO_SERVER_SELECTION_TIMEOUT_MS, 5000),
    socketTimeoutMS: num(vars.MONGO_SOCKET_TIMEOUT_MS, 45000),
  }
}
