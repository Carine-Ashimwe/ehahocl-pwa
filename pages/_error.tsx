import Router from "next/router";
import React from "react";

export default function _error() {
  React.useEffect(() => {
    Router.push("/notfound");
  });

  return <div />;
}
