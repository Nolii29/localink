/**
 * DOM Element Manager
 * Handles all DOM manipulation and element references
 */

class DOMManager {
    constructor() {
        this.elements = {
            searchInput: document.getElementById('searchInput'),
            resetBtn: document.getElementById('resetBtn'),
            regionFilter: document.getElementById('regionFilter'),
            countriesGrid: document.getElementById('countriesGrid'),
            loadingSpinner: document.getElementById('loadingSpinner'),
            errorContainer: document.getElementById('errorContainer'),
            errorText: document.getElementById('errorText'),
            retryBtn: document.getElementById('retryBtn'),
            noResults: document.getElementById('noResults'),
            modal: document.getElementById('modal'),
            modalBody: document.getElementById('modalBody'),
            closeModal: document.getElementById('closeModal'),
        };

        // Validate all elements exist
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element) {
                console.warn(`DOM element not found: ${key}`);
            }
        });
    }

    /**
     * Show loading spinner
     */
    showLoading() {
        this.elements.loadingSpinner.classList.remove('hidden');
        this.elements.countriesGrid.innerHTML = '';
        this.hideError();
        this.hideNoResults();
    }

    /**
     * Hide loading spinner
     */
    hideLoading() {
        this.elements.loadingSpinner.classList.add('hidden');
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        this.elements.errorText.textContent = message;
        this.elements.errorContainer.classList.remove('hidden');
        this.hideLoading();
    }

    /**
     * Hide error message
     */
    hideError() {
        this.elements.errorContainer.classList.add('hidden');
    }

    /**
     * Show "no results" message
     */
    showNoResults() {
        this.elements.noResults.classList.remove('hidden');
        this.elements.countriesGrid.innerHTML = '';
    }

    /**
     * Hide "no results" message
     */
    hideNoResults() {
        this.elements.noResults.classList.add('hidden');
    }

    /**
     * Render country cards to grid
     * @param {Array} countries - Array of country objects
     */
    renderCountries(countries) {
        this.hideNoResults();
        this.hideError();
        this.hideLoading();

        if (countries.length === 0) {
            this.showNoResults();
            return;
        }

        this.elements.countriesGrid.innerHTML = countries
            .map((country) => this.createCountryCard(country))
            .join('');

        // Add event listeners to cards
        document.querySelectorAll('.country-card').forEach((card) => {
            card.addEventListener('click', (e) => {
                const countryCode = card.dataset.code;
                window.appInstance?.openCountryModal(countryCode);
            });
        });
    }

    /**
     * Create HTML for a country card
     * @param {Object} country - Country data object
     * @returns {string} HTML string for card
     */
    createCountryCard(country) {
        const name = country.name?.common || 'Unknown';
        const capital = country.capital?.[0] || 'N/A';
        const region = country.region || 'Unknown';
        const code = country.cca2 || '';
        const flagUrl = country.flags?.svg || country.flags?.png || '';
        const population = this.formatNumber(country.population || 0);

        return `
            <article class="country-card" data-code="${code}" data-region="${region}" role="button" tabindex="0">
                <img src="${this.escapeHtml(flagUrl)}" alt="Flag of ${this.escapeHtml(name)}" class="country-card__flag" loading="lazy" />
                <div class="country-card__content">
                    <h2 class="country-card__name">${this.escapeHtml(name)}</h2>
                    <p class="country-card__info"><strong>Capital:</strong> ${this.escapeHtml(capital)}</p>
                    <p class="country-card__info"><strong>Population:</strong> ${population}</p>
                    <span class="country-card__region">${this.escapeHtml(region)}</span>
                </div>
            </article>
        `;
    }

    /**
     * Show modal with country details
     * @param {Object} country - Country data object
     */
    showCountryModal(country) {
        const name = country.name?.common || 'Unknown';
        const flagUrl = country.flags?.svg || country.flags?.png || '';
        const capital = country.capital?.join(', ') || 'N/A';
        const region = country.region || 'N/A';
        const subregion = country.subregion || 'N/A';
        const area = this.formatNumber(country.area || 0);
        const population = this.formatNumber(country.population || 0);
        const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
        const currencies = country.currencies ? Object.entries(country.currencies).map(([code, data]) => `${data.name} (${code})`).join(', ') : 'N/A';
        const timezone = country.timezones?.[0] || 'N/A';

        const content = `
            <div class="modal-detail">
                <img src="${this.escapeHtml(flagUrl)}" alt="Flag of ${this.escapeHtml(name)}" class="modal-detail__flag" />
                <h2 class="modal-detail__title">${this.escapeHtml(name)}</h2>
                
                <div class="modal-detail__grid">
                    <div class="modal-detail__item">
                        <span class="modal-detail__label">Capital</span>
                        <span class="modal-detail__value">${this.escapeHtml(capital)}</span>
                    </div>
                    <div class="modal-detail__item">
                        <span class="modal-detail__label">Region</span>
                        <span class="modal-detail__value">${this.escapeHtml(region)}</span>
                    </div>
                    <div class="modal-detail__item">
                        <span class="modal-detail__label">Sub-region</span>
                        <span class="modal-detail__value">${this.escapeHtml(subregion)}</span>
                    </div>
                    <div class="modal-detail__item">
                        <span class="modal-detail__label">Area</span>
                        <span class="modal-detail__value">${area} km²</span>
                    </div>
                    <div class="modal-detail__item">
                        <span class="modal-detail__label">Population</span>
                        <span class="modal-detail__value">${population}</span>
                    </div>
                    <div class="modal-detail__item">
                        <span class="modal-detail__label">Timezone</span>
                        <span class="modal-detail__value">${this.escapeHtml(timezone)}</span>
                    </div>
                </div>

                <div class="modal-detail__item">
                    <span class="modal-detail__label">Languages</span>
                    <span class="modal-detail__value">${this.escapeHtml(languages)}</span>
                </div>
                <div class="modal-detail__item">
                    <span class="modal-detail__label">Currencies</span>
                    <span class="modal-detail__value">${this.escapeHtml(currencies)}</span>
                </div>
            </div>
        `;

        this.elements.modalBody.innerHTML = content;
        this.elements.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close modal
     */
    closeCountryModal() {
        this.elements.modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    /**
     * Format number with thousand separators
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Clear search and filter inputs
     */
    clearInputs() {
        this.elements.searchInput.value = '';
        this.elements.regionFilter.value = '';
    }
}

export default DOMManager;
