import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PainCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="bg-background/50 border-white/5 shadow-sm hover:border-primary/20 transition-colors duration-300">
            <CardHeader>
                <div className="mb-2 bg-muted/10 w-fit p-3 rounded-xl">{icon}</div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
