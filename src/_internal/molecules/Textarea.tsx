import { Input } from "antd";
import { Type, Static } from "@sinclair/typebox";
import { WidgetProps } from "./AutoForm/widget";

export const OptionsSpec = Type.Object({});

type Props = WidgetProps<string, Static<typeof OptionsSpec>>;

const Textarea = (props: Props) => {
  const { value, onChange } = props;

  return (
    <Input.TextArea
      value={value}
      onChange={(event) => onChange(event.currentTarget.value, props.field?.key)}
    />
  );
};

export default Textarea;
