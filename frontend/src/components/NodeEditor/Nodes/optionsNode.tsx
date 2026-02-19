import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface optionsData {
    onChange: (field: "alias" | "choices" | "default" | "defaultDescription" | "demandOption" | "desc" | "describe" | "description" | "group" | "hidden" | "nargs" | "requiresArg" | "type", value: string | string[] | number | boolean) => void;
    alias?: string | string[];
    choices?: any[];
    default?: any;
    defaultDescription?: string;
    demandOption?: boolean | string;
    desc?: string;
    describe?: string;
    description?: string;
    group?: string;
    hidden?: boolean;
    nargs?: number;
    requiresArg?: boolean;
    type?: any;
}

interface optionsProps {
    data: optionsData;
}

export default function optionsNode({ data }: optionsProps) {
    return (
        <div className="node">
            <strong>options</strong>
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
            <label>defaultDescription:</label>
            <input
                type="text"
                value={data.defaultDescription}
                onChange={(e) => data.onChange("defaultDescription", e.target.value)}
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
            <label>group:</label>
            <input
                type="text"
                value={data.group}
                onChange={(e) => data.onChange("group", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>hidden:</label>
            <input
                type="checkbox"
                checked={data.hidden}
                onChange={(e) => data.onChange("hidden", e.target.checked)}
                className="node-input"
            />
        </div>

        <div>
            <label>nargs:</label>
            <input
                type="number"
                value={data.nargs}
                onChange={(e) => data.onChange("nargs", Number(e.target.value))}
                className="node-input"
            />
        </div>

        <div>
            <label>requiresArg:</label>
            <input
                type="checkbox"
                checked={data.requiresArg}
                onChange={(e) => data.onChange("requiresArg", e.target.checked)}
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