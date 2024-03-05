import dotenv from 'dotenv';
dotenv.config();

export function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value || value.length === 0) {
    console.error(`The environment variable ${key} is not set.`);
    throw new Error(`The environment variable ${key} is not set.`);
  }

  return value;
}

export function getEnvVariableAsInt(key: string): number {
  const value = getEnvVariable(key);
  const parsedValue = parseInt(value, 10);

  if (isNaN(parsedValue)) {
    console.error(`The environment variable ${key} is not a valid integer.`);
    throw new Error(`The environment variable ${key} is not a valid integer.`);
  }

  return parsedValue;
}