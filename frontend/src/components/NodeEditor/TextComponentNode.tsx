import HandleWithLabel from "./nodeParts/HandleWithLabel"

interface NodeData {
    output: string
    onChange: (field: "output", value: string) => void
}

interface TextHandlerNodeProps {
    data: NodeData
}

export default function TextHandlerNode({ data }: TextHandlerNodeProps) {
    return (
        <div className="node">
            <strong>Text Handler</strong>
            <HandleWithLabel
                type="target"
                position="left"
                id="parent"
                label="Parent"
            />
            <div>
                <label>Output:</label>
                <input
                    type="text"
                    value={data.output}
                    onChange={(e) => data.onChange("output", e.target.value)}
                    className="node-input"
                />
            </div>
        </div>
    )
}
