import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface toggleComponentData {
    onChange: (field: "component" | "name" | "message" | "enabled" | "disabled", value: string | string[] | number | boolean) => void;
    component: "toggle";
    name: string;
    message: string;
    enabled: string;
    disabled: string;
}

interface toggleComponentProps {
    data: toggleComponentData;
}

export default function toggleComponentNode({ data }: toggleComponentProps) {
    return (
        <div className="node">
            <strong>toggleComponent</strong>
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
            <label>enabled:</label>
            <input
                type="text"
                value={data.enabled}
                onChange={(e) => data.onChange("enabled", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>disabled:</label>
            <input
                type="text"
                value={data.disabled}
                onChange={(e) => data.onChange("disabled", e.target.value)}
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