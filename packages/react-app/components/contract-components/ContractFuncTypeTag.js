import Chip from "@mui/material/Chip";

export function ContractFuncTypeTag({ funcType }) {
  switch (funcType) {
    case "view":
      return <Chip label="view" size="small" color="primary" />;
    case "nonpayable":
      return <Chip label="nonpayable" size="small" color="secondary" />;
    case "payable":
      return <Chip label="payable" size="small" color="error" />;
    default:
  }
}
