import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface progressBarComponentData {
    onChange: (field: "component" | "output" | "duration", value: string | string[] | number | boolean) => void;
    component: "progressBar";
    output: string;
    duration: number | "random";
}

interface progressBarComponentProps {
    data: progressBarComponentData;
}

export default function progressBarComponentNode({ data }: progressBarComponentProps) {
    return (
        <div className="node">
            <strong>progressBarComponent</strong>
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

        <div>
            <label>duration:</label>
            <input
                type="text"
                value={data.duration}
                onChange={(e) => data.onChange("duration", e.target.value)}
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