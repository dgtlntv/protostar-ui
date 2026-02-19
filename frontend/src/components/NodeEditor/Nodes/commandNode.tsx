import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface commandData {
    onChange: (field: "description" | "desc" | "describe" | "alias" | "example" | "positional" | "options" | "commands" | "handler", value: string | string[] | number | boolean) => void;
    description?: string;
    desc?: string;
    describe?: string;
    alias?: string | string[];
    example?: string[] | any[];
    positional?: any;
    options?: any;
    commands?: any;
    handler?: component | component[];
}

interface commandProps {
    data: commandData;
}

export default function commandNode({ data }: commandProps) {
    return (
        <div className="node">
            <strong>command</strong>
            <HandleWithLabel
                type="target"
                position={Position.Left}
                id="parent"
                label="Parent"
            />
            
        <div>
            <label>description:</label>
            <input
                type="text"
                value={data.description}
                onChange={(e) => data.onChange("description", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>desc:</label>
            <input
                type="text"
                value={data.desc}
                onChange={(e) => data.onChange("desc", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>describe:</label>
            <input
                type="text"
                value={data.describe}
                onChange={(e) => data.onChange("describe", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>alias:</label>
            <input
                type="text"
                value={data.alias}
                onChange={(e) => data.onChange("alias", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>example:</label>
            <input
                type="text"
                value={data.example}
                onChange={(e) => data.onChange("example", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>positional:</label>
            <input
                type="text"
                value={data.positional}
                onChange={(e) => data.onChange("positional", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>options:</label>
            <input
                type="text"
                value={data.options}
                onChange={(e) => data.onChange("options", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>commands:</label>
            <input
                type="text"
                value={data.commands}
                onChange={(e) => data.onChange("commands", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>handler:</label>
            <input
                type="text"
                value={data.handler}
                onChange={(e) => data.onChange("handler", e.target.value)}
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