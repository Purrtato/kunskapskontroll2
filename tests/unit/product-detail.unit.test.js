// tests/product-detail.unit.test.js
// Unit tests - all fetch calls are mocked, no real network calls
// Run with: npm test

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPromotions } from '../../src/api-service.js';

describe('fetchPromotions – unit', () => {

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    it('returns promotion data when given a valid id', async () => {
        const mockPromotion = [{
            id: 61,
            product_name: 'arla mellanmjölk',
            product_brand: 'arla',
            product_description: 'klassisk mellanmjölk med 1.5% fetthalt',
            product_image_url: 'https://images.arla.com/filename/07310865000194_C1L1.PNG?width=500&height=500&format=webp&quality=82&mode=boxpad',
            price: 12,
            store_info: 'Coop',
            start_date: '2026-04-01',
            end_date: '2026-04-07',
            energy_kcal: 46,
            protein_g: 3.5,
        }];

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockPromotion,
        });

        const result = await fetchPromotions(61);
        expect(result).toEqual(mockPromotion);
        expect(result[0].product_name).toBe('arla mellanmjölk');
        expect(result[0].store_info).toBe('Coop');
    });

    it('returns all promotions when no id is given', async () => {
        const mockPromotions = [
            { id: 61, product_name: 'arla mellanmjölk' },
            { id: 62, product_name: 'gouda ost' },
        ];

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockPromotions,
        });

        const result = await fetchPromotions(null);
        expect(result.length).toBe(2);
    });

    it('throws an error when the response is not ok', async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 404,
        });

        await expect(fetchPromotions(999)).rejects.toThrow('HTTP error! status: 404');
    });

    it('returns empty array when promotion id does not exist', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => [],
        });

        const result = await fetchPromotions(9999);
        expect(result).toEqual([]);
    });
});