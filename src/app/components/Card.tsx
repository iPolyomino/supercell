import type { DataSnapshot } from "firebase/database";
import styled from "styled-components";

const CardsLayout = styled.div`
  display: grid;
  grid-row-gap: 8px;
`;

const CardLayout = styled.div`
  background-color: #ffffff;
  display: grid;
  grid-row-gap: 8px;
  grid-template-columns: repeat(3, 1fr);
  padding: 8px;
`;

const Comment = styled.span`
  overflow: hidden;
  grid-column-start: 1;
  grid-column-end: 4;
`;

type Message = { name?: string; time: string; id: string; comment: string };

const Card = ({ snapshots }: { snapshots: DataSnapshot[] }) => {
  return (
    <CardsLayout>
      {snapshots.map(v => {
        const message: Message = v.val();
        return (
        <CardLayout key={v.key}>
          <b>{message.name || "名無しさん"}</b>
          <time>{message.time}</time>
          <span>ID:{message.id}</span>
          <Comment>{message.comment}</Comment>
        </CardLayout>
        );
      })}
    </CardsLayout>
  );
};

export default Card;
