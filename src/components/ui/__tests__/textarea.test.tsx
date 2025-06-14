import { render, screen } from '@testing-library/react';
import { Textarea } from '../textarea';
import { describe, it, expect } from 'vitest';

describe('Textarea', () => {
    it('renders textarea', () => {
        render(<Textarea placeholder="Yorum yaz" />);
        const textarea = screen.getByPlaceholderText('Yorum yaz');
        expect(textarea).toBeInTheDocument();
        expect(textarea).toHaveAttribute('data-slot', 'textarea');
    });

    it('applies custom className', () => {
        render(<Textarea className="custom-class" />);
        expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('handles disabled prop', () => {
        render(<Textarea disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });
});
