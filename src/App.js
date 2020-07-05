// DEPENDENCIES
import React from "react";
import styled from "@emotion/styled";
import { hot } from "react-hot-loader/root";
// COMPONENTS
import Downloader from "./Downloader";
// HELPERS
import fileData from "./data";

/////////////// STYLED COMPONENTS ///////////////

const AppContainer = styled.div`
  font-size: 14px;
`;

const Home = styled.div`
  align-items: center;
  background-color: white;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
`;

/////////////// END ///////////////

function App() {
  return (
    <AppContainer>
      <Home>
        <Downloader fileData={fileData} />
      </Home>
    </AppContainer>
  );
}

export default hot(App);
