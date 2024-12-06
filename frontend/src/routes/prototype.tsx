import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/prototype")({
    beforeLoad: ({ location }) => {
        // Check if the path ends with /edit or /play
        const isEditRoute = /\/prototype\/[^/]+\/edit$/.test(location.pathname)
        const isPlayRoute = /\/prototype\/[^/]+\/play$/.test(location.pathname)

        // If it's not an edit or play route, redirect to /prototype/all
        if (!isEditRoute && !isPlayRoute) {
            throw redirect({
                to: "/prototype/all",
            })
        }
    },
})
