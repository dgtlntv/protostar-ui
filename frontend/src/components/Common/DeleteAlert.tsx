import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"
import { useForm } from "react-hook-form"

import { PrototypesService, UsersService } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"

interface DeleteProps {
    type: "User" | "Prototype"
    id: string
    isOpen: boolean
    onClose: () => void
}

const Delete = ({ type, id, isOpen, onClose }: DeleteProps) => {
    const queryClient = useQueryClient()
    const showToast = useCustomToast()
    const cancelRef = React.useRef<HTMLButtonElement | null>(null)
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = useForm()

    const deleteEntity = async (id: string) => {
        if (type === "Prototype") {
            await PrototypesService.deletePrototype({ prototypeId: id })
        } else if (type === "User") {
            await UsersService.deleteUser({ userId: id })
        } else {
            throw new Error(`Unexpected type: ${type}`)
        }
    }

    const mutation = useMutation({
        mutationFn: deleteEntity,
        onSuccess: () => {
            showToast(
                "Success",
                `The ${type.toLowerCase()} was deleted successfully.`,
                "success"
            )
            onClose()
        },
        onError: () => {
            showToast(
                "An error occurred.",
                `An error occurred while deleting the ${type.toLowerCase()}.`,
                "error"
            )
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [type === "Prototype" ? "prototypes" : "users"],
            })
        },
    })

    const onSubmit = async () => {
        mutation.mutate(id)
    }

    const getAlertMessage = () => {
        if (type === "User") {
            return (
                <>
                    <span>
                        All prototypes associated with this user will also be{" "}
                        <strong>permanently deleted. </strong>
                    </span>
                    Are you sure? You will not be able to undo this action.
                </>
            )
        }
        if (type === "Prototype") {
            return (
                <>
                    <span>
                        This will remove access for all collaborators and{" "}
                        <strong>permanently delete</strong> the prototype.{" "}
                    </span>
                    Are you sure? You will not be able to undo this action.
                </>
            )
        }
        return "Are you sure? You will not be able to undo this action."
    }

    return (
        <>
            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
                leastDestructiveRef={cancelRef}
                size={{ base: "sm", md: "md" }}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent
                        as="form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <AlertDialogHeader>Delete {type}</AlertDialogHeader>

                        <AlertDialogBody>{getAlertMessage()}</AlertDialogBody>

                        <AlertDialogFooter gap={3}>
                            <Button
                                variant="danger"
                                type="submit"
                                isLoading={isSubmitting}
                            >
                                Delete
                            </Button>
                            <Button
                                ref={cancelRef}
                                onClick={onClose}
                                isDisabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default Delete
