import React, { PropsWithChildren } from "react";
import { useMediaQuery } from "@mui/material";
import MobileFooter from "@/components/MobileSidebar";

const MobileLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width:640px)");

  return (
    <div>
      {children}
      {isMobile && <MobileFooter />}
    </div>
  );
};

export default MobileLayout;
