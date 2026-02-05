import { useState, useEffect } from 'react'
import { fetchStationInfo, calculateTimeRemaining, fetchLineAlerts } from '../services/tmbApi'
import type { TMBResponse, TMBAlert, CustomAlert } from '../types/tmb'
import { APP_TEXTS } from '../constants/texts'
import './MetroScreen.css'

interface MetroScreenProps {
    lineCode: number;
    lineName: string;
    stationCode: number;
    directionId: number;
    destinationName: string;
    showAlert?: boolean;
    showEmergencyAlert?: boolean;
    activeAlertIds?: number[];
    customAlerts?: CustomAlert[];
}

const REFRESH_INTERVAL = 30000; // 30 seconds

export default function MetroScreen({
    lineCode,
    lineName,
    stationCode,
    directionId,
    destinationName,
    showAlert = false,
    showEmergencyAlert = true,
    activeAlertIds = [],
    customAlerts = []
}: MetroScreenProps) {
    const [time, setTime] = useState(new Date())
    const [metroData, setMetroData] = useState<TMBResponse | null>(null)
    const [disruptions, setDisruptions] = useState<TMBAlert[]>([])
    const [currentAlertIndex, setCurrentAlertIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [directionLabelIndex, setDirectionLabelIndex] = useState(0)

    // Helper to clean alert header (e.g., remove "PP9 ", "PP2 ")
    const cleanHeader = (header: string) => {
        const cleaned = header.replace(/^[A-Z]{2}\d+\s*/, '').trim()
        return cleaned.length > 25 ? APP_TEXTS.screen.attention : cleaned
    }

    // Helper to clean alert text (remove HTML, shorten links)
    const cleanText = (text: string) => {
        if (!text) return ''
        let cleaned = text.replace(/<[^>]*>?/gm, '')
        cleaned = cleaned.replace(/https?:\/\/(www\.)?tmb\.cat[^\s]*/g, 'tmb.cat')
        return cleaned.trim()
    }

    // Get unique line logos from disruption entities
    const getAffectedLines = (alert: TMBAlert) => {
        const lines = new Set<string>()
        alert.entities.forEach(entity => {
            if (entity.line_name) {
                lines.add(entity.line_name)
            }
        })
        return Array.from(lines)
    }

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Cycle direction label every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setDirectionLabelIndex((prev) => (prev + 1) % 3)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    // Fetch metro data
    useEffect(() => {
        if (stationCode === 0 || lineCode === 0) {
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await fetchStationInfo(stationCode, lineCode)
                setMetroData(data)
            } catch (err) {
                console.error('Error fetching metro data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        const interval = setInterval(fetchData, REFRESH_INTERVAL)
        return () => clearInterval(interval)
    }, [stationCode, lineCode])

    // Fetch alerts/disruptions
    useEffect(() => {
        if (!showAlert || !lineName) {
            setDisruptions([])
            return
        }

        const fetchAlerts = async () => {
            try {
                const response = await fetchLineAlerts(lineName)
                if (response.status === 'success') {
                    setDisruptions(response.data.alerts)
                }
            } catch (err) {
                console.error('Error fetching alerts:', err)
            }
        }

        fetchAlerts()
        const interval = setInterval(fetchAlerts, REFRESH_INTERVAL * 2) // Check alerts every 60s
        return () => clearInterval(interval)
    }, [lineName, showAlert])

    // Unified alert list (Incidents + Emergency Help + Custom Alerts)
    const combinedAlerts = [
        ...disruptions
            .filter(d => activeAlertIds.includes(d.id))
            .map(d => ({
                id: `dis-${d.id}`,
                title: cleanHeader(d.publications[0]?.headerCa || ''),
                content: cleanText(d.publications[0]?.textCa || ''),
                isDisruption: true,
                isCustom: false,
                affectedLines: getAffectedLines(d),
                bgColor: '',
                textColor: '',
                headerColor: '',
                iconName: ''
            })),
        ...(showEmergencyAlert ? [{
            id: 'emergency-fallback',
            title: APP_TEXTS.screen.attention,
            content: APP_TEXTS.screen.emergencyHelp,
            isDisruption: false,
            isCustom: false,
            affectedLines: [],
            bgColor: '',
            textColor: '',
            headerColor: '',
            iconName: ''
        }] : []),
        ...customAlerts
            .filter(ca => ca.isActive)
            .map(ca => ({
                id: `custom-${ca.id}`,
                title: ca.title,
                content: ca.content,
                isDisruption: false,
                isCustom: true,
                affectedLines: [],
                bgColor: ca.bgColor,
                textColor: ca.textColor,
                headerColor: ca.headerColor,
                iconName: ca.iconName
            }))
    ]

    // Cycle through combined alerts synchronized with scroll animation
    useEffect(() => {
        if (combinedAlerts.length <= 1) {
            setCurrentAlertIndex(0)
            return
        }

        const activeAlert = combinedAlerts[currentAlertIndex % combinedAlerts.length]
        const displayDuration = activeAlert.content.length > 150 ? 20000 : 10000

        const timer = setTimeout(() => {
            setCurrentAlertIndex((prev) => (prev + 1) % combinedAlerts.length)
        }, displayDuration)

        return () => clearTimeout(timer)
    }, [currentAlertIndex, combinedAlerts.length])

    const activeAlert = showAlert && combinedAlerts.length > 0
        ? combinedAlerts[currentAlertIndex % combinedAlerts.length]
        : null

    // Format time as HH:mm for Barcelona timezone
    const formattedTime = time.toLocaleTimeString('ca-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Madrid'
    })

    // Get the selected direction
    const selectedDirection = metroData?.linies[0]?.estacions?.find(
        (station) => station.id_sentit === directionId
    )
    const selectedRoute = selectedDirection?.linies_trajectes[0]
    const upcomingTrains = selectedRoute?.propers_trens || []

    // Calculate arrival times
    const currentTimestamp = time.getTime()
    const train1 = upcomingTrains[0]
    const train2 = upcomingTrains[1]

    const train1Time = train1
        ? calculateTimeRemaining(train1.temps_arribada, currentTimestamp)
        : null

    const train2Time = train2
        ? calculateTimeRemaining(train2.temps_arribada, currentTimestamp, true)
        : null

    const displayDestination = destinationName || APP_TEXTS.configurator.selectStation

    const directionLabels = [
        { text: APP_TEXTS.screen.direction.ca, className: 'bold' },
        { text: APP_TEXTS.screen.direction.es, className: 'regular' },
        { text: APP_TEXTS.screen.direction.en, className: 'italic' }
    ]
    const activeDirectionLabel = directionLabels[directionLabelIndex]

    return (
        <div className="metro-screen">
            <aside className="sidebar">
                <div className="logo-container">
                    <img src="/metro-logo.svg" alt="TMB Metro Logo" width="119" height="119" />
                </div>
                <div className="clock-vertical">{formattedTime}</div>
            </aside>

            <main className="main-content">
                <header className="header">
                    <div className="line-badge" style={{ backgroundColor: 'transparent' }}>
                        {lineName && (
                            <img
                                src={`/lineas/icons/${lineName}.svg`}
                                alt={lineName}
                                className="line-badge-image"
                            />
                        )}
                    </div>
                    <div className="direction-info">
                        <p className={`direction-label ${activeDirectionLabel.className}`}>
                            {activeDirectionLabel.text}
                        </p>
                        <h1 className="destination">{displayDestination}</h1>
                    </div>
                </header>

                <section className={`timing-info ${showAlert ? 'with-alert' : 'classic'}`}>
                    <div className="timing-column">
                        <div className="train-status">
                            <div className="status-number">1</div>
                            {loading && !metroData ? (
                                <div className="loading-container">
                                    <div className="loading-spinner">
                                        <svg width="60" height="60" viewBox="0 0 100 100">
                                            <g>
                                                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                                                    <circle key={i} cx="50" cy="15" r="6" fill="#000" opacity={1 - (i * 0.12)} transform={`rotate(${angle} 50 50)`} />
                                                ))}
                                                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            ) : train1Time ? (
                                <div className="arrival-time">{train1Time === 'Entra' ? APP_TEXTS.screen.entering : train1Time}</div>
                            ) : (
                                <div className="loading-text">{APP_TEXTS.screen.noData}</div>
                            )}
                        </div>

                        <div className="train-status">
                            <div className="status-number">2</div>
                            {loading && !metroData ? (
                                <div className="loading-container">
                                    <div className="loading-spinner">
                                        <svg width="60" height="60" viewBox="0 0 100 100">
                                            <g>
                                                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                                                    <circle key={i} cx="50" cy="15" r="6" fill="#000" opacity={1 - (i * 0.12)} transform={`rotate(${angle} 50 50)`} />
                                                ))}
                                                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            ) : train2Time ? (
                                <div className="arrival-time">{train2Time === 'Entra' ? APP_TEXTS.screen.entering : train2Time}</div>
                            ) : (
                                <div className="loading-text">{APP_TEXTS.screen.noData}</div>
                            )}
                        </div>
                    </div>
                </section>

                {(activeAlert) && (
                    <div
                        key={activeAlert.id}
                        className={`alert-overlay ${activeAlert.isCustom ? 'custom' : (activeAlert.isDisruption ? 'disruption' : 'emergency')} animation-fade-in`}
                        style={{
                            ...(activeAlert.isCustom ? {
                                backgroundColor: activeAlert.bgColor,
                                color: activeAlert.textColor,
                                '--alert-bg': activeAlert.bgColor
                            } : {
                                '--alert-bg': activeAlert.isDisruption ? '#FFE501' : 'var(--tmb-red)'
                            })
                        } as React.CSSProperties}
                    >
                        <div className="alert-header-row">
                            <div
                                className="alert-icon-wrapper"
                                style={activeAlert.isCustom && (activeAlert.iconName.includes('FGC') || activeAlert.iconName.includes('RODALIES') || activeAlert.iconName.includes('TRAM')) ? {
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    padding: '8px'
                                } : {}}
                            >
                                <img
                                    src={activeAlert.isCustom
                                        ? (activeAlert.iconName.startsWith('L') || activeAlert.iconName === 'FM.svg' ? `/lineas/icons/${activeAlert.iconName}` : `/transport-icons/${activeAlert.iconName}`)
                                        : (activeAlert.isDisruption ? "/alertas/warning_black.png" : "/alertas/malament.png")
                                    }
                                    alt="Alerta"
                                    className="alert-icon"
                                />
                            </div>

                            {activeAlert.isDisruption && activeAlert.affectedLines.map(line => (
                                <div key={line} className="alert-line-logo">
                                    <img src={`/lineas/icons/${line}.svg`} alt={line} />
                                </div>
                            ))}

                            <h2
                                className="alert-title"
                                style={activeAlert.isCustom ? { color: activeAlert.headerColor } : {}}
                            >
                                {activeAlert.title}
                            </h2>
                        </div>

                        <div className="alert-content-container">
                            <div className={`alert-content ${activeAlert.content.length > 150 ? 'scroll-content' : ''}`}>
                                <p>{activeAlert.content}</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
