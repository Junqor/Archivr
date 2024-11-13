export function validateEnv(environmentVariable) {
    if (!environmentVariable) {
        throw new Error("Need to provide Environment Variables");
    }
    return environmentVariable;
}
