// tests/data.test.js
// Unit tests for DataManager

import DataManager from '../src/js/data.js';

describe('DataManager', () => {
    let dataManager;

    const mockCountries = [
        {
            name: { common: 'Canada', official: 'Canada' },
            cca2: 'CA',
            region: 'Americas',
            capital: ['Ottawa'],
        },
        {
            name: { common: 'United States', official: 'United States of America' },
            cca2: 'US',
            region: 'Americas',
            capital: ['Washington, D.C.'],
        },
        {
            name: { common: 'France', official: 'French Republic' },
            cca2: 'FR',
            region: 'Europe',
            capital: ['Paris'],
        },
    ];

    beforeEach(() => {
        dataManager = new DataManager();
        dataManager.setCountries(mockCountries);
    });

    describe('setCountries', () => {
        it('should set countries data', () => {
            const countries = [{ name: { common: 'Test' } }];
            dataManager.setCountries(countries);
            expect(dataManager.allCountries).toEqual(countries);
        });
    });

    describe('filterCountries', () => {
        it('should filter by search term', () => {
            const filtered = dataManager.filterCountries('Canada', '');
            expect(filtered.length).toBe(1);
            expect(filtered[0].name.common).toBe('Canada');
        });

        it('should filter by region', () => {
            const filtered = dataManager.filterCountries('', 'Europe');
            expect(filtered.length).toBe(1);
            expect(filtered[0].region).toBe('Europe');
        });

        it('should filter by both search and region', () => {
            const filtered = dataManager.filterCountries('States', 'Americas');
            expect(filtered.length).toBe(1);
            expect(filtered[0].name.common).toContain('United States');
        });

        it('should return all countries with empty filters', () => {
            const filtered = dataManager.filterCountries('', '');
            expect(filtered.length).toBe(3);
        });

        it('should search by capital', () => {
            const filtered = dataManager.filterCountries('Paris', '');
            expect(filtered.length).toBe(1);
            expect(filtered[0].name.common).toBe('France');
        });
    });

    describe('sortCountries', () => {
        it('should sort by name ascending', () => {
            dataManager.sortCountries('name.common', 'asc');
            const names = dataManager.filteredCountries.map((c) => c.name.common);
            expect(names).toEqual(['Canada', 'France', 'United States']);
        });

        it('should sort by name descending', () => {
            dataManager.sortCountries('name.common', 'desc');
            const names = dataManager.filteredCountries.map((c) => c.name.common);
            expect(names).toEqual(['United States', 'France', 'Canada']);
        });
    });

    describe('getCountryByCode', () => {
        it('should return country by code', () => {
            const country = dataManager.getCountryByCode('CA');
            expect(country.name.common).toBe('Canada');
        });

        it('should return undefined for invalid code', () => {
            const country = dataManager.getCountryByCode('XX');
            expect(country).toBeUndefined();
        });
    });

    describe('getRegions', () => {
        it('should return all unique regions', () => {
            const regions = dataManager.getRegions();
            expect(regions).toContain('Americas');
            expect(regions).toContain('Europe');
            expect(regions.length).toBe(2);
        });

        it('should return sorted regions', () => {
            const regions = dataManager.getRegions();
            expect(regions).toEqual([...regions].sort());
        });
    });
});
