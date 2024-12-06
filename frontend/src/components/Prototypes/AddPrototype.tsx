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
    type PrototypeCreate,
    PrototypesService,
} from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"

interface AddPrototypeProps {
    isOpen: boolean
    onClose: () => void
}

const AddPrototype = ({ isOpen, onClose }: AddPrototypeProps) => {
    const queryClient = useQueryClient()
    const showToast = useCustomToast()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PrototypeCreate>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            title: "",
            description: "",
            content: {},
            visibility: "private",
        },
    })

    const mutation = useMutation({
        mutationFn: (data: PrototypeCreate) =>
            PrototypesService.createPrototype({ requestBody: data }),
        onSuccess: () => {
            showToast("Success!", "Prototype created successfully.", "success")
            reset()
            onClose()
        },
        onError: (err: ApiError) => {
            handleError(err, showToast)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["prototypes"] })
        },
    })

    const onSubmit: SubmitHandler<PrototypeCreate> = (data) => {
        // Ensure content is a valid JSON object
        const formattedData = {
            ...data,
            content: {}, // You might want to handle content differently based on your needs
        }
        mutation.mutate(formattedData)
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
                    <ModalHeader>Add Prototype</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isRequired isInvalid={!!errors.title}>
                            <FormLabel htmlFor="title">Title</FormLabel>
                            <Input
                                id="title"
                                {...register("title", {
                                    required: "Title is required.",
                                })}
                                placeholder="Title"
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

                        <FormControl
                            mt={4}
                            isRequired
                            isInvalid={!!errors.visibility}
                        >
                            <FormLabel htmlFor="visibility">
                                Visibility
                            </FormLabel>
                            <Select
                                id="visibility"
                                {...register("visibility", {
                                    required: "Visibility is required.",
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
                        >
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddPrototype
