import React, { useRef, useState } from "react";
import styled from "styled-components";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../lib/firebase";

const FormLayout = styled.div`
  display: grid;
  grid-auto-flow: column;
  margin: 16px;
`;

const Input = styled.input`
  width: 300px;
`;

const Button = styled.button`
  background-color: blue;
  font-size: 1.5rem;
  color: white;
`;

const Form = () => {
  const makeid = (length: number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [userid] = useState(() => makeid(16));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
  };
  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const send = async () => {
    if (inFlight.current) return;
    if (text.trim() === "" || text.length > 1000 || name.length > 40) return;
    inFlight.current = true;
    setSending(true);
    setError("");
    try {
      await httpsCallable(getFunctions(app), "postChat")({ name, comment: text, id: userid });
      setText("");
    } catch (failure) {
      const code = (failure as { code?: string }).code;
      setError(code === "functions/resource-exhausted"
        ? "同じ接続元からの投稿は10秒間隔でお願いします。"
        : "投稿できませんでした。時間をおいて再度お試しください。");
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  };
  return (
    <>
      <FormLayout>
        <div>
          <label htmlFor="name">名前</label>
          <input id="name" type="text" disabled={sending} maxLength={40} value={name} onChange={updateName} />
        </div>
        <div>
          <label htmlFor="comment">コメント</label>
          <Input id="comment" disabled={sending} maxLength={1000} value={text} onChange={updateText} />
        </div>
        <Button onClick={() => { void send(); }} disabled={sending}>{sending ? "送信中…" : "書き込む"}</Button>
      </FormLayout>
      {error && <p role="alert">{error}</p>}
      <p>荒らし対策のため、投稿に接続元のIPアドレスを紐付けて保存します。IPは公開されません。</p>
    </>
  );
};

export default Form;
