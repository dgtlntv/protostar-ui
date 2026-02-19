import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface positionalOptionsData {
    onChange: (field: "alias" | "choices" | "default" | "demandOption" | "desc" | "describe" | "description" | "type", value: string | string[] | number | boolean) => void;
    alias?: string | string[];
    choices?: any[];
    default?: any;
    demandOption?: boolean | string;
    desc?: string;
    describe?: string;
    description?: string;
    type?: any;
}

interface positionalOptionsProps {
    data: positionalOptionsData;
}

export default function positionalOptionsNode({ data }: positionalOptionsProps) {
    return (
        <div className="node">
            <strong>positionalOptions</strong>
            <HandleWithLabel
                type="target"
                position={Position.Left}
                id="parent"
                label="Parent"
            />
            
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
            <label>choices:</label>
            <input
                type="text"
                value={data.choices}
                onChange={(e) => data.onChange("choices", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>default:</label>
            <input
                type="text"
                value={data.default}
                onChange={(e) => data.onChange("default", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>demandOption:</label>
            <input
                type="text"
                value={data.demandOption}
                onChange={(e) => data.onChange("demandOption", e.target.value)}
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
            <label>description:</label>
            <input
                type="text"
                value={data.description}
                onChange={(e) => data.onChange("description", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>type:</label>
            <input
                type="text"
                value={data.type}
                onChange={(e) => data.onChange("type", e.target.value)}
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