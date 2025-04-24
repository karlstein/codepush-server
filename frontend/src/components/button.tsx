import React from "react";

interface ButtonProps {
  title:
    | string
    | {
        default: string;
        sm?: string;
        md?: string;
      };
  onClick: () => void;
  lead?: React.ReactNode;
}

const Button = (props: ButtonProps) => {
  const { title, onClick, lead } = props;

  const renderTitle = () => {
    if (typeof title === "string")
      return <span className="inline">{title}</span>;

    return (
      <React.Fragment>
        <span className="hidden sm:inline">{title.default}</span>
        <span className="sm:hidden">{title.sm}</span>
        <span className="md:hidden">{title.md || title.sm}</span>
      </React.Fragment>
    );
  };

  return (
    <button
      className="bg-accent text-bg-dark py-2 px-4 rounded-md font-semibold hover:bg-[#3db9b0] transition-colors flex items-center gap-2 cursor-pointer"
      onClick={onClick}
    >
      {lead && lead}
      {renderTitle()}
    </button>
  );
};

export default Button;
