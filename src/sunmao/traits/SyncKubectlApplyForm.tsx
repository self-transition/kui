import { Type } from "@sinclair/typebox";
import { implementRuntimeTrait } from "@sunmao-ui/runtime";
import get from "lodash/get";

const TransformerTraitPropertiesSpec = Type.Object({
  value: Type.Any({
    title: "Value",
  }),
  setValueMethod: Type.String({
    title: "Set Value Method",
  }),
  formId: Type.String({
    title: "Form ID",
  }),
  fieldPath: Type.String({
    title: "Field Path",
  }),
});
const TransformerTraitStateSpec = Type.Object({});

export default implementRuntimeTrait({
  version: "kui/v1",
  metadata: {
    name: "sync_kubectl_apply_form",
    description: "sync the value to kubectl apply form fields",
  },
  spec: {
    properties: TransformerTraitPropertiesSpec,
    methods: [
      {
        name: "syncToComponent",
        parameters: Type.Object({
          value: Type.Any(),
        }),
      },
    ],
    state: TransformerTraitStateSpec,
  },
})(() => {
  const hasInitializedMap = new Map<string, boolean>();
  const valueCache = new Map<string, any>();
  return ({
    value,
    formId,
    fieldPath,
    services,
    componentId,
    subscribeMethods,
    setValueMethod,
  }) => {
    const cachedValue = valueCache.get(componentId);
    const hasInitialized = hasInitializedMap.get(componentId);

    valueCache.set(componentId, value);

    if (!hasInitialized) {
      hasInitializedMap.set(componentId, true);
      subscribeMethods({
        syncToComponent({ value: formValue }: any) {
          const valueInForm = get(formValue, fieldPath);
          const currentValue = valueCache.get(componentId);
          if (currentValue !== valueInForm) {
            services.apiService.send("uiMethod", {
              componentId,
              name: setValueMethod,
              parameters: valueInForm,
            });
          }
        },
      });
    }

    function setField() {
      if (value !== cachedValue) {
        services.apiService.send("uiMethod", {
          componentId: formId,
          name: "setField",
          parameters: {
            fieldPath,
            value,
          },
        });
      }
    }

    return {
      props: {
        componentDidMount: [
          () => {
            setField();
          },
        ],
        componentDidUpdate: [
          () => {
            setField();
          },
        ],
      },
    };
  };
});
