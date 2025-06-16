export function getTicketStatusColor(
    status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'OPEN':
            return 'default';
        case 'IN_PROGRESS':
            return 'secondary';
        case 'WAITING_FOR_USER':
            return 'outline';
        case 'RESOLVED':
            return 'secondary';
        case 'CLOSED':
            return 'destructive';
        default:
            return 'default';
    }
}

export function getTicketPriorityColor(
    priority: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (priority) {
        case 'LOW':
            return 'default';
        case 'MEDIUM':
            return 'secondary';
        case 'HIGH':
            return 'outline';
        case 'URGENT':
            return 'destructive';
        default:
            return 'default';
    }
}

export function getTicketStatusText(status: string): string {
    switch (status) {
        case 'OPEN':
            return 'Açık';
        case 'IN_PROGRESS':
            return 'İşlemde';
        case 'WAITING_FOR_USER':
            return 'Kullanıcı Bekleniyor';
        case 'RESOLVED':
            return 'Çözüldü';
        case 'CLOSED':
            return 'Kapalı';
        default:
            return status;
    }
}

export function getTicketPriorityText(priority: string): string {
    switch (priority) {
        case 'LOW':
            return 'Düşük';
        case 'MEDIUM':
            return 'Orta';
        case 'HIGH':
            return 'Yüksek';
        case 'URGENT':
            return 'Acil';
        default:
            return priority;
    }
}

export function getTicketCategoryText(category: string): string {
    switch (category) {
        case 'TECHNICAL':
            return 'Teknik';
        case 'BILLING':
            return 'Fatura';
        case 'ACCOUNT':
            return 'Hesap';
        case 'GENERAL':
            return 'Genel';
        case 'FEATURE_REQUEST':
            return 'Özellik İsteği';
        case 'BUG_REPORT':
            return 'Hata Raporu';
        default:
            return category;
    }
}
