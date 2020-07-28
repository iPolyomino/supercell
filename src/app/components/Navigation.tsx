import Link from "next/link";
import styled from "styled-components";

const Table = styled.table`
  background-color: #000000;
  width: 100%;
  text-align: center;
`;

const Td = styled.td`
  background-color: #ffffc1;
  padding: 8px;
`;

export default ({ pathname }: { pathname?: any }) => (
  <nav>
    <Table>
      <tbody>
        <tr>
          <Td>
            <Link href="/">
              <a className={pathname === "/" ? "is-active" : ""}>Home</a>
            </Link>
          </Td>
        </tr>
        <tr>
          <Td>
            <Link href="/about">
              <a className={pathname === "/about" ? "is-active" : ""}>About</a>
            </Link>
          </Td>
        </tr>
      </tbody>
    </Table>
  </nav>
);
