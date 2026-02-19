import { Handle, Position } from "@xyflow/react"

interface HandleWithLabelProps {
    type: "source" | "target"
    position: Position
    id: string
    label: string
}

export default function HandleWithLabel({
    type,
    position,
    id,
    label,
}: HandleWithLabelProps) {
    return (
        <div
            className="node-connection-point"
            style={{
                justifyContent: position === "left" ? "flex-start" : "flex-end",
            }}
        >
            {position === "left" && (
                <Handle
                    type={type}
                    position={position}
                    id={id}
                    style={{ left: "-10px" }}
                />
            )}
            <span className="node-labe" style={{ [position]: "20px" }}>
                {label}
            </span>
            {position === "right" && (
                <Handle
                    type={type}
                    position={position}
                    id={id}
                    style={{ right: "-10px" }}
                />
            )}
        </div>
    )
}
