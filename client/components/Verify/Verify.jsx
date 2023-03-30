import React, { useEffect, useState } from "react";
import { verifySession } from "../../api/DataHelper";
import { Error401 } from "../Errors/Errors";

/**
 *
 * @param {React.props} props - Used to get the child component
 * @returns The child component if the session has been authorized or a 401 page if not.
 */
const Verify = (props) => {
  const [element, setElement] = useState(<h1>Waiting for server...</h1>);

  useEffect(() => {
    verifySession()
      .then(() => {
        setElement(props.children);
      })
      .catch(() => {
        setElement(<Error401 />);
      });
  }, [props.children]);

  return element;
};

export default Verify;
