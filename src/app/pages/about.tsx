import styled from "styled-components";

import App from "../components/App";

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 8px;
`;

const ClapButton = styled.button`
  background-color: #000000;
  font-size: 1.5rem;
  color: white;
  width: 100px;
`;

const About = () => (
  <App>
    <Contents>
      <h2>ちょっとちゃっとについて</h2>
      <article>
        <p>
          「ちょっとちゃっと」とは、
          <a href="https://twitter.com/iPolyomino"> Hagi </a>
          が作成したちょっとチャットができるアプリケーションです。Next.js と
          Firebase Realtime Database
          で実装しました。勉強しながら作成したので、もしかしたら不具合があるかもしれないけど許して(´・ω・｀)
        </p>
        <p>
          ソースコードは
          <a href="https://github.com/iPolyomino/supercell">こちら</a>から。
          プルリク待ってます＼(^o^)／
        </p>
        <p>
          <ClapButton>拍手</ClapButton> ←押してもらえると励みになります♪
        </p>
      </article>
    </Contents>
  </App>
);

export default About;
