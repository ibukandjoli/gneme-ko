export function Step({ number, title, icon, desc }: { number: string, title: string, icon: React.ReactNode, desc: string }) {
    return (
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/5 border border-white/5 hover:border-primary/50 transition-colors duration-300 group">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/40 mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="font-bold text-lg mb-2"><span className="text-primary mr-2">{number}.</span>{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
    )
}
