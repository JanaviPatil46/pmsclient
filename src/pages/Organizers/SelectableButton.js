// import React from "react";
// import { Button } from "@mui/material";

// const SelectableButton = ({
//   selected = false,
//   disabled = false,
//   onClick,
//   children,
// }) => {
//   return (
//     <Button
//       variant={selected ? "contained" : "outlined"}
//       disabled={disabled}
//       onClick={() => !disabled && onClick?.()}
//       sx={{
//         borderRadius: "15px",
//         ...(selected && {
//           color: "#fff",
//           backgroundColor: "#1976d2",
//           "&.Mui-disabled": {
//             color: "#fff",
//             backgroundColor: "#1976d2",
//           },
//         }),
//       }}
//     >
//       {children}
//     </Button>
//   );
// };

// export default SelectableButton;


import React from "react";

const SelectableButton = ({
  selected = false,
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onClick?.()}
      className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors duration-200
        ${selected
          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 disabled:bg-primary disabled:text-primary-foreground disabled:opacity-70"
          : "bg-transparent text-foreground border-border hover:bg-muted disabled:opacity-50"
        }
        disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
};

export default SelectableButton;
