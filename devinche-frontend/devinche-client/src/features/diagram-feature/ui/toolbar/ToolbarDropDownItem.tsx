const DropdownItem = ({
  icon: Icon,
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ElementType;
}) => (
  <button
    type="button"
    className={`w-full px-3 py-2 text-left hover:cursor-pointer hover:bg-[var(--editor-surface-hover)] disabled:opacity-50 flex items-center gap-2 text-[var(--editor-text)] ${className}`}
    {...props}
  >
    {Icon && <Icon size={14} />}
    {children}
  </button>
);


export default DropdownItem;