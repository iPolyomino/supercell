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
  grid-column-start: 1;
  grid-column-end: 4;
`;

const Card = props => {
  const snapshots = props.snapshots;
  return (
    <CardsLayout>
      {snapshots.map(v => (
        <CardLayout key={v.key!}>
          <b>{v.val().name || "名無しさん"}</b>
          <time>{v.val().time}</time>
          <span>ID:{v.val().id}</span>
          <Comment>{v.val().comment}</Comment>
        </CardLayout>
      ))}
    </CardsLayout>
  );
};

export default Card;
