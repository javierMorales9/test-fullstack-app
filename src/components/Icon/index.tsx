import React from "react";
import Image from "next/image";

function Icon({
  IconSource,
  DecorationClass,
}: {
  IconSource: any;
  DecorationClass: string;
}) {
  return (
    <span className={DecorationClass}>
      {typeof IconSource === "object" ? (
        <Image src={IconSource} alt={"Icon"} />
      ) : (
        <IconSource />
      )}
    </span>
  );
}

export default Icon;
