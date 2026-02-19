import HandleWithLabel from "./nodeParts/HandleWithLabel"

interface NodeData {
    welcome: string
    onChange: (field: "welcome", value: string) => void
}

interface PrototypeNodeProps {
    data: NodeData
}

export default function PrototypeNode({ data }: PrototypeNodeProps) {
    return (
        <div className="node">
            <strong>Prototype</strong>
            <div>
                <label>Welcome:</label>
                <input
                    type="text"
                    value={data.welcome}
                    onChange={(e) => data.onChange("welcome", e.target.value)}
                    className="node-input"
                />
            </div>
            <HandleWithLabel
                type="source"
                position="right"
                id="commands"
                label="Commands"
            />
        </div>
    )
}
