import "@xterm/xterm/css/xterm.css"
import { useEffect, useRef } from "react"
import { Terminal } from "../../protostar-lib/index.es"
import "./terminal.css"

export function TerminalWrapper({ commands = {}, className = "", style = {} }) {
    const terminalRef = useRef(null)
    const terminalInstance = useRef(null)

    useEffect(() => {
        if (!terminalRef.current) return
        console.log(commands)

        // Initialize terminal
        terminalInstance.current = new Terminal(terminalRef.current, commands)

        // Cleanup
        return () => {
            if (terminalInstance.current) {
                terminalInstance.current.destroy()
            }
        }
    }, []) // Empty dependency array since we only want to initialize once

    return (
        <div
            ref={terminalRef}
            className={`terminal ${className}`}
            style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                ...style,
            }}
        />
    )
}
