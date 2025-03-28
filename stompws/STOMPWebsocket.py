# AUTO GENERATED FILE - DO NOT EDIT

import typing  # noqa: F401
import numbers # noqa: F401
from typing_extensions import TypedDict, NotRequired, Literal # noqa: F401
from dash.development.base_component import Component, _explicitize_args
try:
    from dash.development.base_component import ComponentType # noqa: F401
except ImportError:
    ComponentType = typing.TypeVar("ComponentType", bound=Component)


class STOMPWebsocket(Component):
    """A STOMPWebsocket component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.

Keyword arguments:

- id (string; optional):
    The ID used to identify this component in Dash callbacks.

- message (dict; optional):
    The message from subscription.

- send (dict; optional):
    The message to send.

- subscribe (string; optional):
    The topic to subscribe to.

- url (string; optional):
    The url to connect to."""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'stompws'
    _type = 'STOMPWebsocket'

    @_explicitize_args
    def __init__(
        self,
        url: typing.Optional[str] = None,
        subscribe: typing.Optional[str] = None,
        message: typing.Optional[dict] = None,
        send: typing.Optional[dict] = None,
        id: typing.Optional[typing.Union[str, dict]] = None,
        **kwargs
    ):
        self._prop_names = ['id', 'message', 'send', 'subscribe', 'url']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'message', 'send', 'subscribe', 'url']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(STOMPWebsocket, self).__init__(**args)
