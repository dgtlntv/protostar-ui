import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface invisibleComponentData {
    onChange: (field: "component" | "name" | "message", value: string | string[] | number | boolean) => void;
    component: "invisible";
    name: string;
    message: string;
}

interface invisibleComponentProps {
    data: invisibleComponentData;
}

export default function invisibleComponentNode({ data }: invisibleComponentProps) {
    return (
        <div className="node">
            <strong>invisibleComponent</strong>
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