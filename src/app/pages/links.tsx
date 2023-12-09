import styled from "styled-components";
import Link from "next/link";

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
          <Link href="https://polyomino.jp/">Hagi のホームページ</Link>
        </li>
        <li>
          <Link href="https://twitter.com/iPolyomino">Twitter</Link>
        </li>
        <li>
          <Link href="https://github.com/iPolyomino/supercell">
            このページのソースコード
          </Link>
        </li>
      </ul>
    </Contents>
  </App>
);

export default Links;
