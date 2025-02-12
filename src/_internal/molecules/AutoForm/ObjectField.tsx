import React from "react";
import { WidgetProps } from "./widget";
import Group from "../Group";
import SpecField from "./SpecField";
import { getJsonSchemaByPath } from "src/_internal/utils/schema";
import { immutableSet } from "../../../editor/utils/object";
import { get } from "lodash";
import type { Field } from "../../organisms/KubectlApplyForm/type";
import { isObject } from "lodash";

export function resolveSubFields(props: WidgetProps) {
  const { field, spec, value, path, level, error, onChange } = props;
  const fields: Field[] = field?.fields || [];
  const properties = Object.keys(spec.properties || {});

  if (fields.length) {
    // if configure the sub fields then use them
    return fields.map((subField) => {
      if (!subField.path) return null;

      const subSpec = getJsonSchemaByPath(spec, subField.path) || {};
      const errorInfo = subField?.error || error;

      return (
        <SpecField
          {...props}
          error={
            errorInfo && isObject(errorInfo) && subField?.key
              ? (errorInfo[subField.key as keyof typeof errorInfo] as string)
              : errorInfo
          }
          field={subField}
          widget={subField.widget}
          widgetOptions={subField.widgetOptions}
          key={subField.path}
          spec={{
            ...subSpec,
            title: subField.label,
          }}
          path={path.concat(`.${subField.path}`)}
          level={level + 1}
          value={get(value, subField.path)}
          onChange={(newValue, key, dataPath) => {
            const result = immutableSet(value, subField.path, newValue);

            onChange(result, key, dataPath);
          }}
        />
      );
    });
  } else {
    // show all properties
    return properties.map((name) => {
      const subSpec = (spec.properties || {})[name] as WidgetProps["spec"];

      if (typeof subSpec === "boolean") {
        return null;
      }

      return (
        <SpecField
          {...props}
          key={name}
          field={undefined}
          spec={{
            ...subSpec,
            title: subSpec.title || name,
          }}
          path={path.concat(`.${name}`)}
          level={level + 1}
          value={value?.[name]}
          widgetOptions={{}}
          onChange={(newValue, key, dataPath) => {
            onChange(
              {
                ...(value || {}),
                [name]: newValue,
              },
              key,
              dataPath
            );
          }}
        />
      );
    });
  }
}

export const ObjectField: React.FC<WidgetProps> = (props) => {
  return <Group {...props}></Group>;
};

export default ObjectField;
