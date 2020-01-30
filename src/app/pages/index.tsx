import { useState, useEffect } from "react";
import styled, { css } from "styled-components";

import firebase from "../lib/firebase";
import App from "../components/App";

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solit palevioletred;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;

  ${props =>
    props.primary &&
    css`
      background: palevioletred;
      color: wite;
    `}
`;

export default () => {
  const countRef = firebase.database().ref("count");

  countRef.once("value", snapshot => {
    const snpVal = snapshot.val();
    const totalCount = snpVal["click"];
    console.log(`firebase:${totalCount}`);
  });

  const [count, setCount] = useState(0);
  useEffect(() => {
    countRef.set({ click: count });
  });

  return (
    <App>
      <p>Index Page</p>
      <Button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Button was clicked {count} times.
      </Button>
    </App>
  );
};
