/**
 * Global Country Explorer
 * Main application controller
 */

import CountriesAPIClient from './api.js';
import DOMManager from './dom.js';
import DataManager from './data.js';

class CountryExplorer {
    constructor() {
        this.domManager = new DOMManager();
        this.dataManager = new DataManager();
        this.debounceTimer = null;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Load countries data
            this.domManager.showLoading();
            const countries = await CountriesAPIClient.getAllCountries();
            
            // Store and sort data
            this.dataManager.setCountries(countries);
            this.dataManager.sortCountries('name.common', 'asc');
            
            // Render initial view
            this.domManager.renderCountries(this.dataManager.filteredCountries);
            
            // Attach event listeners
            this.attachEventListeners();
            
            console.log('CountryExplorer initialized successfully');
        } catch (error) {
            this.domManager.showError(
                `Failed to load countries: ${error.message}. Please refresh the page.`
            );
            console.error('Initialization error:', error);
        }
    }

    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        // Search input with debounce
        this.domManager.elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.handleFilter();
            }, 300);
        });

        // Region filter
        this.domManager.elements.regionFilter.addEventListener('change', () => {
            this.handleFilter();
        });

        // Reset button
        this.domManager.elements.resetBtn.addEventListener('click', () => {
            this.handleReset();
        });

        // Retry button
        this.domManager.elements.retryBtn.addEventListener('click', () => {
            this.init();
        });

        // Modal close button
        this.domManager.elements.closeModal.addEventListener('click', () => {
            this.domManager.closeCountryModal();
        });

        // Modal backdrop click
        this.domManager.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.domManager.elements.modal) {
                this.domManager.closeCountryModal();
            }
        });

        // Keyboard escape to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.domManager.elements.modal.classList.contains('hidden')) {
                this.domManager.closeCountryModal();
            }
        });

        // Card keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target.classList.contains('country-card')) {
                    e.preventDefault();
                    e.target.click();
                }
            }
        });
    }

    /**
     * Handle filter changes
     */
    handleFilter() {
        const searchTerm = this.domManager.elements.searchInput.value;
        const region = this.domManager.elements.regionFilter.value;

        const filtered = this.dataManager.filterCountries(searchTerm, region);
        this.dataManager.sortCountries('name.common', 'asc');
        
        this.domManager.renderCountries(filtered);
    }

    /**
     * Handle reset button
     */
    handleReset() {
        this.domManager.clearInputs();
        this.dataManager.setCountries(this.dataManager.allCountries);
        this.dataManager.sortCountries('name.common', 'asc');
        this.domManager.renderCountries(this.dataManager.filteredCountries);
    }

    /**
     * Open modal with country details
     * @param {string} code - Country code
     */
    async openCountryModal(code) {
        try {
            const country = this.dataManager.getCountryByCode(code);
            if (country) {
                this.domManager.showCountryModal(country);
            }
        } catch (error) {
            console.error('Error opening modal:', error);
        }
    }
}

// Initialize app when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const app = new CountryExplorer();
    window.appInstance = app; // Make globally available
    app.init();
});

export default CountryExplorer;
