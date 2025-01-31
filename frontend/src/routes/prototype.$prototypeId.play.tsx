import { Center, Spinner, Text, VStack } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { type ApiError, PrototypesService } from "../client"
import { isLoggedIn } from "../hooks/useAuth"
//@ts-ignore
import { TerminalWrapper } from "../components/Terminal/TerminalWrapper"

export const Route = createFileRoute("/prototype/$prototypeId/play")({
    beforeLoad: async ({ params }) => {
        try {
            const { is_public } = await PrototypesService.checkPrototypePublic({
                prototypeId: params.prototypeId,
            })

            if (!is_public && !isLoggedIn()) {
                throw redirect({
                    to: "/login",
                    search: {
                        redirect: `/prototype/${params.prototypeId}/play`,
                    },
                })
            }
        } catch (error: any) {
            if (error?.status === 404) {
                throw redirect({
                    to: "/404",
                })
            }
            if (error instanceof Error && "redirect" in error) {
                throw error
            }
            throw redirect({
                to: "/login",
                search: {
                    redirect: `/prototype/${params.prototypeId}/play`,
                },
            })
        }
    },
    component: PlayComponent,
})

function PlayComponent() {
    const { prototypeId } = Route.useParams()
    const navigate = useNavigate()
    const [commands, setCommands] = useState<Record<string, unknown> | null>(
        null
    )
    const [error, setError] = useState<string | null>(null)
    const [terminalKey, setTerminalKey] = useState(0)

    // First check if prototype is public
    const { data: publicStatus } = useQuery({
        queryKey: ["prototype-public", prototypeId],
        queryFn: () => PrototypesService.checkPrototypePublic({ prototypeId }),
    })

    // Fetch prototype data using appropriate service based on public status
    const { data: prototype, isLoading } = useQuery({
        queryKey: ["prototype", prototypeId],
        queryFn: async () => {
            try {
                // If public, use public endpoint
                if (publicStatus?.is_public) {
                    return await PrototypesService.readPublicPrototype({
                        prototypeId,
                    })
                }
                // If private, use private endpoint
                return await PrototypesService.readPrototype({ prototypeId })
            } catch (error) {
                const apiError = error as ApiError
                if (apiError.status === 401 || apiError.status === 403) {
                    navigate({
                        to: "/login",
                        search: {
                            redirect: `/prototype/${prototypeId}/play`,
                        },
                    })
                }
                throw error
            }
        },
        enabled: publicStatus !== undefined, // Only run this query after we know the public status
        retry: (failureCount, error: any) => {
            if (error?.status === 403 || error?.status === 401) {
                return failureCount < 1
            }
            return failureCount < 3
        },
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

                if (
                    typeof parsedCommands !== "object" ||
                    parsedCommands === null
                ) {
                    throw new Error("Invalid commands format")
                }

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

    if (error) {
        return (
            <Center h="100vh" w="100vw">
                <Text color="red.500">Error: {error}</Text>
            </Center>
        )
    }

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
        <>
            <TerminalWrapper
                key={terminalKey}
                commands={commands}
                style={{
                    height: "100vh",
                    width: "100vw",
                }}
            />
        </>
    )
}

export default Route
