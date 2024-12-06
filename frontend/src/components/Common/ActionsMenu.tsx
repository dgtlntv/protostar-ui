import {
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useDisclosure,
} from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { FiEdit, FiTrash } from "react-icons/fi"

import type { PrototypePublic, UserPublic } from "../../client"
import EditUser from "../Admin/EditUser"
import EditPrototype from "../Prototypes/EditPrototype"
import Delete from "./DeleteAlert"

type ValueType = PrototypePublic | UserPublic

interface ActionsMenuProps {
    type: "User" | "Prototype"
    value: ValueType
    disabled?: boolean
}

function isPrototype(value: ValueType): value is PrototypePublic {
    return "visibility" in value
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
    const editModal = useDisclosure()
    const deleteModal = useDisclosure()

    return (
        <>
            <Menu>
                <MenuButton
                    isDisabled={disabled}
                    as={Button}
                    rightIcon={<BsThreeDotsVertical />}
                    variant="unstyled"
                />
                <MenuList>
                    <MenuItem
                        onClick={editModal.onOpen}
                        icon={<FiEdit fontSize="16px" />}
                    >
                        Edit {type}
                    </MenuItem>
                    <MenuItem
                        onClick={deleteModal.onOpen}
                        icon={<FiTrash fontSize="16px" />}
                        color="ui.danger"
                    >
                        Delete {type}
                    </MenuItem>
                </MenuList>
            </Menu>

            {type === "User" ? (
                <EditUser
                    user={value as UserPublic}
                    isOpen={editModal.isOpen}
                    onClose={editModal.onClose}
                />
            ) : (
                <EditPrototype
                    prototype={
                        isPrototype(value) ? value : (undefined as never)
                    }
                    isOpen={editModal.isOpen}
                    onClose={editModal.onClose}
                />
            )}

            <Delete
                type={type}
                id={value.id}
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
            />
        </>
    )
}

export default ActionsMenu
