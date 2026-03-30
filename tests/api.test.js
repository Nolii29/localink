// tests/api.test.js
// Unit tests for CountriesAPIClient

import CountriesAPIClient from '../src/js/api.js';

describe('CountriesAPIClient', () => {
    // Mock fetch for testing
    global.fetch = jest.fn();

    beforeEach(() => {
        fetch.mockClear();
    });

    describe('getAllCountries', () => {
        it('should fetch all countries successfully', async () => {
            const mockData = [
                { name: { common: 'Canada' }, cca2: 'CA', region: 'Americas' },
                { name: { common: 'United States' }, cca2: 'US', region: 'Americas' },
            ];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const result = await CountriesAPIClient.getAllCountries();
            expect(result).toEqual(mockData);
            expect(fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
        });

        it('should throw error on failed response', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            await expect(CountriesAPIClient.getAllCountries()).rejects.toThrow();
        });

        it('should handle network errors', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(CountriesAPIClient.getAllCountries()).rejects.toThrow(
                'Failed to fetch countries'
            );
        });
    });

    describe('searchByName', () => {
        it('should search for a country by name', async () => {
            const mockData = [{ name: { common: 'Canada' }, cca2: 'CA' }];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const result = await CountriesAPIClient.searchByName('Canada');
            expect(result).toEqual(mockData);
            expect(fetch).toHaveBeenCalledWith(
                'https://restcountries.com/v3.1/name/Canada'
            );
        });

        it('should return empty array for no results', async () => {
            fetch.mockResolvedValueOnce({
                status: 404,
            });

            const result = await CountriesAPIClient.searchByName('XYZ');
            expect(result).toEqual([]);
        });

        it('should handle empty search', async () => {
            const mockData = [{ name: { common: 'Test' } }];
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const result = await CountriesAPIClient.searchByName('');
            expect(result).toEqual(mockData);
        });
    });

    describe('getByCode', () => {
        it('should fetch country by code', async () => {
            const mockData = { name: { common: 'Canada' }, cca2: 'CA' };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const result = await CountriesAPIClient.getByCode('CA');
            expect(result).toEqual(mockData);
            expect(fetch).toHaveBeenCalledWith(
                'https://restcountries.com/v3.1/alpha/CA'
            );
        });

        it('should throw error for invalid code', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
            });

            await expect(CountriesAPIClient.getByCode('XX')).rejects.toThrow();
        });
    });
});
