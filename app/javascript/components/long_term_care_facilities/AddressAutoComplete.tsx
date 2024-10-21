import { Grid } from "@mui/material";
import * as React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

interface Props {
  address: any;
  setAddress: any;
}

const AddressAutoComplete: React.FC<Props> = (props) => {
  return (
    <Grid item xs={12} className="field-container">
      <GooglePlacesAutocomplete
        apiKey={process.env.GOOGLE_PLACE_API_KEY}
        autocompletionRequest={{
          componentRestrictions: {
            country: ["us"],
          },
        }}
        debounce={300}
        minLengthAutocomplete={3}
        selectProps={{
          value: props.address,
          onChange: props.setAddress,
          className: "facility-field facility-text",
          styles: {
            input: (provided) => ({
              ...provided,
            }),
          },
        }}
      />
    </Grid>
  );
};

export default AddressAutoComplete;