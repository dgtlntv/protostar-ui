import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/prototype/$prototypeId/play")({
    component: RouteComponent,
})

function RouteComponent() {
    return "Hello /prototype/$prototypeId/play!"
}
