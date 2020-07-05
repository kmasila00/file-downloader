// DEPENDENCIES
import React from "react";
import styled from "@emotion/styled";
// COMPONENTS
import CheckboxWrapper from "./Checkbox";

/////////////// STYLED COMPONENTS ///////////////

const Table = styled.table`
  border-collapse: collapse;
  padding: 0 8px;
  text-align: left;
  width: 100%;

  th {
    padding: 16px 0;
  }

  .highlighted {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const TableRow = styled.tr`
  cursor: pointer;

  :hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  td {
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    position: relative;
  }

  .capitalize {
    text-transform: capitalize;
  }

  .available::before {
    position: absolute;
    content: "";
    border-radius: 25px;
    height: 12px;
    width: 12px;
    margin-right: 0.5rem;
    background-color: #68e683;
    transform: translate(-20px, 3px);
  }
`;

/////////////// END ///////////////

const FileTable = ({ fileData, checkBoxes, handleCheck }) => (
  <Table>
    <thead>
      <tr>
        <th />
        <th>Name</th>
        <th>Device</th>
        <th>Path</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {fileData.map((elem, index) => (
        <TableRow
          className={`${checkBoxes[elem.name] ? "highlighted" : ""}`}
          onClick={() => handleCheck(elem.name)}
          key={index}
        >
          <td style={{ paddingLeft: "10px" }}>
            <CheckboxWrapper
              dataTest={elem.status}
              checked={checkBoxes[elem.name]}
              onChange={() => handleCheck(elem.name)}
            />
          </td>
          <td data-test='name'>{elem.name}</td>
          <td data-test='device' className='capitalize'>
            {elem.device}
          </td>
          <td data-test='path'>{elem.path}</td>
          <td
            data-test='status'
            className={`capitalize ${
              elem.status === "available" ? "available" : ""
            }`}
          >
            {elem.status}
          </td>
        </TableRow>
      ))}
    </tbody>
  </Table>
);

export default FileTable;
