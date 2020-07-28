import { useList } from "react-firebase-hooks/database";

import App from "../components/App";
import Card from "../components/Card";
import Form from "../components/Form";
import firebase from "../lib/firebase";

export default () => {
  const chatTextRef = firebase.database().ref("chat");
  const [snapshots, loading, error] = useList(chatTextRef);

  return (
    <App>
      <article>
        {error && <strong>Error: {error}</strong>}
        {loading && <p>Loading...</p>}
        {!loading && snapshots && <Card snapshots={snapshots} />}
      </article>
      <Form chatTextRef={chatTextRef} />※ 無断転用転載禁止
    </App>
  );
};
