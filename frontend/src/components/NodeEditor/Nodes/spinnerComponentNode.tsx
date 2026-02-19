import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface spinnerComponentData {
    onChange: (field: "component" | "output" | "duration" | "conclusion", value: string | string[] | number | boolean) => void;
    component: "spinner";
    output: string | string[];
    duration: number | "random";
    conclusion?: any;
}

interface spinnerComponentProps {
    data: spinnerComponentData;
}

export default function spinnerComponentNode({ data }: spinnerComponentProps) {
    return (
        <div className="node">
            <strong>spinnerComponent</strong>
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

        <div>
            <label>conclusion:</label>
            <input
                type="text"
                value={data.conclusion}
                onChange={(e) => data.onChange("conclusion", e.target.value)}
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