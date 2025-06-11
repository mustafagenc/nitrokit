import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../pagination';
import { describe, it, expect, vi } from 'vitest';

describe('Pagination', () => {
    it('renders pagination component', () => {
        render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            1
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );

        expect(screen.getByRole('navigation')).toBeInTheDocument();
        expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
        expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('applies active state to current page', () => {
        render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            1
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );

        const activeLink = screen.getByText('1');
        expect(activeLink).toHaveAttribute('aria-current', 'page');
    });

    it('handles click events on pagination links', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink href="#" onClick={handleClick}>
                            1
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );

        await user.click(screen.getByText('1'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders ellipsis with correct accessibility attributes', () => {
        render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );

        const ellipsis = screen.getByText('More pages').parentElement;
        expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByText('More pages')).toBeInTheDocument();
    });
});
