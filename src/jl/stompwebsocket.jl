# AUTO GENERATED FILE - DO NOT EDIT

export stompwebsocket

"""
    stompwebsocket(;kwargs...)

A STOMPWebsocket component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `message` (Dict; optional): The message from subscription.
- `send` (Dict; optional): The message to send
- `subscribe` (String; optional): The topic to subscribe to.
- `url` (String; optional): The url to connect to
"""
function stompwebsocket(; kwargs...)
        available_props = Symbol[:id, :message, :send, :subscribe, :url]
        wild_props = Symbol[]
        return Component("stompwebsocket", "STOMPWebsocket", "stompws", available_props, wild_props; kwargs...)
end

