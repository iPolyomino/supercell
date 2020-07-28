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

const PageContents = styled.div``;

const App = ({ children }: { children?: any }) => {
  return (
    <>
      <Header />
      <Contents>
        <Navigation />
        <PageContents>{children}</PageContents>
      </Contents>
    </>
  );
};

export default App;
