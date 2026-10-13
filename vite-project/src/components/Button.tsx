import clsx from "clsx";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  className?: string;
  label?: string;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Corrected type
};

const Button = ({
  type = "button",
  className,
  label,
  icon,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        "px-3 py-2 outline-none flex items-center gap-2",
        className
      )}
      onClick={onClick}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;
