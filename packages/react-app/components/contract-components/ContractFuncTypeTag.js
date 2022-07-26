import Chip from "@mui/material/Chip";

export function ContractFuncTypeTag({ funcType }) {
  const color = ["view", "pure"].includes(funcType)
    ? "primary"
    : funcType === "nonpayable"
    ? "secondary"
    : "error";
  return <Chip label={funcType} size="small" color={color} />;
}
