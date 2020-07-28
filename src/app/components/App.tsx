import React from "react";
import styled from "styled-components";

import Header from "./Header";
import Navigation from "./Navigation";

const Contents = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 100px 1fr;
  grid-column-gap: 8px;
  background-color: skyblue;
  width: 990px;
  margin: auto;
  padding: 16px;
`;

const Footer = styled.footer`
  background-color: skyblue;
  width: 990px;
  margin: auto;
  padding: 16px;
  text-align: center;
`;

const App = ({ children }: { children?: any }) => {
  return (
    <>
      <Header />
      <Contents>
        <Navigation />
        <div>{children}</div>
      </Contents>
      <Footer>
        ※ 無断転用転載禁止
        <br />
        (c) 2020 Hagi All right reserved.
      </Footer>
    </>
  );
};

export default App;
