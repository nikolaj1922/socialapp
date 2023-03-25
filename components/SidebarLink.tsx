import React from "react";

type HeroIcon = (props: React.ComponentProps<"svg">) => JSX.Element;

interface Props {
  text: string;
  Icon: HeroIcon;
  active?: boolean;
}

const SidebarLink = ({ text, Icon, active }: Props) => {
  return (
    <div
      className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 hoverAnimation ${
        active && "font-bold"
      }`}
    >
      <Icon className="h-7 text-white" />
      <span className="hidden xl:inline">{text}</span>
    </div>
  );
};

export default SidebarLink;
