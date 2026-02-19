import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface autoCompleteComponentData {
    onChange: (field: "component" | "name" | "message" | "limit" | "initial" | "choices" | "multiple" | "footer", value: string | string[] | number | boolean) => void;
    component: "autoComplete";
    name: string;
    message: string;
    limit?: number;
    initial?: number;
    choices: string[];
    multiple?: boolean;
    footer?: string;
}

interface autoCompleteComponentProps {
    data: autoCompleteComponentData;
}

export default function autoCompleteComponentNode({ data }: autoCompleteComponentProps) {
    return (
        <div className="node">
            <strong>autoCompleteComponent</strong>
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
            <label>initial:</label>
            <input
                type="number"
                value={data.initial}
                onChange={(e) => data.onChange("initial", Number(e.target.value))}
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

        <div>
            <label>multiple:</label>
            <input
                type="checkbox"
                checked={data.multiple}
                onChange={(e) => data.onChange("multiple", e.target.checked)}
                className="node-input"
            />
        </div>

        <div>
            <label>footer:</label>
            <input
                type="text"
                value={data.footer}
                onChange={(e) => data.onChange("footer", e.target.value)}
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