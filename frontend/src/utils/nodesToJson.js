export default function generateJson(nodes, edges) {
    const json = {
        welcome: "",
        variables: {},
        commands: {},
    }

    const prototypeNode = nodes.find((node) => node.type === "prototype")
    if (prototypeNode) {
        json.welcome = prototypeNode.data.welcome
    }

    const commandEdges = edges.filter((edge) => edge.source === "prototype")
    commandEdges.forEach((edge) => {
        const commandNode = nodes.find((node) => node.id === edge.target)
        if (commandNode) {
            json.commands[commandNode.data.name] = {
                description: commandNode.data.description,
                handler: [],
            }

            const handlerEdges = edges.filter(
                (e) => e.source === commandNode.id
            )
            handlerEdges.forEach((handlerEdge) => {
                const handlerNode = nodes.find(
                    (node) => node.id === handlerEdge.target
                )
                if (handlerNode) {
                    let handlerData = {
                        component: handlerNode.type.replace("Handler", ""),
                    }
                    switch (handlerNode.type) {
                        case "textHandler":
                            handlerData.output = handlerNode.data.output
                            break
                        case "inputHandler":
                        case "selectHandler":
                            handlerData = {
                                ...handlerData,
                                name: handlerNode.data.name,
                                message: handlerNode.data.message,
                            }
                            if (handlerNode.type === "selectHandler") {
                                handlerData.choices = handlerNode.data.choices
                            }
                            break
                    }
                    json.commands[commandNode.data.name].handler.push(
                        handlerData
                    )
                }
            })
        }
    })

    console.log(JSON.stringify(json, null, 2))
    return json
}
