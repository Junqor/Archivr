export function validateEnv(environmentVariable: string | undefined): string {
  if (!environmentVariable) {
    throw new Error("Need to provide Environment Variables");
  }
  return environmentVariable;
}
