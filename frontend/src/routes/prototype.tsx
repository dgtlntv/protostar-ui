import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/prototype")({
    beforeLoad: () => {
        throw redirect({
            to: "/prototype/all",
        })
    },
})
