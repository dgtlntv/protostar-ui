import {
    Box,
    Container,
    Heading,
    HStack,
    Spinner,
    Text,
} from "@chakra-ui/react"
import Editor, { loader } from "@monaco-editor/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
//@ts-ignore
import type { DebouncedFunc } from "lodash-es"
//@ts-ignore
import { debounce } from "lodash-es"
import { useCallback, useEffect, useRef, useState } from "react"

import schema from "../../cli-schema/commands-schema.json"
import { PrototypesService } from "../../client"
import { isLoggedIn } from "../../hooks/useAuth"

// Setup Monaco JSON schema validation
loader.init().then((monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
            {
                uri: "http://myschema/prototype-schema.json",
                fileMatch: ["*"],
                schema,
            },
        ],
    })
})

type SaveStatus = "saved" | "saving" | "unsaved"

export const Route = createFileRoute("/_layout/prototype/$prototypeId/edit")({
    beforeLoad: async () => {
        if (!isLoggedIn()) {
            throw redirect({
                to: "/login",
            })
        }
    },
    component: EditComponent,
})

function EditComponent() {
    const { prototypeId } = Route.useParams()
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved")
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const editorContentRef = useRef<string>("")

    // Fetch prototype data
    const { data: prototype, isLoading } = useQuery({
        queryKey: ["prototype", prototypeId],
        queryFn: () => PrototypesService.readPrototype({ prototypeId }),
    })

    // Update prototype mutation
    const { mutate: updatePrototype } = useMutation({
        mutationFn: (content: Record<string, unknown>) =>
            PrototypesService.updatePrototype({
                prototypeId,
                requestBody: {
                    content,
                },
            }),
        onMutate: () => {
            setSaveStatus("saving")
        },
        onSuccess: () => {
            setSaveStatus("saved")
            setLastSaved(new Date())
        },
        onError: () => {
            setSaveStatus("unsaved")
        },
    })

    // Debounced save function
    const debouncedSave: DebouncedFunc<
        (content: Record<string, unknown>) => void
    > = useCallback(
        debounce(
            (content: Record<string, unknown>) => {
                updatePrototype(content)
            },
            5000,
            { maxWait: 10000 }
        ),
        [updatePrototype]
    )

    // Manual save function with debounce cancellation
    const saveContent = useCallback(() => {
        // Cancel any pending auto-save
        debouncedSave.cancel()

        try {
            const content = JSON.parse(editorContentRef.current)
            // Immediately save content
            updatePrototype(content)
        } catch (error) {
            console.error("Invalid JSON:", error)
        }
    }, [updatePrototype, debouncedSave])

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault()
                saveContent()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [saveContent])

    // Clean up debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSave.cancel()
        }
    }, [debouncedSave])

    // Handle editor changes
    const handleEditorChange = (value: string | undefined) => {
        if (!value) return

        editorContentRef.current = value

        try {
            const content = JSON.parse(value)
            // Only set unsaved status if we're not already saving
            if (saveStatus !== "saving") {
                setSaveStatus("unsaved")
            }
            debouncedSave(content)
        } catch (error) {
            // Don't save if JSON is invalid
            console.error("Invalid JSON:", error)
        }
    }

    // Format the last saved time
    const getLastSavedText = () => {
        if (!lastSaved) return ""
        const now = new Date()
        const diff = now.getTime() - lastSaved.getTime()

        if (diff < 60000) {
            return "Last saved less than a minute ago"
        } else if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000)
            return `Last saved ${minutes} minute${minutes > 1 ? "s" : ""} ago`
        } else {
            return `Last saved at ${lastSaved.toLocaleTimeString()}`
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    const initialValue = JSON.stringify(prototype?.content || {}, null, 2)

    return (
        <Container
            maxW="full"
            h="100vh"
            p={0}
            display="flex"
            flexDirection="column"
            overflow="hidden"
        >
            <Box p={0} flexShrink={0}>
                <Heading
                    size="lg"
                    textAlign={{ base: "center", md: "left" }}
                    py={12}
                    px={4}
                >
                    {prototype?.title}
                </Heading>
            </Box>
            <Box position="relative" flex={1} minH={0} px={4}>
                <HStack
                    position="absolute"
                    top={2}
                    right={4}
                    zIndex={1}
                    spacing={3}
                    bg="gray.800"
                    p={2}
                    borderRadius="md"
                >
                    {saveStatus === "saving" && (
                        <HStack>
                            <Spinner size="sm" />
                            <Text fontSize="sm" color="gray.300">
                                Saving...
                            </Text>
                        </HStack>
                    )}
                    {saveStatus === "saved" && (
                        <Text fontSize="sm" color="green.300">
                            ✓ Saved
                        </Text>
                    )}
                    {saveStatus === "unsaved" && (
                        <Text fontSize="sm" color="yellow.300">
                            Unsaved changes
                        </Text>
                    )}
                    {lastSaved && (
                        <Text fontSize="sm" color="gray.400">
                            {getLastSavedText()}
                        </Text>
                    )}
                </HStack>
                <Editor
                    height="100%"
                    defaultValue={initialValue}
                    defaultLanguage="json"
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        formatOnPaste: true,
                        formatOnType: true,
                        automaticLayout: true,
                    }}
                    theme="vs-light"
                />
            </Box>
        </Container>
    )
}
