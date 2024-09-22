import config from "@/config/config";
import neo4j, { Session } from "neo4j-driver";

const driver = neo4j.driver(
  config.neo4jUrl,
  neo4j.auth.basic(config.neo4jUsername, config.neo4jPassword)
);

export async function runQuery(query: string, params = {}) {
  let session: Session | null = null;
  try {
    session = driver.session();
    const result = await session.run(query, params);
    return result.records.map((record) => record.toObject());
  } finally {
    if (session) {
      await session.close();
    }
  }
}

export async function closeDriver() {
  await driver.close();
}
