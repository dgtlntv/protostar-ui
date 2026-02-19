import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";


interface basicAuthComponentData {
    onChange: (field: "component" | "name" | "message" | "username" | "password" | "showPassword", value: string | string[] | number | boolean) => void;
    component: "basicAuth";
    name: string;
    message: string;
    username: string;
    password: string;
    showPassword?: boolean;
}

interface basicAuthComponentProps {
    data: basicAuthComponentData;
}

export default function basicAuthComponentNode({ data }: basicAuthComponentProps) {
    return (
        <div className="node">
            <strong>basicAuthComponent</strong>
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
            <label>username:</label>
            <input
                type="text"
                value={data.username}
                onChange={(e) => data.onChange("username", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>password:</label>
            <input
                type="text"
                value={data.password}
                onChange={(e) => data.onChange("password", e.target.value)}
                className="node-input"
            />
        </div>

        <div>
            <label>showPassword:</label>
            <input
                type="checkbox"
                checked={data.showPassword}
                onChange={(e) => data.onChange("showPassword", e.target.checked)}
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