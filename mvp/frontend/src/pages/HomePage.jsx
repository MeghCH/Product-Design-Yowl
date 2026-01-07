import { ButtonFilm } from "../components/button_film";
import { ButtonSerie } from "../components/button_serie";
import { ButtonLivre } from "../components/button_livre";
import { ButtonJeux } from "../components/button_jeux";
import { SearchBar } from "../components/search_bar";
import { ButtonLog } from "../components/button_log";
import { Logo } from "../components/logo";

export function HomePage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <header className="w-full flex justify-between items-center mb-8">
                <Logo />
                <ButtonLog />
            </header>
            <main className="w-full max-w-2xl flex flex-col items-center">
                <SearchBar />
                <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                    <ButtonFilm onClick={() => console.log("Film clicked")} />
                    <ButtonSerie onClick={() => console.log("Série clicked")} />
                    <ButtonLivre onClick={() => console.log("Livre clicked")} />
                    <ButtonJeux onClick={() => console.log("Jeux clicked")} />
                </div>
            </main>
        </div>
    );
}