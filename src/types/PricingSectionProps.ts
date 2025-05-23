interface PlanDetail {
    id: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: string[];
    isFeatured?: boolean;
}

interface PricingSectionProps {
    plansConfig: PlanDetail[];
}

export type { PricingSectionProps, PlanDetail };
