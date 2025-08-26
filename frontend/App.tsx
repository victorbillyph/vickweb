import React, { useEffect, useState } from "react";
const IP = "192.168.1.14";

type Message = {
  from: string;
  type: string;
  body?: string;
  data?: string;
  mimetype?: string;
};

const reset = () => {
  fetch(`http://${IP}:3001/logout`);
};

function App() {
  const [msg, setMsg] = useState<string>("Carregando...");
  const [url, setUrl] = useState(`http://${IP}:3001/qrcode`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [numeroS, numeroSet] = useState<number>(0);
  const [mensagemS, mensagemSet] = useState<string>("");

  const enviar = () => {
    fetch(`http://${IP}:3001/env`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero: numeroS, mensagem: mensagemS }),
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
    fetch(`http://${IP}:3001/ping`)
      .then((res) => res.json())
      .then((data) => setMsg(data.msg))
      .catch(() => setMsg("Erro while Connecting!"));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`http://${IP}:3001/msg`)
        .then((res) => res.json())
        .then((msgs: Message[]) => setMessages(msgs));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUrl(`http://${IP}:3001/qr?ts=${Date.now()}`);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#e0e0e0",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2e7d32" }}>
        VickWEB - Client
      </h1>
      <p style={{ textAlign: "center", color: "#1565c0" }}>
        Message API: {msg}
      </p>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src={url}
          alt="QrCode Whatsapp"
          style={{
            borderRadius: "15px",
            border: "3px solid #2e7d32",
            padding: "10px",
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={reset}
          style={{
            backgroundColor: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: "1rem",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              borderLeft: msg.type === "text" ? "5px solid #2e7d32" : "5px solid #1565c0",
            }}
          >
            <strong style={{ color: "#2e7d32" }}>{msg.from}:</strong>
            {msg.type === "text" && <p>{msg.body}</p>}
            {msg.type === "media" && msg.mimetype?.startsWith("image") && msg.data && (
              <img
                src={`data:${msg.mimetype};base64,${msg.data}`}
                alt="media"
                style={{ maxWidth: "100%", borderRadius: "10px" }}
              />
            )}
            {msg.type === "media" && msg.mimetype?.startsWith("audio") && msg.data && (
              (() => {
                const byteCharacters = atob(msg.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let j = 0; j < byteCharacters.length; j++) {
                  byteNumbers[j] = byteCharacters.charCodeAt(j);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: msg.mimetype });
                const audioUrl = URL.createObjectURL(blob);
                return <audio controls src={audioUrl} style={{ width: "100%" }} />;
              })()
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <input
          type="number"
          value={numeroS}
          onChange={(e) => numeroSet(Number(e.target.value))}
          placeholder="Number Whatsapp"
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #1565c0",
            outline: "none",
          }}
        />
        <input
          type="text"
          value={mensagemS}
          onChange={(e) => mensagemSet(e.target.value)}
          placeholder="Message Whatsapp"
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #1565c0",
            outline: "none",
          }}
        />
        <button
          onClick={enviar}
          style={{
            backgroundColor: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
        <button
          onClick={() => {
            fetch(`http://${IP}:3001/clear`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ clear: true })
            })
          }}
          style={{
            backgroundColor: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Wipe Messages
        </button>
      </div>
    </div>
  );
}

export default App;
