import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface inputComponentData {
    onChange: (field: "component" | "name" | "message" | "initial", value: string | string[] | number | boolean) => void;
    component: "input";
    name: string;
    message: string;
    initial?: string;
}

interface inputComponentProps {
    data: inputComponentData;
}

export default function inputComponentNode({ data }: inputComponentProps) {
    return (
        <div className="node">
            <strong>inputComponent</strong>
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
                type="text"
                value={data.initial}
                onChange={(e) => data.onChange("initial", e.target.value)}
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