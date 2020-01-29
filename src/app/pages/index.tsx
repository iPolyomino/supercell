import styled, { css } from "styled-components";
import App from "../components/App";

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solit palevioletred;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;

  ${(props) =>
    props.primary &&
    css`
      background: palevioletred;
      color: wite;
    `}
`;

export default () => (
  <App>
    <p>Index Page</p>
    <Button>Button</Button>
  </App>
);
