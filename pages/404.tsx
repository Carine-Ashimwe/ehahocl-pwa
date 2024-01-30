import Router from "next/router";
import React from "react";

export default function Error404() {
  React.useEffect(() => {
    Router.push("/notfound");
  });

  return <div />;
}
