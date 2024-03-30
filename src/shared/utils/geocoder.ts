/* eslint-disable @typescript-eslint/no-explicit-any */
import NodeGeocoder from 'node-geocoder';
import { getEnvVariable } from './env';


interface CustomOptions  {
    httpAdapter: string;
    provider: string
    apiKey: string
    formatter: null
}


// Validate environment variables (optional but recommended)
function validateEnvVars(provider: string, apiKey: string): boolean {
    if (!provider || !apiKey) {
        console.error('Missing required environment variables: GEOCODER_PROVIDER and GEOCODER_API_KEY');
        return false;
    }
    return true;
}

const provider = getEnvVariable('GEOCODER_PROVIDER') || 'default_provider_name'; // Specify your default provider
const apiKey = getEnvVariable('GEOCODER_API_KEY') || 'default_api_key';

// Validate environment variables before creating options
if (!validateEnvVars(provider, apiKey)) {
    throw new Error('Missing required environment variables for geocoder');
}


const options: CustomOptions = {
    provider,
    httpAdapter: 'https',
    apiKey,
    formatter: null
  };

export const geocoder = NodeGeocoder(options as NodeGeocoder.Options);




