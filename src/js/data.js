/**
 * Data Manager
 * Handles filtering and sorting of country data
 */

class DataManager {
    constructor() {
        this.allCountries = [];
        this.filteredCountries = [];
    }

    /**
     * Set all countries data
     * @param {Array} countries - Array of country objects
     */
    setCountries(countries) {
        this.allCountries = countries;
        this.filteredCountries = countries;
    }

    /**
     * Filter countries by search term
     * @param {string} searchTerm - Search term
     * @param {string} region - Region filter
     * @returns {Array} Filtered countries
     */
    filterCountries(searchTerm, region) {
        let filtered = this.allCountries;

        // Filter by search term
        if (searchTerm && searchTerm.trim().length > 0) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((country) => {
                const name = country.name?.common || '';
                const capital = country.capital?.[0] || '';
                const altNames = country.name?.official || '';
                return (
                    name.toLowerCase().includes(term) ||
                    capital.toLowerCase().includes(term) ||
                    altNames.toLowerCase().includes(term)
                );
            });
        }

        // Filter by region
        if (region && region.trim().length > 0) {
            filtered = filtered.filter((country) => country.region === region);
        }

        this.filteredCountries = filtered;
        return filtered;
    }

    /**
     * Sort countries by property
     * @param {string} property - Property to sort by
     * @param {string} order - 'asc' or 'desc'
     * @returns {Array} Sorted countries
     */
    sortCountries(property = 'name.common', order = 'asc') {
        const sorted = [...this.filteredCountries].sort((a, b) => {
            let aVal = a;
            let bVal = b;

            // Handle nested properties like 'name.common'
            property.split('.').forEach((prop) => {
                aVal = aVal?.[prop];
                bVal = bVal?.[prop];
            });

            // Handle comparison
            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;
            return 0;
        });

        this.filteredCountries = sorted;
        return sorted;
    }

    /**
     * Get single country by code
     * @param {string} code - ISO country code
     * @returns {Object} Country object
     */
    getCountryByCode(code) {
        return this.allCountries.find((country) => country.cca2 === code);
    }

    /**
     * Get regions from current countries
     * @returns {Array} Array of unique regions
     */
    getRegions() {
        const regions = new Set(this.allCountries.map((c) => c.region).filter(Boolean));
        return Array.from(regions).sort();
    }
}

export default DataManager;
