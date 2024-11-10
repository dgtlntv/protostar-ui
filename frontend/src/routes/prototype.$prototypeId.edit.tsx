import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/prototype/$prototypeId/edit")({
    component: RouteComponent,
})

function RouteComponent() {
    return "Hello /prototype/$prototypeId/edit!"
}
