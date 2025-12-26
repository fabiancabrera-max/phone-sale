import { formatPrice, formatPriceARS, formatNumber } from '../formatters';

describe('formatters', () => {
    describe('formatPrice', () => {
        it('formats a number as USD currency correctly', () => {
            // Note: non-breaking spaces (\u00A0) might be used by Intl.NumberFormat
            const result = formatPrice(1299).replace(/\u00A0/g, ' ');
            expect(result).toMatch(/US\$ 1\.299|USD 1\.299|\$ 1\.299/);
        });

        it('handles zero correctly', () => {
            const result = formatPrice(0).replace(/\u00A0/g, ' ');
            expect(result).toMatch(/US\$ 0|USD 0|\$ 0/);
        });
    });

    describe('formatPriceARS', () => {
        it('formats a number as ARS currency correctly', () => {
            const result = formatPriceARS(1299).replace(/\u00A0/g, ' ');
            expect(result).toMatch(/\$ 1\.299|ARS 1\.299/);
        });
    });

    describe('formatNumber', () => {
        it('formats a number with thousand separators correctly', () => {
            expect(formatNumber(1299)).toBe('1.299');
            expect(formatNumber(1000000)).toBe('1.000.000');
        });

        it('handles small numbers correctly', () => {
            expect(formatNumber(123)).toBe('123');
        });
    });
});
