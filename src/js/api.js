/**
 * REST Countries API Client
 * Handles all API communication with error handling
 */

const API_BASE_URL = 'https://restcountries.com/v3.1';

// Specify which fields we need (max 10 fields allowed)
const FIELDS = 'fields=name,cca2,region,capital,population,area,flags,languages,currencies,timezones';

class CountriesAPIClient {
    /**
     * Fetch all countries data
     * @returns {Promise<Array>} Array of country objects
     */
    static async getAllCountries() {
        try {
            const response = await fetch(`${API_BASE_URL}/all?${FIELDS}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Failed to fetch countries: ${error.message}`);
        }
    }

    /**
     * Search countries by name
     * @param {string} name - Country name to search
     * @returns {Promise<Array>} Array of matching countries
     */
    static async searchByName(name) {
        if (!name || name.trim().length === 0) {
            return this.getAllCountries();
        }

        try {
            const response = await fetch(`${API_BASE_URL}/name/${encodeURIComponent(name)}?${FIELDS}`);
            
            // 404 means no countries found
            if (response.status === 404) {
                return [];
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error.message.includes('404')) {
                return [];
            }
            throw new Error(`Search failed: ${error.message}`);
        }
    }

    /**
     * Fetch country by ISO code
     * @param {string} code - ISO country code
     * @returns {Promise<Array>} Array with single country object
     */
    static async getByCode(code) {
        try {
            const response = await fetch(`${API_BASE_URL}/alpha/${code}?${FIELDS}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Failed to fetch country details: ${error.message}`);
        }
    }
}

export default CountriesAPIClient;
