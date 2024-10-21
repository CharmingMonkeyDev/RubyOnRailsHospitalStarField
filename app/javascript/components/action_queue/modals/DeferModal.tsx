import React from "react";
import Modal from "../../modals/Modal";
import DateFnsUtils from "@date-io/date-fns";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { formatToUsDate, formatYYMMDDdate } from "../../utils/DateHelper";

interface Props {
  setSuccessModalOpen: Function;
  successModalOpen: boolean;
  successCallback: Function;
  closeCallback: Function;
}

const DeferModal: React.FC<Props> = (props: Props) => {
  const {
    setSuccessModalOpen,
    successCallback,
    successModalOpen,
    closeCallback,
  } = props;

  const [deferToDate, setDeferToDateStart] = React.useState(
    formatToUsDate(new Date())
  );

  const modalContent = (
    <div className="modal-content">
      <p className="align-center">
        Deferring a patient’s action will remove it from the queue. Would you
        like to continue?
      </p>
      Remove from queue until
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          autoOk={true}
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          value={deferToDate}
          onChange={(value) => {
            setDeferToDateStart(formatToUsDate(value));
          }}
          className="report-date-input"
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );

  const successCallbackWithModalAction = async () => {
    await successCallback(formatYYMMDDdate(deferToDate));
  };

  return (
    <Modal
      successModalOpen={successModalOpen}
      setSuccessModalOpen={setSuccessModalOpen}
      successHeader={"Defer Action"}
      successContent={modalContent}
      successCallback={successCallbackWithModalAction}
      closeCallback={closeCallback}
      confirmButtonText="Defer & Proceed"
    />
  );
};

export default DeferModal;
