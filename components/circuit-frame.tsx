type CircuitFrameProps = {
  className?: string;
};

export function CircuitFrame({ className = "" }: CircuitFrameProps) {
  return (
    <div className={`circuit-frame ${className}`} aria-hidden="true">
      <span className="circuit-frame__node circuit-frame__node--one" />
      <span className="circuit-frame__node circuit-frame__node--two" />
      <span className="circuit-frame__node circuit-frame__node--three" />
    </div>
  );
}
