import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface tableComponentData {
    onChange: (field: "component" | "output" | "colWidths", value: string | string[] | number | boolean) => void;
    component: "table";
    output: any[];
    colWidths?: any[];
}

interface tableComponentProps {
    data: tableComponentData;
}

export default function tableComponentNode({ data }: tableComponentProps) {
    return (
        <div className="node">
            <strong>tableComponent</strong>
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
            <label>colWidths:</label>
            <input
                type="text"
                value={data.colWidths}
                onChange={(e) => data.onChange("colWidths", e.target.value)}
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