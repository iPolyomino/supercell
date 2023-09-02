import { useList } from "react-firebase-hooks/database";
import { ref } from "firebase/database"

import App from "../components/App";
import Card from "../components/Card";
import Form from "../components/Form";
import { db } from "../lib/firebase";

const Index = () => {
  const chatTextRef = ref(db, "chat");
  const [snapshots, loading, error] = useList(chatTextRef);

  return (
    <App>
      <article>
        {error && <strong>Error: {error.message}</strong>}
        {loading && <p>Loading...</p>}
        {!loading && snapshots && <Card snapshots={snapshots} />}
      </article>
      <Form />
    </App>
  );
};

export default Index;
