import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface sortComponentData {
    onChange: (field: "component" | "name" | "message" | "choices", value: string | string[] | number | boolean) => void;
    component: "sort";
    name: string;
    message: string;
    choices: string[];
}

interface sortComponentProps {
    data: sortComponentData;
}

export default function sortComponentNode({ data }: sortComponentProps) {
    return (
        <div className="node">
            <strong>sortComponent</strong>
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
            <label>choices:</label>
            <input
                type="text"
                value={data.choices?.join(",")}
                onChange={(e) => data.onChange("choices", e.target.value.split(","))}
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