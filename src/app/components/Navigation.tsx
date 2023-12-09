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

const Navigation = ({ pathname }: { pathname?: any }) => (
  <nav>
    <Table>
      <tbody>
        <tr>
          <Td>
            <Link href="/" className={pathname === "/" ? "is-active" : ""}>
              Home
            </Link>
          </Td>
        </tr>
        <tr>
          <Td>
            <Link href="/about" className={pathname === "/about" ? "is-active" : ""}>
              About
            </Link>
          </Td>
        </tr>
        <tr>
          <Td>
            <Link href="/links" className={pathname === "/links" ? "is-active" : ""}>
              Links
            </Link>
          </Td>
        </tr>
      </tbody>
    </Table>
  </nav>
);

export default Navigation;
