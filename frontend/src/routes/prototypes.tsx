import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/prototypes")({
    beforeLoad: () => {
        throw redirect({
            to: "/prototype/all",
        })
    },
})
