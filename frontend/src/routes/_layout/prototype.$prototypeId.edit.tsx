import { Button } from "@chakra-ui/react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Connection,
    Controls,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    NodeTypes,
    ReactFlow,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useCallback, useState } from "react"
import CommandNode from "../../components/NodeEditor/CommandNode"
import InputHandlerNode from "../../components/NodeEditor/InputComponentNode"
import "../../components/NodeEditor/node.css"
import PrototypeNode from "../../components/NodeEditor/PrototypeNode"
import SelectHandlerNode from "../../components/NodeEditor/SelectComponentNode"
import TextHandlerNode from "../../components/NodeEditor/TextComponentNode"
import { isLoggedIn } from "../../hooks/useAuth"
import generateJson from "../../utils/nodesToJson"

// Define node data types
interface BaseNodeData {
    onChange: (field: string, value: any) => void
}

interface PrototypeNodeData extends BaseNodeData {
    welcome: string
}

interface CommandNodeData extends BaseNodeData {
    name: string
    description: string
}

interface TextHandlerNodeData extends BaseNodeData {
    output: string
}

interface InputHandlerNodeData extends BaseNodeData {
    name: string
    message: string
}

interface SelectHandlerNodeData extends InputHandlerNodeData {
    choices: string[]
}

// Define custom node types
type CustomNode = Node<
    | PrototypeNodeData
    | CommandNodeData
    | TextHandlerNodeData
    | InputHandlerNodeData
    | SelectHandlerNodeData
>

// Define node types mapping
const nodeTypes: NodeTypes = {
    prototype: PrototypeNode,
    command: CommandNode,
    textHandler: TextHandlerNode,
    inputHandler: InputHandlerNode,
    selectHandler: SelectHandlerNode,
}

const initialNodes: CustomNode[] = [
    {
        id: "prototype",
        type: "prototype",
        position: { x: 0, y: 0 },
        data: { welcome: "Welcome to the CLI", onChange: () => {} },
    },
]

const initialEdges: Edge[] = []

export const Route = createFileRoute("/_layout/prototype/$prototypeId/edit")({
    beforeLoad: async () => {
        if (!isLoggedIn()) {
            throw redirect({
                to: "/login",
            })
        }
    },
    component: Flow,
})

function Flow() {
    const [nodes, setNodes] = useState<CustomNode[]>(initialNodes)
    const [edges, setEdges] = useState<Edge[]>(initialEdges)

    const onNodesChange = useCallback(
        (changes: NodeChange[]) =>
            setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    )

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    )

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        []
    )

    const updateNodeData = (nodeId: string, field: string, value: any) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            [field]: value,
                        },
                    }
                }
                return node
            })
        )
    }

    const addNode = (
        type: "command" | "textHandler" | "inputHandler" | "selectHandler"
    ) => {
        const baseNodeData: BaseNodeData = {
            onChange: (field: string, value: any) =>
                updateNodeData(`${type}-${nodes.length}`, field, value),
        }

        let newNode: CustomNode = {
            id: `${type}-${nodes.length}`,
            type,
            position: { x: 250, y: nodes.length * 150 },
            data: baseNodeData,
        }

        switch (type) {
            case "command":
                newNode.data = {
                    ...baseNodeData,
                    name: `Command ${nodes.length}`,
                    description: "",
                }
                break
            case "textHandler":
                newNode.data = { ...baseNodeData, output: "" }
                break
            case "inputHandler":
            case "selectHandler":
                newNode.data = {
                    ...baseNodeData,
                    name: "",
                    message: "",
                    ...(type === "selectHandler" ? { choices: [] } : {}),
                }
                break
        }

        setNodes((nds) => [...nds, newNode])
    }

    return (
        <div
            style={{
                height: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ padding: 24, display: "flex", gap: 10 }}>
                <Button onClick={() => addNode("command")}>
                    Add Command Node
                </Button>
                <Button onClick={() => addNode("textHandler")}>
                    Add Text Handler
                </Button>
                <Button onClick={() => addNode("inputHandler")}>
                    Add Input Handler
                </Button>
                <Button onClick={() => addNode("selectHandler")}>
                    Add Select Handler
                </Button>
                <Button onClick={() => generateJson(nodes, edges)}>
                    Generate JSON
                </Button>
            </div>
            <div style={{ flex: 1 }}>
                <ReactFlow
                    nodes={nodes}
                    onNodesChange={onNodesChange}
                    edges={edges}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    )
}
