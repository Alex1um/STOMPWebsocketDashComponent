import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import PropTypes from 'prop-types';
import { Client } from '@stomp/stompjs';

const cleanSubscribers = (
  url,
  subscriber,
  clearSocketIoPingInterval,
) => {
  return () => {
    removeSubscriber(url, subscriber);
    if (!hasSubscribers(url)) {
      try {
        const socketLike = sharedWebSockets[url];
        if (socketLike instanceof WebSocket) {
          socketLike.onclose = (event: WebSocketEventMap['close']) => {
            if (optionsRef.current.onClose) {
              optionsRef.current.onClose(event);
            }
            setReadyState(ReadyState.CLOSED);
          };
        }
        socketLike.close();
      } catch (e) {

      }
      if (clearSocketIoPingInterval) clearSocketIoPingInterval();

      delete sharedWebSockets[url];
    }
  }
};


const createOrJoinSocket = (
  stompClientRef,
  url,
  setLastMessage,
  startRef,
  sendMessage,
) => {
  if (optionsRef.current.share) {
    let clearSocketIoPingInterval: ((() => void) | null) = null;
    if (sharedWebSockets[url] === undefined) {
      sharedWebSockets[url] = optionsRef.current.eventSourceOptions ?
        new EventSource(url, optionsRef.current.eventSourceOptions) :
        new WebSocket(url, optionsRef.current.protocols);
      webSocketRef.current = sharedWebSockets[url];
      setReadyState(ReadyState.CONNECTING);
      clearSocketIoPingInterval = attachSharedListeners(
        sharedWebSockets[url],
        url,
        optionsRef,
        sendMessage,
      );
    } else {
      webSocketRef.current = sharedWebSockets[url];
      setReadyState(sharedWebSockets[url].readyState);
    }

    const subscriber: Subscriber = {
      setLastMessage,
      setReadyState,
      optionsRef,
      reconnectCount,
      lastMessageTime,
      reconnect: startRef,
    };

    addSubscriber(url, subscriber);

    return cleanSubscribers(
      url,
      subscriber,
      optionsRef,
      setReadyState,
      clearSocketIoPingInterval,
    );
  } else {
    webSocketRef.current = optionsRef.current.eventSourceOptions ?
      new EventSource(url, optionsRef.current.eventSourceOptions) :
      new WebSocket(url, optionsRef.current.protocols);
    setReadyState(ReadyState.CONNECTING);
    if (!webSocketRef.current) {
      throw new Error('WebSocket failed to be created');
    }

    return attachListeners(
      webSocketRef.current,
      {
        setLastMessage,
        setReadyState
      },
      optionsRef,
      startRef.current,
      reconnectCount,
      lastMessageTime,
      sendMessage,
    );
  }
};


function useStompJs(url) {
  const [lastMessage, setLastMessage] = useState(null);
  const stompClientRef = useRef(null);
  const startRef = useRef(() => void 0);
  const convertedUrl = useRef(null);

  const sendMessage = useCallback((message) => {
    if (message && stompClientRef.current?.connected) {
      const { destination, body, headers = {} } = message;
      stompClientRef.current.publish({
        destination,
        body: JSON.stringify(body),
        headers
      });
    }
  }, []);

  const sendJsonMessage = useCallback((message) => {
    message.body = JSON.stringify(message.body);
    sendMessage(message);
  }, [sendMessage]);

  useEffect(() => {
    if (url !== null) {
      let removeListeners;
      let expectClose = false;
      let createOrJoin = true;

      const start = async () => {
        convertedUrl.current = url;

        const protectedSetLastMessage = (message) => {
          if (!expectClose) {
            flushSync(() => setLastMessage(message));
          }
        };

        if (createOrJoin) {
          removeListeners = createOrJoinSocket(
            stompClientRef,
            convertedUrl.current,
            protectedSetLastMessage,
            startRef,
            sendMessage,
          );
        }
      };

      startRef.current = () => {
        if (!expectClose) {
          removeListeners?.();
          start();
        }
      };

      start();
      return () => {
        expectClose = true;
        createOrJoin = false;
        removeListeners?.();
        setLastMessage(null);
      };
    }
  }, [url, sendMessage]);

  return {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    getWebSocket,
  };
}


/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
const STOMPWebsocket = (props) => {
  const {id, setProps, subscribe, send, url, message} = props;
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const currentTopicRef = useRef('');
  const [rawMessage, setRawMessage] = useState();
    
  const stompClient = new Client({
    brokerURL: url,
    reconnectDelay: 5000,
    logRawCommunication: false,
  });

  stompClient.onConnect = () => {
    console.log('STOMP Connected');
    // Subscribe to initial topic if exists
    if (subscribe) {
      subscribeToTopic(subscribe);
    }
  };

  stompClient.activate();
  clientRef.current = stompClient;

  // Initialize STOMP client once when component mounts
  useEffect(() => {
    // const stompClient = new Client({
    //   brokerURL: url,
    //   reconnectDelay: 5000,
    //   logRawCommunication: false,
    // });

    // stompClient.onConnect = () => {
    //   console.log('STOMP Connected');
    //   // Subscribe to initial topic if exists
    //   if (subscribe) {
    //     subscribeToTopic(subscribe);
    //   }
    // };

    // stompClient.activate();
    // clientRef.current = stompClient;

    // return () => {
    //   stompClient.deactivate();
    //   console.log('STOMP Disconnected');
    // };
  }, []); // Empty dependency array ensures this runs only once

  // Handle subscription changes
  useEffect(() => {
    if (subscribe !== currentTopicRef.current) {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        currentTopicRef.current = null;
        console.log(`Unsubscribed from ${currentTopicRef.current}`);
      }
      
      if (subscribe) {
        subscribeToTopic(subscribe);
      }
    }
  }, [subscribe]);

  // Handle send property changes
  useEffect(() => {
    if (send && clientRef.current?.connected) {
      const { destination, body, headers = {} } = send;
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
        headers
      });
      // Reset send property after sending
      setProps({ send: null });
    }
  }, [send]);

  const subscribeToTopic = (topic) => {
    if (clientRef.current?.connected) {
      subscriptionRef.current = clientRef.current.subscribe(
        topic,
        (message) => handleMessage(message)
      );
      currentTopicRef.current = topic;
      console.log(`Subscribed to ${topic}`);
    }
  };

  const handleMessage = (rawMessage) => {
    try {
      const parsedMessage = JSON.parse(rawMessage.body);
      setRawMessage({"data": rawMessage});
    } catch (error) {
      console.error('Message parsing error:', error);
      setRawMessage(null);
      // setProps({ message: null });
    }
  };

  useEffect(() => {
    if (rawMessage) {
      let data = rawMessage.data;
      setProps({ message: data });
      return () => {
        data.destroy();
      }
    }
  }, [rawMessage]);
  
  return <div />;
};

STOMPWebsocket.propTypes = {
    /**
     * The url to connect to
     */
    url: PropTypes.string,

    /**
     * The topic to subscribe to.
     */
    subscribe: PropTypes.string,

    /**
     * The message from subscription.
     */
    message: PropTypes.object,

    /**
     * The message to send
     */
    send: PropTypes.object,

    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func
};

export default STOMPWebsocket;
