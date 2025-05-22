import { render, screen } from '@testing-library/react';
import { Switch } from '../switch';

describe('Switch', () => {
    it('renders switch', () => {
        render(<Switch />);
        const switchEl = screen.getByRole('switch');
        expect(switchEl).toBeInTheDocument();
        expect(switchEl).toHaveAttribute('data-slot', 'switch');
    });

    it('applies custom className', () => {
        render(<Switch className="custom-class" />);
        expect(screen.getByRole('switch')).toHaveClass('custom-class');
    });

    it('handles disabled prop', () => {
        render(<Switch disabled />);
        expect(screen.getByRole('switch')).toBeDisabled();
    });
});
