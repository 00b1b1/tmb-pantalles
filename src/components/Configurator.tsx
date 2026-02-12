import { useState, useEffect } from 'react'
import { fetchAllLines, fetchLineStations, fetchLineAlerts } from '../services/tmbApi'
import type { LineProperties, StationProperties, TMBAlert, CustomAlert } from '../types/tmb'
import { Link } from 'react-router-dom'
import { Settings, Info, Trash2, X, Link2, Check, FileText } from 'lucide-react'
import { Select } from './ui/select'
import { generateShareableUrl } from '../utils/urlGenerator'
import { APP_TEXTS } from '../constants/texts'

interface ConfiguratorProps {
    onConfigChange: (config: {
        lineCode: number;
        lineName: string;
        lineColor: string;
        lineTextColor: string;
        stationCode: number;
        stationName: string;
        directionId: number;
        destinationName: string;
        showAlert: boolean;
        showEmergencyAlert: boolean;
        activeAlertIds: number[];
        customAlerts: CustomAlert[];
        hideConfigButton?: boolean;
    }) => void;
    currentConfig: {
        lineCode: number;
        lineName: string;
        lineColor: string;
        lineTextColor: string;
        stationCode: number;
        stationName: string;
        directionId: number;
        destinationName: string;
        showAlert: boolean;
        showEmergencyAlert: boolean;
        activeAlertIds: number[];
        customAlerts: CustomAlert[];
        hideConfigButton?: boolean;
    };
}

const TRANSPORT_ICONS = [
    'FGC.svg', 'S1.svg', 'S2.svg',
    'RODALIES.svg', 'R1.svg', 'R2.svg', 'R3.svg', 'R4.svg', 'R7.svg', 'R8.svg',
    'TRAM.svg', 'T1.svg', 'T2.svg', 'T3.svg',
    'L1.svg', 'L2.svg', 'L3.svg', 'L4.svg', 'L5.svg', 'L9N.svg', 'L9S.svg', 'L10N.svg', 'L10S.svg', 'L11.svg', 'FM.svg'
];

const getAlertText = (alert: TMBAlert) => {
    const publication = alert.publications[0]
    if (!publication) return ''

    const rawText = publication.textCa || publication.textEs || publication.textEn || ''
    if (!rawText) return ''

    let cleaned = rawText.replace(/<[^>]*>?/gm, '')
    cleaned = cleaned.replace(/https?:\/\/(www\.)?tmb\.cat[^\s]*/g, 'tmb.cat')
    return cleaned.trim()
}

