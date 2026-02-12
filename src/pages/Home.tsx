import { useState, useEffect, useRef } from 'react'
import '../App.css'
import MetroScreen from '../components/MetroScreen'
import Configurator from '../components/Configurator'
import type { CustomAlert } from '../types/tmb'
import { parseConfigFromUrl } from '../utils/urlGenerator'

interface HomeConfig {
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
}

import { DEFAULT_PANEL_CONFIG as DEFAULT_CONFIG } from '../config/api.config'

export default function Home() {
    // Try to load config from URL, otherwise use default
    const urlConfig = parseConfigFromUrl();
    const initialConfig: HomeConfig = urlConfig ? {
        ...(DEFAULT_CONFIG as HomeConfig),
        ...urlConfig
    } : (DEFAULT_CONFIG as HomeConfig);

    const [config, setConfig] = useState<HomeConfig>(initialConfig);

    const canvasRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const updateScale = () => {
            if (!canvasRef.current) return

            const wrapper = canvasRef.current.parentElement
            if (!wrapper) return

            const wrapperWidth = wrapper.clientWidth
            const wrapperHeight = wrapper.clientHeight

            // Base dimensions for scaling logic
            const originalHeight = 540
            const minWidth = 1512 // Should match min-width in MetroScreen.css

            // We calculate scale based on height primarily, since width is now flexible
            // However, we still check width to ensure we don't overflow on very narrow screens
            const scaleY = (wrapperHeight - 2) / originalHeight
            const scaleX = (wrapperWidth - 2) / minWidth

            // Use the smaller scale to ensure it fits, but cap it at 1.0 for desktop
            let scale = Math.min(scaleX, scaleY)

            // On Retina/High-res, keep it at 1.0 or scale down if needed
            if (scale > 1) scale = 1

            canvasRef.current.style.transform = `scale(${scale})`
        }

        updateScale()

        window.addEventListener('resize', updateScale)
        return () => window.removeEventListener('resize', updateScale)
    }, [])

    return (
        <div className="app-wrapper">
            <div ref={canvasRef} className="canvas-container">
                <MetroScreen
                    lineCode={config.lineCode}
                    lineName={config.lineName}
                    stationCode={config.stationCode}
                    directionId={config.directionId}
                    destinationName={config.destinationName}
                    showAlert={config.showAlert}
                    showEmergencyAlert={config.showEmergencyAlert}
                    activeAlertIds={config.activeAlertIds}
                    customAlerts={config.customAlerts}
                />
            </div>

            <Configurator
                currentConfig={config}
                onConfigChange={(newConfig) => setConfig(newConfig)}
            />
        </div>
    )
}
