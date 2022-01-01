import React, { useContext } from "react";
import AuthContext from "src/stores/AuthContext";

const Test = () => {
  const user = useContext(AuthContext);

  if (!user) {
    return <h1>NOT LOGGED IN</h1>;
  }

  return <h1>TEST</h1>;
};

export default Test;
