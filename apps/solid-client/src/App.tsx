import { Accessor, Component, For, createEffect, createSignal } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";

const ReadyStateDot: Component<{ readyState: Accessor<number | undefined> }> = (
  props
) => {
  const ReadyStates = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
  };
  return (
    <>
      {props.readyState() === ReadyStates.OPEN && (
        <div
          style={{
            height: "10px",
            width: "10px",
            "background-color": "yellowgreen",
            "border-radius": "50%",
          }}
        ></div>
      )}
      {props.readyState() === ReadyStates.CLOSED && (
        <div
          style={{
            height: "10px",
            width: "10px",
            "background-color": "red",
            "border-radius": "50%",
          }}
        ></div>
      )}
    </>
  );
};

type Messages = {
  username: string;
  message: string;
};

const App: Component = () => {
  const [username, setUsername] = createSignal("");
  const [ws, setWs] = createSignal<WebSocket>();
  const [wsReadyState, setWsReadyState] = createSignal<number>();
  const [message, setMessage] = createSignal<string>("");
  const [messages, setMessages] = createSignal<Messages[]>([]);
  const joinChat = () => {
    console.log(username());

    if (username().length > 0 && !ws()) {
      const ws = new WebSocket("ws://localhost:8887");
      setWs(ws);
    }
  };

  setInterval(() => {
    if (ws()) {
      if (wsReadyState() === undefined) {
        ws()?.send(
          JSON.stringify({
            username: username(),
          })
        );
      }
      ws()?.addEventListener("message", receiveMessage);
      setWsReadyState(ws()?.readyState);
    } else {
      setWsReadyState(undefined);
    }
  }, 500);
  const receiveMessage = (event: MessageEvent) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.message) {
      let messageTemp = [...messages(), parsedData];
      setMessages(messageTemp);
    }
  };
  const sendMessage = () => {
    ws()?.send(
      JSON.stringify({
        username: username(),
        message: message(),
      })
    );
    setMessage("");
  };

  createEffect(() => console.log(messages()));

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        {ws() && <p>{username()}</p>}
        {ws() && <ReadyStateDot readyState={wsReadyState} />}
      </header>

      {!ws() && (
        <div class={styles.joinChat}>
          <label>Enter your username:</label>
          <input
            value={username()}
            onKeyUp={(e) => setUsername((e.target as HTMLInputElement).value)}
          ></input>
          <button onClick={() => joinChat()}>Join</button>
        </div>
      )}

      {ws() && (
        <div class={styles.chatRoom}>
          <div class={styles.messages}>
            <For each={messages()}>
              {(userMessage, i) => (
                <div
                  class={
                    userMessage.username === username()
                      ? styles.sent
                      : styles.received
                  }
                >
                  {userMessage.username}: {userMessage.message}
                </div>
              )}
            </For>
          </div>
          <div>
            <input
              value={message()}
              onKeyUp={(e) => setMessage((e.target as HTMLInputElement).value)}
            ></input>
            <button onClick={() => sendMessage()}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
