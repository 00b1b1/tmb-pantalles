import { Link } from 'react-router-dom'
import { X, Link2, Code, Settings, AlertCircle, Copy } from 'lucide-react'
import { useState } from 'react'
import { APP_TEXTS } from '../constants/texts'

export default function Documentation() {
    const [copiedParam, setCopiedParam] = useState<string | null>(null)

    const copyToClipboard = (text: string, param: string) => {
        navigator.clipboard.writeText(text)
        setCopiedParam(param)
        setTimeout(() => setCopiedParam(null), 2000)
    }

    return (
        <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
            {/* Fixed Header */}
            <div className="shrink-0 bg-background/95 backdrop-blur-sm border-b z-20">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Code className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">{APP_TEXTS.docs.title}</h1>
                    </div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 bg-muted/50 rounded-full hover:bg-muted"
                    >
                        <X className="w-4 h-4" />
                        <span>{APP_TEXTS.docs.close}</span>
                    </Link>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scroll-smooth">
                <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">

                    <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Code className="w-5 h-5 text-primary" />
                            {APP_TEXTS.docs.introTitle}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {APP_TEXTS.docs.introDesc}
                        </p>
                    </div>

                    {/* Quick Example */}
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-xl p-6 space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Link2 className="w-5 h-5 text-primary" />
                            Exemple Ràpid
                        </h2>
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Prova aquest enllaç d'exemple:
                            </p>
                            <div className="bg-background/80 p-4 rounded-lg border font-mono text-xs break-all relative group">
                                <code className="text-primary">
                                    {window.location.origin}/?line=L4&station=428&direction=1&alerts=true
                                </code>
                                <button
                                    onClick={() => copyToClipboard(`${window.location.origin}/?line=L4&station=428&direction=1&alerts=true`, 'example')}
                                    className="absolute top-2 right-2 p-2 bg-background rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                                    title="Copiar"
                                >
                                    {copiedParam === 'example' ? '✓' : <Copy className="w-3 h-3" />}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                ☝️ Aquest enllaç mostra la L4 a l'estació Joanic (428) en direcció 1 amb alertes activades
                            </p>
                        </div>
                    </div>

                    {/* Parameters */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" />
                            Paràmetres Disponibles
                        </h2>

                        <div className="space-y-4">
                            {/* Required Parameters */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Paràmetres Obligatoris</h3>
                                <div className="space-y-3">
                                    <ParamCard
                                        name="line"
                                        type="string"
                                        required
                                        description="Nom de la línia de metro"
                                        example="L4"
                                        values="L1, L2, L3, L4, L5, L9N, L9S, L10N, L10S, L11, FM"
                                        onCopy={copyToClipboard}
                                        copiedParam={copiedParam}
                                    />
                                    <ParamCard
                                        name="station"
                                        type="number"
                                        required
                                        description="Codi de l'estació"
                                        example="428"
                                        values="Consulta els codis a l'API de TMB"
                                        onCopy={copyToClipboard}
                                        copiedParam={copiedParam}
                                    />
                                    <ParamCard
                                        name="direction"
                                        type="number"
                                        required
                                        description="Sentit de la línia"
                                        example="1"
                                        values="1 o 2"
                                        onCopy={copyToClipboard}
                                        copiedParam={copiedParam}
                                    />
                                </div>
                            </div>

                            {/* Optional Parameters */}
                            <div className="pt-4 border-t">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Paràmetres Opcionals</h3>
                                <div className="space-y-3">
                                    <ParamCard
                                        name="alerts"
                                        type="boolean"
                                        description="Activar sistema d'alertes"
                                        example="true"
                                        defaultValue="false"
                                        onCopy={copyToClipboard}
                                        copiedParam={copiedParam}
                                    />
                                    <ParamCard
                                        name="emergency"
                                        type="boolean"
                                        description="Mostrar avís d'ajuda d'interfons"
                                        example="false"
                                        defaultValue="true"
                                        onCopy={copyToClipboard}
                                        copiedParam={copiedParam}
                                    />
                                    <ParamCard
                                        name="hideConfig"
                                        type="boolean"
                                        description="Ocultar botó de configuració"
                                        example="true"
                                        defaultValue="false"
                                        onCopy={copyToClipboard}
                                        copiedParam={copiedParam}
                                    />
                                    <ParamCard
                                        name="alertIds"
                                        type="string"
                                        description="IDs d'alertes oficials (separats per comes)"
                                        example="123,456,789"
                                        onCopy={copyToClipboard}
                                        copiedParam={copiedParam}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* URL Examples */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Link2 className="w-5 h-5 text-primary" />
                            Exemples d'URL
                        </h2>
                        <div className="space-y-4">
                            <UrlExample
                                title="Panell bàsic"
                                url="?line=L1&station=100&direction=1"
                                description="L1 a l'estació 100, direcció 1"
                                onCopy={copyToClipboard}
                                copiedParam={copiedParam}
                            />
                            <UrlExample
                                title="Amb alertes"
                                url="?line=L3&station=200&direction=2&alerts=true"
                                description="L3 amb sistema d'alertes activat"
                                onCopy={copyToClipboard}
                                copiedParam={copiedParam}
                            />
                            <UrlExample
                                title="Pantalla pública"
                                url="?line=L5&station=300&direction=1&hideConfig=true"
                                description="L5 sense botó de configuració (ideal per pantalles públiques)"
                                onCopy={copyToClipboard}
                                copiedParam={copiedParam}
                            />
                        </div>
                    </div>

                    {/* Integration */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            Integració en Llocs Web
                        </h2>
                        <div className="space-y-3">
                            <p className="text-muted-foreground text-sm">
                                Pots integrar el panell en el teu lloc web utilitzant un iframe:
                            </p>
                            <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs border overflow-x-auto relative group">
                                <pre className="text-foreground">{`<iframe 
  src="${window.location.origin}/?line=L4&station=428&direction=1" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="fullscreen"
></iframe>`}</pre>
                                <button
                                    onClick={() => copyToClipboard(`<iframe src="${window.location.origin}/?line=L4&station=428&direction=1" width="100%" height="600" frameborder="0" allow="fullscreen"></iframe>`, 'iframe')}
                                    className="absolute top-2 right-2 p-2 bg-background rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                                    title="Copiar"
                                >
                                    {copiedParam === 'iframe' ? '✓' : <Copy className="w-3 h-3" />}
                                </button>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                    💡 <strong>Consell:</strong> Afegeix <code className="bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded text-xs">hideConfig=true</code> per ocultar el botó de configuració en integracions públiques.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-8 pb-4 space-y-3">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                        >
                            ← Tornar al panell
                        </Link>
                        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                            <Link to="/credits" className="hover:text-foreground transition-colors">
                                Crèdits
                            </Link>
                            <span>•</span>
                            <a href="https://developer.tmb.cat/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                TMB Open Data
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Helper Components
interface ParamCardProps {
    name: string;
    type: string;
    required?: boolean;
    description: string;
    example: string;
    values?: string;
    defaultValue?: string;
    onCopy: (text: string, param: string) => void;
    copiedParam: string | null;
}

function ParamCard({ name, type, required, description, example, values, defaultValue, onCopy, copiedParam }: ParamCardProps) {
    return (
        <div className="bg-muted/30 rounded-lg p-4 border border-border/50 hover:border-primary/30 transition-colors group">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-bold text-primary">{name}</code>
                        <span className="text-xs text-muted-foreground">({type})</span>
                        {required && <span className="text-xs bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded">obligatori</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Exemple:</span>
                        <code className="bg-background px-2 py-1 rounded border font-mono">{name}={example}</code>
                        <button
                            onClick={() => onCopy(`${name}=${example}`, name)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-background rounded"
                            title="Copiar"
                        >
                            {copiedParam === name ? '✓' : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                    {values && (
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">Valors:</span> {values}
                        </p>
                    )}
                    {defaultValue && (
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">Per defecte:</span> {defaultValue}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

interface UrlExampleProps {
    title: string;
    url: string;
    description: string;
    onCopy: (text: string, param: string) => void;
    copiedParam: string | null;
}

function UrlExample({ title, url, description, onCopy, copiedParam }: UrlExampleProps) {
    const fullUrl = `${window.location.origin}/${url}`;
    const paramId = `url-${title}`;

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-semibold">{title}</h3>
            <div className="bg-muted/50 p-3 rounded-lg border font-mono text-xs break-all relative group">
                <code className="text-primary">{fullUrl}</code>
                <button
                    onClick={() => onCopy(fullUrl, paramId)}
                    className="absolute top-2 right-2 p-1.5 bg-background rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                    title="Copiar"
                >
                    {copiedParam === paramId ? '✓' : <Copy className="w-3 h-3" />}
                </button>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    )
}
