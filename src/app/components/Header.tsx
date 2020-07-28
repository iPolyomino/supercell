import styled from "styled-components";

const Header = styled.header`
  text-align: center;
  position: relative;
`;

const H1 = styled.h1`
  color: #000000;
  position: absolute;
  top: 0;
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.2)
  );
`;

const Img = styled.img`
  height: 200px;
`;

export default () => (
  <Header>
    <Img src="./tree.png" />
    <H1>ちょっとちゃっと</H1>
  </Header>
);
