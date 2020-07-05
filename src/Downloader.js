// DEPENDENCIES
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
// COMPONENTS
import CheckboxWrapper from "./Checkbox";
import FileTable from "./FileTable";
import { DownloadIcon } from "./download_icon.js";

/////////////// STYLED COMPONENTS ///////////////

const Container = styled.div`
  background-color: white;
  border: solid rgba(0, 0, 0, 0.2) 2px;
  border-radius: 4px;
  box-shadow: 2px 2px 6px #968686;
  width: 85%;
  margin: 30px 0;
  overflow-x: hidden;
`;

const ContainerHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  padding: 6px 16px 6px 10px;
`;

const DownloadContainer = styled.div`
  align-items: center;
  color: ${(props) => (props.active ? "black" : "rgba(0,0,0,0.2)")};
  cursor: ${(props) => (props.active ? "pointer" : "not-allowed")};
  display: flex;

  .icon {
    fill: ${(props) => (props.active ? "black" : "rgba(0,0,0,0.2)")};
  }
`;

const Dialog = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DialogBody = styled.div`
  background-color: white;
  width: 50%;
  max-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  padding: 20px 0;
  margin: 6px 0;
  overflow-y: scroll;
  position: relative;

  .title {
    font-size: 18px;
    margin-bottom: 16px;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  text-align: center;
`;

const CloseButton = styled.div`
  border: 1px solid;
  padding: 8px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

/////////////// END ///////////////

const Downloader = ({ fileData }) => {
  let selected = {};
  let statuses = {};
  fileData.forEach((elem) => {
    selected[elem.name] = false;
    statuses[elem.name] = elem.status;
  });

  const [showDialog, toggleDialog] = useState(false);
  const [checkBoxes, setState] = useState(selected);
  const [numSelected, changeNumSelected] = useState(0);
  const [isDownloadable, setDownloadable] = useState(false);

  useEffect(() => {
    updateTotalSelected();
    setDownloadable(checkDownloadable());
  });

  const handleCheck = (name) => {
    setState({
      ...checkBoxes,
      [name]: !checkBoxes[name],
    });
  };

  const updateTotalSelected = () => {
    let numChecks = 0;
    for (let key in checkBoxes) {
      if (checkBoxes[key]) numChecks++;
    }
    changeNumSelected(numChecks);
  };

  const handleSelectAll = () => {
    const bool = numSelected !== Object.keys(checkBoxes).length;
    let tempObj = { ...checkBoxes };
    for (let key in tempObj) {
      tempObj[key] = bool;
    }
    setState(tempObj);
  };

  const checkDownloadable = () => {
    if (numSelected === 0) return false;

    for (const [key] of Object.entries(checkBoxes)) {
      if (checkBoxes[key] && statuses[key] !== "available") return false;
    }
    return true;
  };

  const getDownloadInfo = () => {
    return fileData.filter((elem) => checkBoxes[elem.name]);
  };

  let label = numSelected ? `Selected ${numSelected}` : "None Selected";

  return (
    <Container>
      <ContainerHeader>
        <CheckboxWrapper
          selectAll
          dataTest='select-all'
          label={label}
          checked={!!numSelected}
          isAllSelected={numSelected === fileData.length}
          onChange={() => handleSelectAll()}
        />
        <DownloadContainer
          data-test='download'
          onClick={isDownloadable ? () => toggleDialog(true) : null}
          active={isDownloadable}
        >
          <DownloadIcon />
          <span style={{ marginLeft: "8px" }}>Download selected</span>
        </DownloadContainer>
      </ContainerHeader>
      <FileTable
        fileData={fileData}
        checkBoxes={checkBoxes}
        handleCheck={handleCheck}
      />
      {showDialog && (
        <Dialog>
          <DialogBody data-test='dialog'>
            <div className='title'>You have downloaded these files:</div>
            <div>
              {getDownloadInfo().map((elem, index) => (
                <Item key={index}>
                  <span>
                    {elem.name} for {elem.device}
                  </span>
                  <span>from "{elem.path}"</span>
                </Item>
              ))}
            </div>
            <CloseButton onClick={() => toggleDialog(false)}>Close</CloseButton>
          </DialogBody>
        </Dialog>
      )}
    </Container>
  );
};

export default Downloader;
