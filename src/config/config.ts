const config = {
  appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
  appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  neo4jUrl: String(process.env.NEXT_PUBLIC_NEO4J_URL),
  neo4jUsername: String(process.env.NEXT_PUBLIC_NEO4J_USERNAME),
  neo4jPassword: String(process.env.NEXT_PUBLIC_NEO4J_PASSWORD),
};

export default config;
