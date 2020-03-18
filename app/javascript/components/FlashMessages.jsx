// !!!!This file is only used by Application.html.erb
// !!!!TODO: amke user application also use shared/FlashMessage file

import * as React from "react";
import Alert from "./Alert";

class FlashMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: props.messages };
  }

  render() {
    return (
      <>
        {this.state.messages && (
          <div>
            {this.state.messages.map((message) => (
              <Alert key={message.id} message={message} />
            ))}
          </div>
        )}
      </>
    );
  }
}

export default FlashMessages;
