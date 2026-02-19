import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface surveyComponentData {
    onChange: (field: "component" | "name" | "message" | "scale" | "choices", value: string | string[] | number | boolean) => void;
    component: "survey";
    name: string;
    message: string;
    scale: any[];
    choices: any[];
}

interface surveyComponentProps {
    data: surveyComponentData;
}

export default function surveyComponentNode({ data }: surveyComponentProps) {
    return (
        <div className="node">
            <strong>surveyComponent</strong>
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
            <label>scale:</label>
            <input
                type="text"
                value={data.scale}
                onChange={(e) => data.onChange("scale", e.target.value)}
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