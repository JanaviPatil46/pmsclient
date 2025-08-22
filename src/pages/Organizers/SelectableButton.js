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
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SelectableButton = ({
  selected = false,
  disabled = false,
  onClick,
  children,
}) => {
  const theme = useTheme();

  return (
    <Button
      variant={selected ? "" : "outlined"}
      disabled={disabled}
      onClick={() => !disabled && onClick?.()}
      sx={{
        borderRadius: "15px",
        transition: "background-color 0.2s ease",
        ...(selected && {
          backgroundColor: theme.palette.text.menu,        // teal
          color: theme.palette.primary.contrastText,       // white (or theme-contrast)
          "&:hover": {
            backgroundColor: theme.palette.menu.dark,      // darker teal on hover
            boxShadow: 1,
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.text.menu,      // stay teal even if disabled
            color: theme.palette.primary.contrastText,
          },
        }),
      }}
    >
      {children}
    </Button>
  );
};

export default SelectableButton;
