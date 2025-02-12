import { WidgetProps } from "./AutoForm/widget";
import Group from "./Group";
import { Type, Static } from "@sinclair/typebox";
import { KitContext } from "../atoms/kit-context";
import { useContext } from "react";
import { css } from "@emotion/css";
import Icon, {
  IconTypes,
} from "../atoms/themes/CloudTower/components/Icon/Icon";
import { generateFromSchema } from "../utils/schema";
import { JSONSchema7 } from "json-schema";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";

const AddedButtonStyle = css``;

export const OptionsSpec = Type.Object({
  title: Type.Optional(
    Type.String({
      title: "Title",
    })
  ),
  removable: Type.Optional(Type.Boolean({ title: "Removable" })),
  addable: Type.Optional(Type.Boolean({ title: "Addable" })),
  addedButtonText: Type.Optional(Type.String({ title: "Added button text" })),
  addedButtonIcon: Type.Optional(Type.String({ title: "Added button icon" })),
  maxLength: Type.Optional(
    Type.Number({
      title: "Max length",
    })
  ),
  minLength: Type.Optional(
    Type.Number({
      title: "Min Length",
    })
  ),
});

type Props = WidgetProps<any[], Static<typeof OptionsSpec>>;

const ArrayGroups = (props: Props) => {
  const { t } = useTranslation();
  const kit = useContext(KitContext);
  const {
    value,
    spec,
    path,
    level,
    widgetOptions = {
      title: "",
      removable: true,
      addable: true,
      addedButtonText: t("dovetail.add"),
      addedButtonIcon: "",
    },
    onChange,
  } = props;
  const itemSpec = Array.isArray(spec.items) ? spec.items[0] : spec.items;
  const errorInfo = props.field?.error || props.error;

  return (
    <>
      {(value || []).map((itemValue, itemIndex) => {
        return (
          <Group
            {...props}
            key={itemIndex}
            value={itemValue}
            spec={itemSpec as JSONSchema7}
            subKey={`${props.field?.key}-${itemIndex}`}
            index={itemIndex}
            error={errorInfo instanceof Array ? errorInfo[itemIndex] : ""}
            widgetOptions={{
              ...widgetOptions,
              title: widgetOptions?.title
                ? `${widgetOptions?.title} ${itemIndex + 1}`
                : "",
            }}
            path={path.concat(`.${itemIndex}`)}
            level={level + 1}
            onRemove={
              value.length > (widgetOptions?.minLength || 0)
                ? () => {
                    onChange(value.filter((v, i) => i !== itemIndex));
                  }
                : undefined
            }
            onChange={(newItemValue: any, key?: string, dataPath?: string) => {
              const newValue = [...value];

              newValue[itemIndex] = newItemValue;
              onChange(newValue, key, dataPath);
            }}
          ></Group>
        );
      })}
      {widgetOptions.addable !== false &&
      value.length < (widgetOptions?.maxLength || Number.MAX_SAFE_INTEGER) ? (
        <div>
          {widgetOptions.addedButtonIcon ? (
            <Icon type={widgetOptions.addedButtonIcon as IconTypes}></Icon>
          ) : null}
          <kit.Button
            prefixIcon="1-plus-add-create-new-16-gray"
            hoverPrefixIcon="1-plus-add-create-new-16-blue"
            className={AddedButtonStyle}
            size="small"
            onClick={() => {
              const defaultValue =
                props.field?.defaultValue?.[0] ??
                generateFromSchema(itemSpec as JSONSchema7);

              onChange(
                value.concat(
                  defaultValue && typeof defaultValue === "object"
                    ? cloneDeep(defaultValue)
                    : defaultValue
                )
              );
            }}
          >
            {widgetOptions.addedButtonText || "添加"}
          </kit.Button>
        </div>
      ) : null}
    </>
  );
};

export default ArrayGroups;
