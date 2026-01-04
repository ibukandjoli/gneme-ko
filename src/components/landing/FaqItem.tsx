import { ChevronDown } from "lucide-react"

export function FaqItem({ question, answer }: { question: string, answer: string }) {
    return (
        <details className="group border border-white/5 rounded-xl bg-card open:bg-muted/5 transition-all duration-300">
            <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-medium">
                {question}
                <span className="transition-transform duration-300 group-open:rotate-180">
                    <ChevronDown className="h-5 w-5" />
                </span>
            </summary>
            <div className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed animate-accordion-down">
                {answer}
            </div>
        </details>
    )
}
