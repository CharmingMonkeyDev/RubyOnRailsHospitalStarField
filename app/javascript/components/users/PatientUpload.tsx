import * as React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Grid,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { CSVLink } from "react-csv";

interface Props {
  csrfToken: string;
}

const PatientUpload: React.FC<Props> = (props: any) => {
  const [selectedFile, setSelectedFile] = React.useState<any>(null);
  const [error, setError] = React.useState<string>("");
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [errorList, setErrorList] = React.useState<any>(null);
  const [timeStarted, setTimeStarted] = React.useState<any>(null);
  const [timeEnded, setTimeEnded] = React.useState<any>(null);
  const [recordsProcessed, setRecordsProcessed] = React.useState<any>(null);
  const [recordsUploaded, setRecordsUploaded] = React.useState<any>(null);
  const [recordsFailed, setRecordsFailed] = React.useState<any>(null);
  const [csvData, setCsvData] = React.useState<any>(null);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const importCsv = () => {
    setError("");
    setDisabledButton(true);
    setErrorList(null);
    setCsvData(null);

    if (selectedFile) {
      setTimeStarted(new Date());
      var formData = new FormData();
      formData.append("csv", selectedFile);

      fetch(`/patient-upload`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "X-CSRF-Token": props.csrfToken,
          "X-Frame-Options": "sameorigin",
          "X-XSS-Protection": "1; mode=block",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Content-Security-Policy": "default-src 'self'",
        },
        body: formData,
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.success == false) {
            setError(result.error);
            setDisabledButton(false);
            setTimeEnded(new Date());
            setDisabledButton(false);
          } else {
            setErrorList(result.resource.errors);
            setRecordsProcessed(result.resource.records_processed);
            setRecordsUploaded(result.resource.records_uploaded);
            setRecordsFailed(result.resource.records_failed);
            setTimeEnded(new Date());
            setSelectedFile(null);
            setDisabledButton(false);

            let csvRows = [];
            result.data.errors.forEach((error) => {
              csvRows.push(error.row);
            });
            if (csvRows.length > 0) setCsvData(csvRows);
          }
        })
        .catch((error) => {
          setError(error);
          setDisabledButton(false);
        });
    } else {
      setError("Invalid entries, please check your entries and try again.");
      setDisabledButton(false);
    }
  };

  const getRowName = (error) => {
    try {
      if (!error.row || error.row.length === 0) {
        throw new Error("No data");
      }

      let rowColumns = error.row;

      if (rowColumns.length >= 3 && rowColumns[2].length >= 2) {
        return `${rowColumns[0][1]} ${rowColumns[2][1]}`;
      } else {
        throw new Error("No Data");
      }
    } catch (error) {
      return error.message;
    }
  };

  const formatDateToday = () => {
    let date = new Date();
    return (
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "/" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "/" +
      date.getFullYear()
    );
  };

  const formatTime = (dateObject) => {
    let date = new Date(dateObject);

    var hours = date.getHours();
    var minutes = date.getMinutes().toString();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = parseInt(minutes) < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  return (
    <div className="patient-index-container">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className="container"
      >
        <Grid item xs={12} md={6}>
          {error.length > 0 && (
            <Snackbar
              open={error.length > 0}
              autoHideDuration={6000}
              onClose={() => {
                setError("");
              }}
            >
              <Alert severity="error" className="alert">
                {error}
              </Alert>
            </Snackbar>
          )}

          <div className="userAdminInformation">
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs={12} md={12} className="bulk-upload-container">
                <h3
                  style={{
                    textAlign: "left",
                    font: "20px QuicksandMedium",
                    marginBottom: 40,
                  }}
                >
                  Bulk Data Upload
                </h3>

                <p
                  style={{
                    textAlign: "left",
                    font: "16px QuicksandMedium",
                    marginBottom: 40,
                  }}
                >
                  Use the Bulk Data Upload process outlined below to transfer
                  multiple patient&apos;s data into the Starfield system.
                </p>

                <p
                  style={{
                    textAlign: "left",
                    font: "16px QuicksandMedium",
                    marginBottom: 30,
                  }}
                >
                  1. First, download the{" "}
                  <a
                    href="/patient-upload-template.csv"
                    target="_blank"
                    style={{ color: "#f8890b" }}
                  >
                    CSV Template
                  </a>
                  .
                </p>
                <p
                  style={{
                    textAlign: "left",
                    font: "16px QuicksandMedium",
                    marginBottom: 30,
                  }}
                >
                  2. Add your data to the template and save it (must be saved as
                  a <strong>.CSV</strong> file).
                </p>
                <p
                  style={{
                    textAlign: "left",
                    font: "16px QuicksandMedium",
                    marginBottom: 30,
                  }}
                >
                  3. Use the <strong>Select Upload File</strong> button to
                  select your saved file. Once it is selected, click{" "}
                  <strong>Import File</strong>. A report will be generated upon
                  completion.
                </p>
                <p>
                  <Link
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      document.getElementById("raised-button-file").click();
                    }}
                    className="menuLink"
                  >
                    Select Upload File
                  </Link>
                  <input
                    id="raised-button-file"
                    type="file"
                    onChange={onFileChange}
                    style={{ display: "none" }}
                    accept=".csv"
                  />
                </p>
                {selectedFile && (
                  <>
                    <div
                      style={{ font: "16px QuicksandMedium", marginTop: 20 }}
                    >
                      <strong>Selected upload file:</strong> {selectedFile.name}
                    </div>
                  </>
                )}
                {selectedFile && (
                  <p>
                    {disabledButton ? (
                      <>Importing Patients, please wait...</>
                    ) : (
                      <Link
                        style={{ cursor: "pointer" }}
                        onClick={importCsv}
                        className="menuLink"
                      >
                        Import File
                      </Link>
                    )}
                  </p>
                )}
              </Grid>
            </Grid>
          </div>
        </Grid>

        {errorList && (
          <Grid item xs={12} md={6}>
            <div className="userAdminInformation">
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Grid item xs={12} md={12} style={{ padding: "10px" }}>
                  <h3
                    style={{
                      textAlign: "left",
                      font: "20px QuicksandMedium",
                      marginBottom: 30,
                    }}
                  >
                    Data Report
                  </h3>
                  {errorList && (
                    <>
                      <p
                        style={{
                          textAlign: "left",
                          font: "16px QuicksandMedium",
                          marginBottom: 30,
                        }}
                      >
                        {formatDateToday()} <br /> {formatTime(timeStarted)}{" "}
                        Upload Started <br /> {formatTime(timeEnded)} Upload
                        Ended <br /> {recordsProcessed} Processed <br />{" "}
                        {recordsUploaded} Uploaded <br /> {recordsFailed} Not
                        Uploaded
                      </p>
                      <p
                        style={{
                          textAlign: "left",
                          font: "16px QuicksandMedium",
                          marginBottom: 30,
                        }}
                      >
                        Failed Data:
                      </p>
                      <TableContainer
                        component={Paper}
                        style={{ marginRight: 20 }}
                      >
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="left">
                                <strong
                                  style={{ fontFamily: "QuicksandMedium" }}
                                >
                                  Name
                                </strong>
                              </TableCell>
                              <TableCell align="left">
                                <strong
                                  style={{ fontFamily: "QuicksandMedium" }}
                                >
                                  Reason Failed
                                </strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {errorList.map((error, index) => (
                              <TableRow
                                key={index}
                                className={index % 2 == 0 ? "rowEven" : "row"}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  style={{
                                    fontFamily: "QuicksandMedium",
                                    fontSize: 12,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                  }}
                                >
                                  {getRowName(error)}
                                </TableCell>
                                <TableCell
                                  style={{
                                    fontFamily: "QuicksandMedium",
                                    fontSize: 12,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                  }}
                                >
                                  {error.message}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <p>
                        {csvData && (
                          <CSVLink
                            style={{
                              cursor: "pointer",
                              textDecoration: "none",
                            }}
                            className="menuLink"
                            data={csvData}
                            enclosingCharacter={``}
                            filename={"failed-patients.csv"}
                          >
                            Export Failed Data
                          </CSVLink>
                        )}
                      </p>
                    </>
                  )}
                </Grid>
              </Grid>
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default PatientUpload;
