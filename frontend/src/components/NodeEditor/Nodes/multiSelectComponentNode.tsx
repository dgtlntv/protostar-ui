import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface multiSelectComponentData {
    onChange: (field: "component" | "name" | "message" | "limit" | "choices", value: string | string[] | number | boolean) => void;
    component: "multiSelect";
    name: string;
    message: string;
    limit?: number;
    choices: any[];
}

interface multiSelectComponentProps {
    data: multiSelectComponentData;
}

export default function multiSelectComponentNode({ data }: multiSelectComponentProps) {
    return (
        <div className="node">
            <strong>multiSelectComponent</strong>
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
            <label>limit:</label>
            <input
                type="number"
                value={data.limit}
                onChange={(e) => data.onChange("limit", Number(e.target.value))}
                className="node-input"
            />
        </div>

        <div>
            <label>choices:</label>
            <input
                type="text"
                value={data.choices}
                onChange={(e) => data.onChange("choices", e.target.value)}
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