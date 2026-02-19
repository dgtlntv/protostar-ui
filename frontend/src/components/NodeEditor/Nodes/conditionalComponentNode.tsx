import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface conditionalComponentData {
    onChange: (field: "component" | "output", value: string | string[] | number | boolean) => void;
    component: "conditional";
    output: any;
}

interface conditionalComponentProps {
    data: conditionalComponentData;
}

export default function conditionalComponentNode({ data }: conditionalComponentProps) {
    return (
        <div className="node">
            <strong>conditionalComponent</strong>
            <HandleWithLabel
                type="target"
                position={Position.Left}
                id="parent"
                label="Parent"
            />
            
        <div>
            <label>output:</label>
            <input
                type="text"
                value={data.output}
                onChange={(e) => data.onChange("output", e.target.value)}
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