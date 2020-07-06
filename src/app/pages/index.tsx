import { useEffect, useState } from "react";
import styled from "styled-components";

import App from "../components/App";
import firebase from "../lib/firebase";

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solit palevioletred;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;
`;

const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;

export default () => {
  const countRef = firebase.database().ref("count");

  const [count, setCount] = useState(0);
  useEffect(() => {
    countRef.set({ click: count });
  });

  const countup = () => setCount(count + 1);

  return (
    <App>
      <p>Index Page</p>
      <Input defaultValue={count} type="text" />
      <Button onClick={countup}>send</Button>
    </App>
  );
};
