import { ButtonFilm } from "../components/button_film";
import { ButtonSerie } from "../components/button_serie";
import { ButtonLivre } from "../components/button_livre";
import { ButtonJeux } from "../components/button_jeux";
import { SearchBar } from "../components/search_bar";
import { ButtonLog } from "../components/button_log";
import { Logo } from "../components/logo";

export function HomePage() {
    return (
        
        <div className="relative">
            <div className="fixed inset-x-0 top-0 z-40 bg-transparent">
                <header className="w-full max-w-6xl mx-auto flex justify-between items-center p-4">
                    <Logo />
                   
                    
                <div className="flex items-center gap-3">
                    <ButtonFilm onClick={() => console.log("Film clicked")} />
                    <ButtonSerie onClick={() => console.log("Série clicked")} />
                    <ButtonLivre onClick={() => console.log("Livre clicked")} />
                    <ButtonJeux onClick={() => console.log("Jeux clicked")} />
                        <SearchBar />
                </div>
                 <div className="flex items-center gap-3">
                        <ButtonLog />
                    </div>
                </header>
            </div>

            <main className="pt-20 w-full max-w-2xl mx-auto p-4">
                
            </main>
        </div>
    );
}