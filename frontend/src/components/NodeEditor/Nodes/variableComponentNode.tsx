import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface variableComponentData {
    onChange: (field: "component" | "output", value: string | string[] | number | boolean) => void;
    component: "variable";
    output: any;
}

interface variableComponentProps {
    data: variableComponentData;
}

export default function variableComponentNode({ data }: variableComponentProps) {
    return (
        <div className="node">
            <strong>variableComponent</strong>
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