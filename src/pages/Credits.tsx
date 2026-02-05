import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { APP_TEXTS } from '../constants/texts'

export default function Credits() {
    return (
        <div className="h-screen w-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="max-w-lg w-full flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
                {/* Header Compacto con botón de cerrar */}
                <div className="flex items-center justify-between px-1">
                    <h1 className="text-2xl font-bold tracking-tight">{APP_TEXTS.configurator.credits.split(' ')[0]}</h1>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1 bg-muted/50 rounded-full hover:bg-muted"
                    >
                        <X className="w-4 h-4" />
                        <span>{APP_TEXTS.docs.close}</span>
                    </Link>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-lg flex flex-col gap-6">

                    {/* Sección Legal Compacta */}
                    <section className="space-y-3">
                        <h2 className="text-base font-semibold flex items-center gap-2 text-foreground">
                            ⚠️ Avís Legal
                        </h2>
                        <div className="p-3 bg-muted/30 rounded-lg border border-border/50 text-xs space-y-2 text-muted-foreground/90 leading-relaxed">
                            <p>
                                <span className="font-semibold text-primary">Aplicació NO oficial.</span> Aquesta eina no té cap vincle, afiliació ni autorització per part de Transports Metropolitans de Barcelona (TMB) ni l'ATM.
                            </p>
                            <p>
                                Els noms, logotips i marques de TMB són propietat dels seus respectius titulars.
                            </p>
                        </div>
                    </section>

                    {/* Dades */}
                    <section className="space-y-2">
                        <h2 className="text-base font-semibold flex items-center gap-2 text-foreground">
                            📊 Dades Obertes
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Informació de temps real proporcionada públicament a través del portal <a href="https://developer.tmb.cat/" className="underline decoration-dotted hover:decoration-solid hover:text-primary">TMB Open Data</a>.
                        </p>
                    </section>

                    <div className="h-px bg-border/50" />

                    {/* Contacte & Footer */}
                    <div className="space-y-4 pt-1">
                        <div className="flex items-center justify-center gap-6">
                            {/* Mail */}
                            <a href="mailto:hola@b1b1.es" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                <span className="text-lg group-hover:scale-110 transition-transform">✉️</span>
                                <span className="group-hover:underline decoration-wavy decoration-muted-foreground/30">hola@b1b1.es</span>
                            </a>

                            {/* X / Twitter */}
                            <a href="https://x.com/b_1__b_1" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <span className="group-hover:underline decoration-wavy decoration-muted-foreground/30">@b_1__b_1</span>
                            </a>
                        </div>

                        <p className="text-[11px] text-center text-muted-foreground/60">
                            Fet per <a href="https://b1b1.es" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Ahmed Bibi</a> amb ❤️ per a Barcelona
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