export default function Configurator({ onConfigChange, currentConfig }: ConfiguratorProps) {
    const [lines, setLines] = useState<LineProperties[]>([])
    const [stations, setStations] = useState<StationProperties[]>([])
    const [alerts, setAlerts] = useState<TMBAlert[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedAlertDetails, setSelectedAlertDetails] = useState<TMBAlert | null>(null)
    const [isEditingCustom, setIsEditingCustom] = useState<Partial<CustomAlert> | null>(null)
    const [generatedUrl, setGeneratedUrl] = useState<string>('')
    const [urlCopied, setUrlCopied] = useState(false)

    // Listen for 'c' key to toggle settings even if button is hidden
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Fetch alerts for current line
    useEffect(() => {
        const loadAlerts = async () => {
            if (currentConfig.lineName) {
                try {
                    const response = await fetchLineAlerts(currentConfig.lineName)
                    if (response.status === 'success') {
                        setAlerts(response.data.alerts)
                    }
                } catch (error) {
                    console.error('Error loading alerts:', error)
                }
            }
        }
        loadAlerts()
    }, [currentConfig.lineName])

    // Fetch all lines on mount
    useEffect(() => {
        const loadLines = async () => {
            try {
                setLoading(true)
                const response = await fetchAllLines()
                const metroLines = response.features
                    .map(f => f.properties)
                    .filter(l => l.NOM_TIPUS_TRANSPORT === 'METRO')
                setLines(metroLines)
            } catch (error) {
                console.error('Error loading lines:', error)
            } finally {
                setLoading(false)
            }
        }
        loadLines()
    }, [])

    // Fetch stations when line changes
    useEffect(() => {
        const loadStations = async () => {
            if (currentConfig.lineCode) {
                try {
                    const response = await fetchLineStations(currentConfig.lineCode)
                    setStations(response.features.map(f => f.properties))
                } catch (error) {
                    console.error('Error loading stations:', error)
                }
            }
        }
        loadStations()
    }, [currentConfig.lineCode])

    const handleLineChange = (lineCode: number) => {
        const line = lines.find(l => l.CODI_LINIA === lineCode)
        if (line) {
            onConfigChange({
                ...currentConfig,
                lineCode: line.CODI_LINIA,
                lineName: line.NOM_LINIA,
                lineColor: line.COLOR_LINIA,
                lineTextColor: line.COLOR_TEXT_LINIA,
                stationCode: 0,
                stationName: '',
                destinationName: ''
            })
        }
    }

    const handleStationChange = (selectedCode: number) => {
        const line = lines.find(l => l.CODI_LINIA === currentConfig.lineCode)
        const isSpecialLine = line && ['L9N', 'L9S', 'L10N', 'L10S'].includes(line.NOM_LINIA)
        const station = stations.find(s => isSpecialLine ? s.ID_GRUP_ESTACIO === selectedCode : s.CODI_ESTACIO_LINIA === selectedCode)

        if (station && line) {
            onConfigChange({
                ...currentConfig,
                stationCode: isSpecialLine ? station.ID_GRUP_ESTACIO : station.CODI_ESTACIO_LINIA,
                stationName: station.NOM_ESTACIO,
                destinationName: currentConfig.directionId === 1 ? station.DESTI_SERVEI : station.ORIGEN_SERVEI
            })
        }
    }

    const handleDirectionChange = (directionId: number) => {
        const line = lines.find(l => l.CODI_LINIA === currentConfig.lineCode)
        const isSpecialLine = line && ['L9N', 'L9S', 'L10N', 'L10S'].includes(line.NOM_LINIA)
        const station = stations.find(s => isSpecialLine ? s.ID_GRUP_ESTACIO === currentConfig.stationCode : s.CODI_ESTACIO_LINIA === currentConfig.stationCode)

        if (station && line) {
            onConfigChange({
                ...currentConfig,
                directionId: directionId,
                destinationName: directionId === 1 ? station.DESTI_SERVEI : station.ORIGEN_SERVEI
            })
        }
    }

    const handleAlertToggle = (enabled: boolean) => {
        onConfigChange({
            ...currentConfig,
            showAlert: enabled,
            activeAlertIds: enabled ? (currentConfig.activeAlertIds.length > 0 ? currentConfig.activeAlertIds : alerts.map(a => a.id)) : currentConfig.activeAlertIds
        })
    }

    const handleAlertItemToggle = (alertId: number) => {
        const isSelected = currentConfig.activeAlertIds.includes(alertId)
        const nextIds = isSelected
            ? currentConfig.activeAlertIds.filter(id => id !== alertId)
            : [...currentConfig.activeAlertIds, alertId]
        onConfigChange({ ...currentConfig, activeAlertIds: nextIds })
    }

    const handleAddCustomAlert = () => {
        setIsEditingCustom({
            id: Date.now().toString(),
            title: 'Nova Alerta',
            content: APP_TEXTS.configurator.customAlerts,
            bgColor: '#FFE501',
            textColor: '#000000',
            headerColor: '#000000',
            iconName: 'FGC.svg',
            isActive: true
        })
    }

    const handleSaveCustomAlert = () => {
        if (!isEditingCustom) return
        const updatedAlerts = [...currentConfig.customAlerts]
        const index = updatedAlerts.findIndex(a => a.id === isEditingCustom.id)

        if (index > -1) {
            updatedAlerts[index] = isEditingCustom as CustomAlert
        } else {
            updatedAlerts.push(isEditingCustom as CustomAlert)
        }

        onConfigChange({ ...currentConfig, customAlerts: updatedAlerts })
        setIsEditingCustom(null)
    }

    const handleDeleteCustomAlert = (id: string) => {
        const updatedAlerts = currentConfig.customAlerts.filter(a => a.id !== id)
        onConfigChange({ ...currentConfig, customAlerts: updatedAlerts })
    }

    const handleToggleCustomAlert = (id: string) => {
        const updatedAlerts = currentConfig.customAlerts.map(a =>
            a.id === id ? { ...a, isActive: !a.isActive } : a
        )
        onConfigChange({ ...currentConfig, customAlerts: updatedAlerts })
    }

    return (
        <>
            {!currentConfig.hideConfigButton && (
                <button
                    className="fixed top-6 right-6 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Obrir configuració"
                >
                    <Settings className="w-6 h-6" />
                </button>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`
                    fixed top-0 right-0 h-full w-[450px] bg-background z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="h-full bg-background border-l shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center bg-card shrink-0">
                        <h2 className="text-xl font-bold">{APP_TEXTS.configurator.title}</h2>
                        <button
                            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto space-y-8">
                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner">
                                    <svg width="40" height="40  " viewBox="0 0 100 100">
                                        <g>
                                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                                                <circle key={i} cx="50" cy="15" r="6" fill="#000" opacity={1 - (i * 0.12)} transform={`rotate(${angle} 50 50)`} />
                                            ))}
                                            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="2s" repeatCount="indefinite" />

                                        </g>
                                    </svg>
                                </div>
                                <p className="text-muted-foreground text-center">{APP_TEXTS.configurator.loading}</p>
                            </div>


                        ) : (
                            <>
                                {/* Selection Section */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{APP_TEXTS.configurator.lineAndStation}</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="relative">
                                                {currentConfig.lineName && (
                                                    <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
                                                        <img
                                                            src={`/lineas/icons/${currentConfig.lineName}.svg`}
                                                            alt={currentConfig.lineName}
                                                            className="w-6 h-6 object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <Select
                                                    className="h-10 pl-10"
                                                    value={currentConfig.lineCode}
                                                    onChange={(e) => handleLineChange(Number(e.target.value))}
                                                >
                                                    {lines.map(line => (
                                                        <option key={line.CODI_LINIA} value={line.CODI_LINIA}>
                                                            {line.NOM_LINIA}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="relative">
                                                {currentConfig.lineName && (
                                                    <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
                                                        <img
                                                            src={`/lineas/icons/${currentConfig.lineName}.svg`}
                                                            alt={currentConfig.lineName}
                                                            className="w-6 h-6 object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <Select
                                                    className="h-10 pl-10"
                                                    value={currentConfig.stationCode}
                                                    onChange={(e) => handleStationChange(Number(e.target.value))}
                                                >
                                                    <option value={0}>{APP_TEXTS.configurator.selectStation}</option>
                                                    {stations.map(station => {
                                                        const line = lines.find(l => l.CODI_LINIA === currentConfig.lineCode)
                                                        const isSpecial = line && ['L9N', 'L9S', 'L10N', 'L10S'].includes(line.NOM_LINIA)
                                                        const value = isSpecial ? station.ID_GRUP_ESTACIO : station.CODI_ESTACIO_LINIA
                                                        return (
                                                            <option key={station.CODI_ESTACIO_LINIA} value={value}>
                                                                {station.NOM_ESTACIO}
                                                            </option>
                                                        )
                                                    })}
                                                </Select>
                                            </div>
                                        </div>
                                        <Select
                                            className="w-full h-10"
                                            value={currentConfig.directionId}
                                            onChange={(e) => handleDirectionChange(Number(e.target.value))}
                                        >
                                            <option value={1}>
                                                {APP_TEXTS.configurator.directionSense} {stations.find(s => (lines.find(l => l.CODI_LINIA === currentConfig.lineCode)?.NOM_LINIA.includes('L9') || lines.find(l => l.CODI_LINIA === currentConfig.lineCode)?.NOM_LINIA.includes('L10')) ? s.ID_GRUP_ESTACIO === currentConfig.stationCode : s.CODI_ESTACIO_LINIA === currentConfig.stationCode)?.DESTI_SERVEI}
                                            </option>
                                            <option value={2}>
                                                {APP_TEXTS.configurator.directionSense} {stations.find(s => (lines.find(l => l.CODI_LINIA === currentConfig.lineCode)?.NOM_LINIA.includes('L9') || lines.find(l => l.CODI_LINIA === currentConfig.lineCode)?.NOM_LINIA.includes('L10')) ? s.ID_GRUP_ESTACIO === currentConfig.stationCode : s.CODI_ESTACIO_LINIA === currentConfig.stationCode)?.ORIGEN_SERVEI}
                                            </option>
                                        </Select>
                                    </div>
                                </div>

                                {/* Alerts Section */}
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{APP_TEXTS.configurator.alertsSystem}</label>
                                        <button
                                            onClick={() => handleAlertToggle(!currentConfig.showAlert)}
                                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${currentConfig.showAlert ? 'bg-primary' : 'bg-muted'}`}
                                        >
                                            <span className={`block h-5 w-5 rounded-full bg-background shadow-lg transition-transform ${currentConfig.showAlert ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    {currentConfig.showAlert && (
                                        <div className="space-y-6">
                                            {/* Official Alerts */}
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium text-muted-foreground mb-2">{APP_TEXTS.configurator.officialAlerts}</p>
                                                <div
                                                    onClick={() => onConfigChange({ ...currentConfig, showEmergencyAlert: !currentConfig.showEmergencyAlert })}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${currentConfig.showEmergencyAlert ? 'border-red-500 bg-red-50/50' : 'border-border bg-card'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${currentConfig.showEmergencyAlert ? 'bg-red-500 border-red-500' : 'border-muted-foreground'}`}>
                                                        {currentConfig.showEmergencyAlert && <span className="text-[10px] text-white">✓</span>}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium">{APP_TEXTS.configurator.emergencyAlertLabel}</p>
                                                    </div>
                                                </div>

                                                {alerts.map(alert => (
                                                    <div
                                                        key={alert.id}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${currentConfig.activeAlertIds.includes(alert.id) ? 'border-primary bg-muted/50' : 'border-border bg-card'}`}
                                                    >
                                                        <div className="flex-shrink-0" onClick={() => handleAlertItemToggle(alert.id)}>
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${currentConfig.activeAlertIds.includes(alert.id) ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                                                                {currentConfig.activeAlertIds.includes(alert.id) && <span className="text-[10px] text-white">✓</span>}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0" onClick={() => handleAlertItemToggle(alert.id)}>
                                                            <p className="text-sm font-medium truncate">{alert.publications[0]?.headerCa.replace(/^[A-Z]{2}\d+\s*/, '')}</p>
                                                            <p className="text-[10px] text-muted-foreground">Fins: {alert.publications[0]?.end_date ? new Date(alert.publications[0].end_date).toLocaleDateString() : 'Indefinida'}</p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSelectedAlertDetails(alert); }}
                                                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                                                        >
                                                            <Info className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Custom Alerts */}
                                            <div className="space-y-4 pt-4 border-t">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-medium text-muted-foreground">{APP_TEXTS.configurator.customAlerts}</p>
                                                    <button
                                                        onClick={handleAddCustomAlert}
                                                        className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:opacity-90 transition-opacity"
                                                    >
                                                        + Afegir Nova
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    {currentConfig.customAlerts.map(alert => (
                                                        <div
                                                            key={alert.id}
                                                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${alert.isActive ? 'border-primary bg-muted/50' : 'border-border bg-card'}`}
                                                            style={alert.isActive ? { borderLeft: `4px solid ${alert.bgColor}` } : {}}
                                                        >
                                                            <div className="flex-shrink-0 cursor-pointer" onClick={() => handleToggleCustomAlert(alert.id)}>
                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${alert.isActive ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                                                                    {alert.isActive && <span className="text-[10px] text-white">✓</span>}
                                                                </div>
                                                            </div>
                                                            <div className="w-8 h-8 flex-shrink-0 bg-white rounded border flex items-center justify-center">
                                                                <img
                                                                    src={`/transport-icons/${alert.iconName}`}
                                                                    alt=""
                                                                    className="w-6 h-6 object-contain"
                                                                    onError={(e) => { (e.target as HTMLImageElement).src = `/lineas/icons/${alert.iconName}` }}
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsEditingCustom(alert)}>
                                                                <p className="text-sm font-medium truncate">{alert.title}</p>
                                                                <p className="text-[10px] text-muted-foreground truncate">{alert.content}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteCustomAlert(alert.id)}
                                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* API Link Generator */}
                                <div className="space-y-4 pt-4 border-t">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{APP_TEXTS.configurator.shareTitle}</label>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => {
                                                const url = generateShareableUrl({
                                                    lineCode: currentConfig.lineCode,
                                                    lineName: currentConfig.lineName,
                                                    stationCode: currentConfig.stationCode,
                                                    directionId: currentConfig.directionId,
                                                    showAlert: currentConfig.showAlert,
                                                    showEmergencyAlert: currentConfig.showEmergencyAlert,
                                                    activeAlertIds: currentConfig.activeAlertIds,
                                                    customAlerts: currentConfig.customAlerts,
                                                    hideConfigButton: currentConfig.hideConfigButton
                                                });
                                                setGeneratedUrl(url);
                                            }}
                                            className="w-full py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                        >
                                            <Link2 className="w-4 h-4" />
                                            {APP_TEXTS.configurator.generateLink}
                                        </button>

                                        {generatedUrl && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="bg-muted/50 p-3 rounded-lg border">
                                                    <p className="text-xs font-mono break-all text-muted-foreground">{generatedUrl}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(generatedUrl);
                                                        setUrlCopied(true);
                                                        setTimeout(() => setUrlCopied(false), 2000);
                                                    }}
                                                    className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center gap-2"
                                                >
                                                    {urlCopied ? (
                                                        <>
                                                            <Check className="w-4 h-4" />
                                                            {APP_TEXTS.configurator.copied}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Link2 className="w-4 h-4" />
                                                            {APP_TEXTS.configurator.copyLink}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Utilities */}
                                <div className="space-y-4 pt-4 border-t">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{APP_TEXTS.configurator.options}</label>
                                    <button
                                        onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()}
                                        className="w-full py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium"
                                    >
                                        {APP_TEXTS.configurator.fullScreen}
                                    </button>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <label className="text-sm font-medium">{APP_TEXTS.configurator.hideConfigLabel}</label>
                                            <p className="text-[10px] text-muted-foreground">{APP_TEXTS.configurator.configShortcut}</p>
                                        </div>
                                        <button
                                            onClick={() => onConfigChange({ ...currentConfig, hideConfigButton: !currentConfig.hideConfigButton })}
                                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${currentConfig.hideConfigButton ? 'bg-primary' : 'bg-muted'}`}
                                        >
                                            <span className={`block h-5 w-5 rounded-full bg-background shadow-lg transition-transform ${currentConfig.hideConfigButton ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Edit Custom Alert Modal */}
                    {isEditingCustom && (
                        <div className="absolute inset-0 bg-background z-[60] flex flex-col animation-fade-in pt-[64px]">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="font-bold">{APP_TEXTS.configurator.editCustomAlert}</h3>
                                <button onClick={() => setIsEditingCustom(null)}>
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Títol</label>
                                    <input
                                        type="text"
                                        className="w-full h-10 px-3 border rounded-md text-sm"
                                        value={isEditingCustom.title}
                                        onChange={(e) => setIsEditingCustom({ ...isEditingCustom, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Contingut</label>
                                    <textarea
                                        className="w-full h-24 p-3 border rounded-md text-sm resize-none"
                                        value={isEditingCustom.content}
                                        onChange={(e) => setIsEditingCustom({ ...isEditingCustom, content: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Color Fons</label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                className="w-10 h-10 border-0 p-0 bg-transparent cursor-pointer"
                                                value={isEditingCustom.bgColor}
                                                onChange={(e) => setIsEditingCustom({ ...isEditingCustom, bgColor: e.target.value })}
                                            />
                                            <span className="text-xs font-mono">{isEditingCustom.bgColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Color Text</label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                className="w-10 h-10 border-0 p-0 bg-transparent cursor-pointer"
                                                value={isEditingCustom.textColor}
                                                onChange={(e) => setIsEditingCustom({ ...isEditingCustom, textColor: e.target.value })}
                                            />
                                            <span className="text-xs font-mono">{isEditingCustom.textColor}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Color Capçalera</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="color"
                                            className="w-10 h-10 border-0 p-0 bg-transparent cursor-pointer"
                                            value={isEditingCustom.headerColor}
                                            onChange={(e) => setIsEditingCustom({ ...isEditingCustom, headerColor: e.target.value })}
                                        />
                                        <span className="text-xs font-mono">{isEditingCustom.headerColor}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Icona de Transport</label>
                                    <div className="grid grid-cols-5 gap-2 border p-3 rounded-md bg-muted/30">
                                        {TRANSPORT_ICONS.map(icon => (
                                            <button
                                                key={icon}
                                                onClick={() => setIsEditingCustom({ ...isEditingCustom, iconName: icon })}
                                                className={`p-2 rounded flex items-center justify-center transition-all ${isEditingCustom.iconName === icon ? 'bg-primary border-primary' : 'bg-white hover:bg-muted border'}`}
                                            >
                                                <img
                                                    src={icon.startsWith('L') || icon === 'FM.svg' ? `/lineas/icons/${icon}` : `/transport-icons/${icon}`}
                                                    alt=""
                                                    className="w-8 h-8 object-contain"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t bg-card">
                                <button
                                    onClick={handleSaveCustomAlert}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold"
                                >
                                    {APP_TEXTS.configurator.save}
                                </button>
                                <button
                                    onClick={() => setIsEditingCustom(null)}
                                    className="w-full py-3 mt-2 border rounded-lg font-medium"
                                >
                                    {APP_TEXTS.configurator.cancel}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Official Alert Details View (Keep existing) */}
                    {selectedAlertDetails && (
                        <div className="absolute inset-0 bg-background z-[60] flex flex-col animation-fade-in pt-[64px]">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="font-bold">{APP_TEXTS.configurator.officialAlertDetails}</h3>
                                <button onClick={() => setSelectedAlertDetails(null)}>
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted-foreground block mb-1">{APP_TEXTS.configurator.tmbMessage}</label>
                                    <div className="p-4 bg-muted/50 rounded-lg text-sm border whitespace-pre-line">
                                        {getAlertText(selectedAlertDetails)}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t">
                                <button onClick={() => setSelectedAlertDetails(null)} className="w-full py-3 border rounded-lg font-bold">{APP_TEXTS.configurator.back}</button>
                            </div>
                        </div>
                    )}

                    {/* Footer - NOW INSIDE THE FLEX-COL CONTAINER */}
                    <div className="p-4 border-t bg-muted/50 shrink-0 space-y-2 mt-auto">
                        <Link
                            to="/docs"
                            className="text-sm text-foreground hover:text-primary underline underline-offset-4 flex justify-center items-center gap-2 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            <FileText className="w-4 h-4" />
                            <span>{APP_TEXTS.configurator.documentation}</span>
                        </Link>
                        <Link
                            to="/credits"
                            className="text-sm text-foreground hover:text-primary underline underline-offset-4 flex justify-center items-center gap-2 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            <Info className="w-4 h-4" />
                            <span>{APP_TEXTS.configurator.credits}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
