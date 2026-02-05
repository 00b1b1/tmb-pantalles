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

            // Original dimensions
            const originalWidth = 1920
            const originalHeight = 520

            // Calculate scale based on available width (accounting for padding)
            const scaleX = wrapperWidth / originalWidth
            const scaleY = wrapperHeight / originalHeight

            // Use the smaller scale to ensure it fits
            const scale = Math.min(scaleX, scaleY)

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
