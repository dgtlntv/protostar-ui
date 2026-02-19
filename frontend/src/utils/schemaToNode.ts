// schemaToNodes.ts
import { ensureDir } from "https://deno.land/std/fs/mod.ts"
import { join } from "https://deno.land/std/path/mod.ts"

// You'll need to import your schema JSON - in Deno you can do this directly
const schema = JSON.parse(
    await Deno.readTextFile("./src/cli-schema/commands-schema.json")
)

function getTypeScriptType(property: any): string {
    if (property.const) return `"${property.const}"`
    if (property.type === "string") return "string"
    if (property.type === "number") return "number"
    if (property.type === "boolean") return "boolean"
    if (property.type === "array") {
        if (property.items?.type === "string") return "string[]"
        if (property.items?.$ref) {
            const refType = property.items.$ref.split("/").pop()
            return `${refType}[]`
        }
        return "any[]"
    }
    if (property.oneOf) {
        return property.oneOf
            .map((type: any) => getTypeScriptType(type))
            .join(" | ")
    }
    if (property.$ref) {
        return property.$ref.split("/").pop()
    }
    return "any"
}

function generateNodeInterface(name: string, schema: any): string {
    const properties = schema.properties
    const required = schema.required || []

    const propertyLines = Object.entries(properties)
        .map(([key, prop]: [string, any]) => {
            const isOptional = !required.includes(key)
            return `    ${key}${isOptional ? "?" : ""}: ${getTypeScriptType(prop)};`
        })
        .join("\n")

    const fieldTypes = Object.keys(properties)
        .map((key) => `"${key}"`)
        .join(" | ")

    return `
interface ${name}Data {
    onChange: (field: ${fieldTypes}, value: string | string[] | number | boolean) => void;
${propertyLines}
}

interface ${name}Props {
    data: ${name}Data;
}`
}

function generateInputField(key: string, prop: any): string {
    if (prop.const) return "" // Don't generate input for const values

    if (prop.type === "array" && prop.items?.type === "string") {
        return `
        <div>
            <label>${key}:</label>
            <input
                type="text"
                value={data.${key}?.join(",")}
                onChange={(e) => data.onChange("${key}", e.target.value.split(","))}
                className="node-input"
            />
        </div>`
    }

    if (prop.type === "boolean") {
        return `
        <div>
            <label>${key}:</label>
            <input
                type="checkbox"
                checked={data.${key}}
                onChange={(e) => data.onChange("${key}", e.target.checked)}
                className="node-input"
            />
        </div>`
    }

    if (prop.type === "number") {
        return `
        <div>
            <label>${key}:</label>
            <input
                type="number"
                value={data.${key}}
                onChange={(e) => data.onChange("${key}", Number(e.target.value))}
                className="node-input"
            />
        </div>`
    }

    return `
        <div>
            <label>${key}:</label>
            <input
                type="text"
                value={data.${key}}
                onChange={(e) => data.onChange("${key}", e.target.value)}
                className="node-input"
            />
        </div>`
}

function generateNodeComponent(name: string, schema: any): string {
    const interfaceCode = generateNodeInterface(name, schema)
    const inputFields = Object.entries(schema.properties)
        .map(([key, prop]: [string, any]) => generateInputField(key, prop))
        .filter(Boolean)
        .join("\n")

    return `import { NodeProps, Position } from "@xyflow/react";
import HandleWithLabel from "./nodeParts/HandleWithLabel";

${interfaceCode}

export default function ${name}Node({ data }: ${name}Props) {
    return (
        <div className="node">
            <strong>${name}</strong>
            <HandleWithLabel
                type="target"
                position={Position.Left}
                id="parent"
                label="Parent"
            />
            ${inputFields}
            <HandleWithLabel
                type="source"
                position={Position.Right}
                id="handler"
                label="Handler"
            />
        </div>
    );
}`
}

export async function generateComponentFiles(schema: any, outputPath?: string) {
    // Use provided output path or default to components directory
    const componentsDir = outputPath
        ? join(Deno.cwd(), outputPath)
        : join(Deno.cwd(), "components")

    await ensureDir(componentsDir)

    // Generate node components from schema definitions
    for (const [name, def] of Object.entries(schema.definitions)) {
        if ((def as any).properties) {
            const componentCode = generateNodeComponent(name, def as any)
            const filename = join(componentsDir, `${name}Node.tsx`)
            await Deno.writeTextFile(filename, componentCode)
        }
    }
}

// Execute the generation
await generateComponentFiles(schema, "src/components/NodeEditor/Nodes")
