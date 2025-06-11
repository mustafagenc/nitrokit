import { render, screen } from '@testing-library/react';
import { Label } from '../label';
import { describe, it, expect } from 'vitest';

describe('Label', () => {
    it('renders label', () => {
        render(<Label htmlFor="test-input">Etiket</Label>);
        const label = screen.getByText('Etiket');
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute('data-slot', 'label');
        expect(label).toHaveAttribute('for', 'test-input');
    });

    it('applies custom className', () => {
        render(<Label className="custom-class">Label</Label>);
        expect(screen.getByText('Label')).toHaveClass('custom-class');
    });
});
