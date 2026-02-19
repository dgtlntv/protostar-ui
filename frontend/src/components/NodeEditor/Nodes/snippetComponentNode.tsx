import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface snippetComponentData {
    onChange: (field: "component" | "name" | "message" | "fields" | "template", value: string | string[] | number | boolean) => void;
    component: "snippet";
    name: string;
    message: string;
    fields: any[];
    template: string;
}

interface snippetComponentProps {
    data: snippetComponentData;
}

export default function snippetComponentNode({ data }: snippetComponentProps) {
    return (
        <div className="node">
            <strong>snippetComponent</strong>
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
            <label>fields:</label>
            <input
                type="text"
                value={data.fields}
                onChange={(e) => data.onChange("fields", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>template:</label>
            <input
                type="text"
                value={data.template}
                onChange={(e) => data.onChange("template", e.target.value)}
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