import * as React from "react";
import { Link } from "@mui/material";
import Github from "@/public/Github";
import Discord from "@/public/Discord";

export default function Footer() {
  const githubLink =
    "https://github.com/celo-org/celo-progressive-dapp-starter";
  const discordLink = "https://discord.gg/cGCE9p9352";

  return (
    <footer style={{ textAlign: "center" }}>
      <Link href={githubLink} target="_blank">
        <Github style={{ width: "40px", margin: "5px" }} />
      </Link>
      <Link href={discordLink} target="_blank">
        <Discord style={{ width: "40px", margin: "5px" }} />
      </Link>
    </footer>
  );
}
