'use client'

import { Button } from "@/components/ui/button"
import { uploadProof } from "./actions"
import { useState, useTransition } from "react"
import { Camera, Loader2, UploadCloud, RefreshCw } from "lucide-react"

export function ProofUploader({ goalId, category }: { goalId: string, category: string }) {
    const [isPending, startTransition] = useTransition()
    const [feedback, setFeedback] = useState<{msg: string, success: boolean} | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
            setFeedback(null) // Reset feedback on new file
        }
    }

    const handleSubmit = (formData: FormData) => {
        if (!preview) {
             setFeedback({ msg: "Veuillez sélectionner une photo.", success: false })
             return
        }
        setFeedback(null)
        startTransition(async () => {
             const result = await uploadProof(formData)
             if (result.error) {
                 setFeedback({ msg: result.error, success: false })
             } else {
                 setFeedback({ 
                     msg: result.feedback || (result.success ? "Validé !" : "Rejeté"), 
                     success: !!result.success 
                 })
                 if (result.success) {
                    setPreview(null) // Clear preview on success
                 }
             }
        })
    }

    const getHelperText = () => {
        switch (category) {
            case 'sport': return "Prends en photo tes chaussures, ta salle ou ta montre connectée."
            case 'learning': return "Prends en photo la page que tu viens de lire ou le livre ouvert."
            case 'early_wake': return "Prends en photo ton heure de réveil ou ton petit-déjeuner."
            default: return "Prends en photo ton écran, ton carnet de notes ou ta To-Do list barrée."
        }
    }

    return (
        <form action={handleSubmit} className="w-full flex flex-col items-center gap-4">
             <div className="flex flex-col items-center gap-2 w-full">
                <input 
                    name="proofImage" 
                    id="proofImage" 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    onChange={handleFileChange}
                    required 
                />
                
                {preview ? (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-primary/20 shadow-inner group">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <label htmlFor="proofImage" className="cursor-pointer bg-white/20 hover:bg-white/40 backdrop-blur text-white p-3 rounded-full transition-colors">
                                <RefreshCw className="h-6 w-6" />
                             </label>
                        </div>
                        {/* Always visible small edit button */}
                         <label htmlFor="proofImage" className="absolute bottom-2 right-2 bg-black/60 text-white p-2 rounded-full cursor-pointer hover:bg-black/80 md:hidden">
                            <Camera className="h-4 w-4" />
                        </label>
                    </div>
                ) : (
                    <label htmlFor="proofImage" className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors active:scale-95 text-center p-4">
                        <Camera className="h-8 w-8 text-primary mb-2 opacity-50" />
                        <span className="text-sm font-medium text-primary">Prendre une photo</span>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[200px] leading-tight">{getHelperText()}</p>
                        <span className="text-[10px] text-muted-foreground/50 mt-1">(Tap ici)</span>
                    </label>
                )}
                
                <input type="hidden" name="goalId" value={goalId} />
             </div>

             {feedback && (
                 <div className={`p-4 rounded-lg text-sm text-center w-full animate-in fade-in slide-in-from-top-2 ${feedback.success ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                     <strong>{feedback.success ? "Succès :" : "Oups :"}</strong> {feedback.msg}
                 </div>
             )}

             <Button size="lg" className="w-full font-bold shadow-xl h-12" disabled={isPending || (feedback?.success)}>
                {isPending ? (
                    <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyse IA...
                    </>
                ) : (
                    <>
                     <UploadCloud className="mr-2 h-4 w-4" /> {feedback?.success ? "Validé !" : "Envoyer la preuve"}
                    </>
                )}
             </Button>
        </form>
    )
}
