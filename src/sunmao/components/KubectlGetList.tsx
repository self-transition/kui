import { implementRuntimeComponent } from "@sunmao-ui/runtime";
import { Type } from "@sinclair/typebox";
import { PRESET_PROPERTY_CATEGORY } from "@sunmao-ui/shared";
import { css } from "@emotion/css";
import BaseKubectlGetList, {
  type Response,
} from "../../_internal/organisms/KubectlGetList";
import { useCallback, useEffect } from "react";

export const KubectlGetList = implementRuntimeComponent({
  version: "kui/v1",
  metadata: {
    name: "kubectl_get_list",
    displayName: "KubectlGetList",
    description: "",
    isDraggable: false,
    isResizable: false,
    exampleProperties: {
      basePath: "proxy-k8s",
      apiBase: "apis/kubesmart.smtx.io/v1alpha1",
      resource: "kubesmartclusters",
    },
    exampleSize: [1, 1],
    annotations: {
      category: PRESET_PROPERTY_CATEGORY.Basic,
    },
  },
  spec: {
    properties: Type.Object({
      basePath: Type.String({
        title: "Base path",
        description: "K8s Api base path",
        category: PRESET_PROPERTY_CATEGORY.Data,
      }),
      watchWsBasePath: Type.String({
        title: "Watch websocket base path",
        category: PRESET_PROPERTY_CATEGORY.Data,
      }),
      apiBase: Type.String({
        title: "Api base",
        widget: "kui/v1/ApiBaseWidget",
        description: "K8s resource api base, e.g, /apis/apps/v1",
        category: PRESET_PROPERTY_CATEGORY.Data,
      }),
      namespace: Type.String({
        title: "Namespace",
        description: "namespace filter",
        category: PRESET_PROPERTY_CATEGORY.Data,
      }),
      resource: Type.String({
        title: "Resource",
        category: PRESET_PROPERTY_CATEGORY.Data,
        widget: "kui/v1/ResourceWidget",
        conditions: [
          {
            key: "apiBase",
            not: "",
          },
          {
            key: "apiBase",
            not: undefined,
          },
        ],
      }),
      fieldSelector: Type.String({
        title: "Field selector",
        category: PRESET_PROPERTY_CATEGORY.Data,
      }),
      emptyText: Type.String({
        title: "Empty text",
        category: PRESET_PROPERTY_CATEGORY.Behavior,
      }),
      errorText: Type.String({
        title: "Error text",
        category: PRESET_PROPERTY_CATEGORY.Behavior,
      }),
    }),
    state: Type.Object({
      items: Type.Array(Type.Any()),
      lastClickItem: Type.Any(),
    }),
    methods: {},
    slots: {},
    styleSlots: ["content"],
    events: ["onClickItem"],
  },
})(
  ({
    basePath,
    watchWsBasePath,
    apiBase,
    namespace,
    resource,
    fieldSelector,
    emptyText,
    errorText,
    customStyle,
    elementRef,
    callbackMap,
    mergeState,
  }) => {
    const onResponse = useCallback(
      (response: Response) => {
        mergeState({
          items: response.data.items,
        });
      },
      [mergeState]
    );
    const onClickItem = useCallback(
      (item) => {
        mergeState({
          lastClickItem: item,
        });
        callbackMap?.onClickItem?.();
      },
      [mergeState, callbackMap]
    );

    useEffect(() => {
      mergeState({
        items: [],
        lastClickItem: null,
      });
    }, []);

    return (
      <div className={css(customStyle?.content)} ref={elementRef}>
        <BaseKubectlGetList
          basePath={basePath}
          watchWsBasePath={watchWsBasePath}
          apiBase={apiBase}
          namespace={namespace}
          resource={resource}
          fieldSelector={fieldSelector}
          emptyText={emptyText}
          errorText={errorText}
          onResponse={onResponse}
          onClickItem={onClickItem}
        ></BaseKubectlGetList>
      </div>
    );
  }
);
