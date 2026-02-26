export interface SuitabilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: 'adult' | 'child' | 'senior' | null;
    reasons: string[];
}
