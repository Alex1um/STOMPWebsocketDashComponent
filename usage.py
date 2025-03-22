import stompws
from dash import Dash, callback, html, Input, Output
import json

app = Dash(__name__)

app.layout = html.Div(
    [
        stompws.STOMPWebsocket(
            id="input",
            url="ws://localhost:15674/ws",
        ),
        html.Button("subscribe", id="subscribe"),
        html.Button("unsubscribe", id="unsubscribe"),
        html.Div(id="output"),
    ]
)


@callback(
    Output("input", "subscribe", allow_duplicate=True),
    Input("subscribe", "n_clicks"),
    prevent_initial_call=True,
)
def subscribe(value):
    return "/topic/device.*.*"


@callback(
    Output("input", "subscribe", allow_duplicate=True),
    Output("output", "children", allow_duplicate=True),
    Input("unsubscribe", "n_clicks"),
    prevent_initial_call=True,
)
def unsubscribe(value):
    return None, None


@callback(Output("output", "children", allow_duplicate=True), Input("input", "message"), prevent_initial_call=True)
def display_output(value):
    return json.dumps(value)


if __name__ == "__main__":
    app.run(debug=True)
