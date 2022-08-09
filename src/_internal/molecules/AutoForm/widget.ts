import { JSONSchema7 } from "json-schema";
import type { Field } from '../../organisms/KubectlApplyForm/KubectlApplyForm';

type WidgetOptions = Partial<{
  displayLabel: boolean;
  section?: string;
  step?: number;
}>;

export type WidgetProps = {
  field?: Field;
  spec: JSONSchema7;
  widget?: string;
  widgetOptions?: Record<string, any>;
  level: number;
  path: string;
  step?: number;
  layout?: {
    steps?: { paths: string[] }[];
  };
  stepElsRef: Record<number, HTMLElement | null>;
  value: any;
  onChange: (newV: any) => void;
  renderer?: (
    path: string,
    level: number,
    position: "before" | "after" | "widget"
  ) => React.ReactNode;
  slot?: Function;
};
