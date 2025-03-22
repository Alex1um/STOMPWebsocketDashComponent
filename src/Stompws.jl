
module Stompws
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.5"

include("jl/stompwebsocket.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "stompws",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "stompws.min.js",
    external_url = nothing,
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "stompws.min.js.map",
    external_url = nothing,
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
