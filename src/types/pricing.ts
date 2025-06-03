export interface Plan {
    id: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: string[];
    isFeatured?: boolean;
}

export interface PricingProps {
    plans: Plan[];
}
