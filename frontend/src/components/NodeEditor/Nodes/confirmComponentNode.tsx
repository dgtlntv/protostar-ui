import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface confirmComponentData {
    onChange: (field: "component" | "name" | "message" | "initial", value: string | string[] | number | boolean) => void;
    component: "confirm";
    name: string;
    message: string;
    initial?: boolean;
}

interface confirmComponentProps {
    data: confirmComponentData;
}

export default function confirmComponentNode({ data }: confirmComponentProps) {
    return (
        <div className="node">
            <strong>confirmComponent</strong>
            <HandleWithLabel
                type="target"
                position={Position.Left}
                id="parent"
                label="Parent"
            />
            
        <div>
            <label>name:</label>
            <input
                type="text"
                value={data.name}
                onChange={(e) => data.onChange("name", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>message:</label>
            <input
                type="text"
                value={data.message}
                onChange={(e) => data.onChange("message", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>initial:</label>
            <input
                type="checkbox"
                checked={data.initial}
                onChange={(e) => data.onChange("initial", e.target.checked)}
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
    );
}