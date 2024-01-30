import Router from "next/router";
import React from "react";

export default function Index() {
  React.useEffect(() => {
    Router.push("/admin/dashboard");
  });

  return <div />;
}
