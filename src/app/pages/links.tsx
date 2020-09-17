import styled from "styled-components";

import App from "../components/App";

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 8px;
`;

const Links = () => (
  <App>
    <Contents>
      <h2>相互リンク</h2>
      <ul>
        <li>
          <a href="https://polyomino.jp/">Hagi のホームページ</a>
        </li>
        <li>
          <a href="https://twitter.com/iPolyomino">Twitter</a>
        </li>
        <li>
          <a href="https://github.com/iPolyomino/supercell">
            このページのソースコード
          </a>
        </li>
      </ul>
    </Contents>
  </App>
);

export default Links;
