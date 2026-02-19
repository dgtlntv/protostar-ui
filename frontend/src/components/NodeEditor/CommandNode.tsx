import { NodeProps, Position } from "@xyflow/react"
import HandleWithLabel from "./nodeParts/HandleWithLabel"

// Define the data structure for the command node's data
interface CommandNodeData extends Record<string, unknown> {
    name: string
    description: string
    onChange: (field: "name" | "description", value: string) => void
}

export default function CommandNode({ data }: NodeProps<CommandNodeData>) {
    const typedData = data as CommandNodeData // Type assertion since we know the shape

    return (
        <div className="node">
            <strong>Command: {typedData.name}</strong>
            <HandleWithLabel
                type="target"
                position={Position.Left}
                id="parent"
                label="Parent"
            />
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={typedData.name}
                    onChange={(e) => typedData.onChange("name", e.target.value)}
                    className="node-input"
                />
            </div>
            <div>
                <label>Description:</label>
                <input
                    type="text"
                    value={typedData.description}
                    onChange={(e) =>
                        typedData.onChange("description", e.target.value)
                    }
                    className="node-input"
                />
            </div>
            <HandleWithLabel
                type="source"
                position={Position.Right}
                id="handler"
                label="Handler"
            />
        </div>
    )
}
