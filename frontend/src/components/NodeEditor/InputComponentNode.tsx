import HandleWithLabel from "./nodeParts/HandleWithLabel"

interface NodeData {
    name: string
    message: string
    onChange: (field: "name" | "message", value: string) => void
}

interface InputHandlerNodeProps {
    data: NodeData
}

export default function InputHandlerNode({ data }: InputHandlerNodeProps) {
    return (
        <div className="node">
            <strong>Input Handler</strong>
            <HandleWithLabel
                type="target"
                position="left"
                id="parent"
                label="Parent"
            />
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => data.onChange("name", e.target.value)}
                    className="node-input"
                />
            </div>
            <div>
                <label>Message:</label>
                <input
                    type="text"
                    value={data.message}
                    onChange={(e) => data.onChange("message", e.target.value)}
                    className="node-input"
                />
            </div>
        </div>
    )
}
