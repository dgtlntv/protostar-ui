import { Center, Spinner, Text, VStack } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { PrototypesService } from "../client"
//@ts-ignore
import { TerminalWrapper } from "../components/Terminal/TerminalWrapper"
import { isLoggedIn } from "../hooks/useAuth"

export const Route = createFileRoute("/prototype/$prototypeId/play")({
    beforeLoad: async () => {
        if (!isLoggedIn()) {
            throw redirect({
                to: "/login",
            })
        }
    },
    component: PlayComponent,
})

function PlayComponent() {
    const { prototypeId } = Route.useParams()
    const [commands, setCommands] = useState<Record<string, unknown> | null>(
        null
    )
    const [error, setError] = useState<string | null>(null)
    const [terminalKey, setTerminalKey] = useState(0)

    // Fetch prototype data
    const { data: prototype, isLoading } = useQuery({
        queryKey: ["prototype", prototypeId],
        queryFn: () => PrototypesService.readPrototype({ prototypeId }),
    })

    // Force terminal re-render on window resize
    useEffect(() => {
        const handleResize = () => {
            setTerminalKey((prev) => prev + 1)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Update commands when prototype data changes
    useEffect(() => {
        if (prototype?.content) {
            try {
                const parsedCommands = prototype.content as Record<
                    string,
                    unknown
                >

                // Validate commands
                if (
                    typeof parsedCommands !== "object" ||
                    parsedCommands === null
                ) {
                    throw new Error("Invalid commands format")
                }

                // Check if commands object is empty
                if (Object.keys(parsedCommands).length === 0) {
                    throw new Error("Commands cannot be empty")
                }

                setCommands(parsedCommands)
                setError(null)
            } catch (error) {
                console.error("Error parsing commands:", error)
                setError(
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred"
                )
                setCommands(null)
            }
        }
    }, [prototype])

    // Loading state
    if (isLoading) {
        return (
            <Center h="100vh" w="100vw">
                <VStack spacing={4}>
                    <Spinner size="xl" />
                    <Text>Loading prototype...</Text>
                </VStack>
            </Center>
        )
    }

    // Error state
    if (error) {
        return (
            <Center h="100vh" w="100vw">
                <Text color="red.500">Error: {error}</Text>
            </Center>
        )
    }

    // Loading commands state
    if (!commands) {
        return (
            <Center h="100vh" w="100vw">
                <VStack spacing={4}>
                    <Spinner size="xl" />
                    <Text>Initializing terminal...</Text>
                </VStack>
            </Center>
        )
    }

    return (
        <TerminalWrapper
            key={terminalKey}
            commands={commands}
            style={{
                height: "100vh",
                width: "100vw",
            }}
        />
    )
}
