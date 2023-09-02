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

const Navigation = () => (
  <nav>
    <Table>
      <tbody>
        <tr>
          <Td>
            <Link href="/">
              Home
            </Link>
          </Td>
        </tr>
        <tr>
          <Td>
            <Link href="/about">
              About
            </Link>
          </Td>
        </tr>
        <tr>
          <Td>
            <Link href="/links">
              Links
            </Link>
          </Td>
        </tr>
      </tbody>
    </Table>
  </nav>
);

export default Navigation;
