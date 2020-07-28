import React, { useState } from "react";
import styled from "styled-components";

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

const Form = props => {
  const chatTextRef = props.chatTextRef;

  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [userid, setUserid] = useState("");

  const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
  };
  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

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

  const send = () => {
    if (text === "") return;
    if (userid === "") {
      setUserid(makeid(16));
    }

    const message = {
      name,
      comment: text,
      time: new Date().toISOString(),
      id: userid
    };
    chatTextRef.push(message);

    setText("");
  };
  return (
    <FormLayout>
      <div>
        <label htmlFor="name">名前</label>
        <input id="name" type="text" value={name} onChange={updateName} />
      </div>
      <div>
        <label htmlFor="comment">コメント</label>
        <Input id="comment" value={text} onChange={updateText} />
      </div>
      <Button onClick={send}>書き込む</Button>
    </FormLayout>
  );
};

export default Form;
