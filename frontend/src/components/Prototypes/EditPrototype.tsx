import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Textarea,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import {
    type ApiError,
    type PrototypePublic,
    type PrototypeUpdate,
    PrototypesService,
} from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"

interface EditPrototypeProps {
    prototype: PrototypePublic
    isOpen: boolean
    onClose: () => void
}

const EditPrototype = ({ prototype, isOpen, onClose }: EditPrototypeProps) => {
    const queryClient = useQueryClient()
    const showToast = useCustomToast()
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors, isDirty },
    } = useForm<PrototypeUpdate>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            title: prototype.title,
            description: prototype.description,
            visibility: prototype.visibility,
            content: prototype.content,
        },
    })

    const mutation = useMutation({
        mutationFn: (data: PrototypeUpdate) =>
            PrototypesService.updatePrototype({
                prototypeId: prototype.id,
                requestBody: data,
            }),
        onSuccess: () => {
            showToast("Success!", "Prototype updated successfully.", "success")
            onClose()
        },
        onError: (err: ApiError) => {
            handleError(err, showToast)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["prototypes"] })
        },
    })

    const onSubmit: SubmitHandler<PrototypeUpdate> = async (data) => {
        // Ensure we only send modified fields
        const updatedFields: Partial<PrototypeUpdate> = {}
        if (data.title !== prototype.title) updatedFields.title = data.title
        if (data.description !== prototype.description)
            updatedFields.description = data.description
        if (data.visibility !== prototype.visibility)
            updatedFields.visibility = data.visibility
        if (
            JSON.stringify(data.content) !== JSON.stringify(prototype.content)
        ) {
            updatedFields.content = data.content
        }

        mutation.mutate(updatedFields)
    }

    const onCancel = () => {
        reset()
        onClose()
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={{ base: "sm", md: "md" }}
                isCentered
            >
                <ModalOverlay />
                <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader>Edit Prototype</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isInvalid={!!errors.title}>
                            <FormLabel htmlFor="title">Title</FormLabel>
                            <Input
                                id="title"
                                {...register("title", {
                                    required: "Title is required",
                                })}
                                type="text"
                            />
                            {errors.title && (
                                <FormErrorMessage>
                                    {errors.title.message}
                                </FormErrorMessage>
                            )}
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel htmlFor="description">
                                Description
                            </FormLabel>
                            <Textarea
                                id="description"
                                {...register("description")}
                                placeholder="Description"
                                resize="vertical"
                            />
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.visibility}>
                            <FormLabel htmlFor="visibility">
                                Visibility
                            </FormLabel>
                            <Select
                                id="visibility"
                                {...register("visibility", {
                                    required: "Visibility is required",
                                })}
                            >
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </Select>
                            {errors.visibility && (
                                <FormErrorMessage>
                                    {errors.visibility.message}
                                </FormErrorMessage>
                            )}
                        </FormControl>
                    </ModalBody>

                    <ModalFooter gap={3}>
                        <Button
                            variant="primary"
                            type="submit"
                            isLoading={isSubmitting}
                            isDisabled={!isDirty}
                        >
                            Save
                        </Button>
                        <Button onClick={onCancel}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default EditPrototype
