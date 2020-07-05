import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@material-ui/core/Checkbox";

/////////////// STYLED COMPONENTS ///////////////

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  padding: 6px 0;

  .label {
    padding-left: 20px;
  }
`;

/////////////// END ///////////////

const CheckboxWrapper = ({
  label,
  checked,
  onChange,
  selectAll,
  isAllSelected,
  ...props
}) => {
  return (
    <Wrapper data-test={props.dataTest}>
      <Checkbox
        checked={checked}
        onChange={onChange}
        indeterminate={isAllSelected ? null : selectAll && checked}
        color='primary'
      />
      {label && <span className='label'>{label}</span>}
    </Wrapper>
  );
};

export default CheckboxWrapper;
