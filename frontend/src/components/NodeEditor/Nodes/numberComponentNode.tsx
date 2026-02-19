import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface numberComponentData {
    onChange: (field: "component" | "name" | "message", value: string | string[] | number | boolean) => void;
    component: "number";
    name: string;
    message: string;
}

interface numberComponentProps {
    data: numberComponentData;
}

export default function numberComponentNode({ data }: numberComponentProps) {
    return (
        <div className="node">
            <strong>numberComponent</strong>
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
            <HandleWithLabel
                type="source"
                position={Position.Right}
                id="handler"
                label="Handler"
            />
        </div>
    );
}