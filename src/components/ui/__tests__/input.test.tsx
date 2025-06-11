import { render, screen } from '@testing-library/react';
import { Input } from '../input';
import { describe, it, expect } from 'vitest';

describe('Input', () => {
    it('renders input', () => {
        render(<Input placeholder="Adınız" />);
        const input = screen.getByPlaceholderText('Adınız');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('data-slot', 'input');
    });

    it('applies custom className', () => {
        render(<Input className="custom-class" />);
        expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('handles disabled prop', () => {
        render(<Input disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });
});
