import { Activity, Bot, Cpu } from "lucide-react";
import { focusAreas } from "@/data/site";

const icons = {
  cpu: Cpu,
  activity: Activity,
  bot: Bot,
};

type FocusListProps = {
  compact?: boolean;
};

export function FocusList({ compact = false }: FocusListProps) {
  return (
    <div className={`focus-list ${compact ? "focus-list--compact" : ""}`}>
      {focusAreas.map((area) => {
        const Icon = icons[area.icon];
        return (
          <div className="focus-list__item" key={area.title}>
            <span className="focus-list__icon" aria-hidden="true">
              <Icon />
            </span>
            <span className="focus-list__copy">
              <strong>{area.title}</strong>
              <small>{area.description}</small>
            </span>
          </div>
        );
      })}
    </div>
  );
}
