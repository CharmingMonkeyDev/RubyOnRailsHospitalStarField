// Library Imports
import { IconButton, MenuItem, TextField } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  cptCodeOptions: Array<any>;
  updateClaimObjState: (newClaimObjs: any) => void;
  handleCPTCodeChange: (
    claimInfo: any,
    cptCode: string,
    isManual: boolean
  ) => void;
  claimInfoObjs: Array<any>;
  claimInfo: any;
}

const CptCodeField: React.FC<Props> = (props: any) => {
  const { cptCodeOptions, handleCPTCodeChange, claimInfo } = props;
  const [manualCptCode, setManualCptCode] = useState(claimInfo.cptCode);

  const customCptCodeOption = {
    id: "manual",
    sanitized_name: "Manual CPT Code",
  };

  const cptCodes = cptCodeOptions.map((cptCode) => {
    return (
      <MenuItem key={cptCode?.id} value={cptCode?.sanitized_name}>
        {cptCode?.sanitized_name}
      </MenuItem>
    );
  });

  return <>
    {claimInfo.cptCode === customCptCodeOption.sanitized_name ||
    claimInfo.isManualCptCode == true ? (
      <TextField
        id="encounter_type"
        size="small"
        value={manualCptCode}
        className="field field-2"
        required
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={(event) =>
                  handleCPTCodeChange(
                    claimInfo,
                    cptCodeOptions[1].sanitized_name
                  )
                }
                size="large">
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onChange={(event) => {
          setManualCptCode(event.target.value);
        }}
        onBlur={(event) => {
          handleCPTCodeChange(claimInfo, event.target.value, true);
        }}
      />
    ) : (
      <TextField
        id="encounter_type"
        size="small"
        value={claimInfo.cptCode}
        className="field field-2"
        required
        variant="outlined"
        select={true}
        onChange={(event) => {
          handleCPTCodeChange(claimInfo, event.target.value, false);
        }}
      >
        <MenuItem
          key={customCptCodeOption?.id}
          value={customCptCodeOption?.sanitized_name}
        >
          {customCptCodeOption?.sanitized_name}
        </MenuItem>
        {cptCodes}
      </TextField>
    )}
  </>;
};

export default CptCodeField;
