"use client"
import { useLocale } from "@/hooks/language/useLocale"

function HeroSection() {
    const t = useLocale();

    return (
        
        <section className="p-4rounded-lg shadow-md max-w-md mx-auto text-center">
            <h1 className="text-xl font-bold">{t.how_submit_hero_section_text}</h1>
            <hr 
                className="m-2"
            />
            <p className="text-x text-gray-300 whitespace-pre-line">
                {t.how_submit_hero_section_text_details}
            </p>
        </section>
    );
}


export default function HowSubmitGroupPage(){
    return (
        <main
            className="flex items-center justify-center m-32"
        >            
            
            <HeroSection />            
        </main>
    )
}