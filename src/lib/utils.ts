import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCommitment(title: string, duration: number, amount: number) {
    // Basic heuristic: check if title starts with a verb? No, too hard.
    // Just blindly follow the template or make it slightly generic.
    // User requested: "Je vais [titre] pendant [durée] jours sinon je perds [montant]"

    // Clean title first (lowercase start unless proper noun?) - simplistic approach
    let cleanTitle = title.trim();
    if (cleanTitle.length > 0) {
        cleanTitle = cleanTitle.charAt(0).toLowerCase() + cleanTitle.slice(1);
    }

    return `Je vais ${cleanTitle} pendant ${duration} jours, sinon je perds ${amount.toLocaleString('fr-FR')} FCFA.`;
}
