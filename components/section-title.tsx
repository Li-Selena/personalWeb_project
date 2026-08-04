type SectionTitleProps = {
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function SectionTitle({ children, action }: SectionTitleProps) {
  return (
    <div className="section-title-row">
      <h2 className="section-title">{children}</h2>
      <span className="section-title-line" aria-hidden="true" />
      {action ? <div className="section-title-action">{action}</div> : null}
    </div>
  );
}
