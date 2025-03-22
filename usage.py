import stompws
from dash import Dash, callback, html, Input, Output
import json

app = Dash(__name__)

app.layout = html.Div([
    stompws.STOMPWebsocket(
        id='input',
        url='ws://localhost:15674/ws',
        subscribe="/topic/device.*.*",
    ),
    html.Div(id='output')
])


@callback(Output('output', 'children'), Input('input', 'message'))
def display_output(value):
    return json.dumps(value)


if __name__ == '__main__':
    app.run(debug=True)
