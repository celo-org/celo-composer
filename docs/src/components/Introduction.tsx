import MDXContent from "@theme/MDXContent";
import React, { useEffect, useState } from "react";

type Props = {};

const Introduction = ({}: Props) => {
  const [data, setData] = useState<string>("");

  const temp = "<span>Hello</span>";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    var res = await fetch(
      `https://raw.githubusercontent.com/celo-org/celo-composer/main/README.md`
    );
    var mdData = await res.text();
    console.log("data :>> ", mdData);
    setData(mdData);
  };

  return <MDXContent>{temp}</MDXContent>;
};

export default Introduction;
