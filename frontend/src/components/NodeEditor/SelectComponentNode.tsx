import HandleWithLabel from "./nodeParts/HandleWithLabel"

interface NodeData {
    name: string
    message: string
    choices: string[]
    onChange: (
        field: "name" | "message" | "choices",
        value: string | string[]
    ) => void
}

interface SelectHandlerNodeProps {
    data: NodeData
}

export default function SelectHandlerNode({ data }: SelectHandlerNodeProps) {
    return (
        <div className="node">
            <strong>Select Handler</strong>
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
            <div>
                <label>Choices:</label>
                <input
                    type="text"
                    value={data.choices.join(",")}
                    onChange={(e) =>
                        data.onChange("choices", e.target.value.split(","))
                    }
                    className="node-input"
                />
            </div>
        </div>
    )
}
