import { useState } from "react";
import styled from "styled-components";
import { Box, Heading, Button } from "rebass";
import { useList } from "react-firebase-hooks/database";

import App from "../components/App";
import firebase from "../lib/firebase";

const TextArea = styled.textarea`
  height: 5em;
  font-size: 1.2rem;
  resize: vertical;
`;

export default () => {
  const chatTextRef = firebase.database().ref("chat");
  const [snapshots, loading, error] = useList(chatTextRef);

  const [text, setText] = useState("");

  const send = () => {
    chatTextRef.push(text);
    setText("");
  };
  return (
    <App>
      <Heading fontSize={5} color="primary">
        chat room
      </Heading>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}
      {!loading && snapshots && (
        <ul>
          {snapshots.map(v => (
            <li>{v.val()}</li>
          ))}
        </ul>
      )}
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            align: "center",
            display: "grid",
            width: "600px",
            gridGap: 4,
            gridTemplateColumns: "1fr 100px"
          }}
        >
          <TextArea value={text} onChange={e => setText(e.target.value)} />
          <Button onClick={send}> send </Button>
        </Box>
      </Box>
    </App>
  );
};
