import React from "react";
import { useIsClient } from "usehooks-ts";

export default function withClientRendering(Component: React.FC) {
  function Wrapper(props: any) {
    const isClient = useIsClient();

    if (isClient) {
      return <Component {...props} />;
    }
    return <></>;
  }

  return Wrapper;
}
