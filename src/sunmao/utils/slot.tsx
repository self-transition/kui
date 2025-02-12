import {
  ImplWrapper,
  SlotTraitPropertiesSpec,
  UIServices,
  formatSlotKey,
  SlotsElements,
} from "@sunmao-ui/runtime";
import type {
  RuntimeApplication,
  RuntimeComponentSchema,
} from "@sunmao-ui/core";
import React from "react";
import { Static } from "@sinclair/typebox";

type SlotTraitProps = Static<typeof SlotTraitPropertiesSpec>;

type Props = {
  app: RuntimeApplication;
  component: RuntimeComponentSchema;
  services: UIServices;
  slot: string;
  slotKey: string;
  slotsElements: SlotsElements<any>;
  fallback?: React.ReactNode;
};

type Options = {
  generateId: (child: RuntimeComponentSchema) => string;
  generateProps: () => Record<string, unknown>;
};

export const generateSlotChildren = (
  { app, component, services, slotsElements, slot, slotKey, fallback }: Props,
  { generateId, generateProps }: Options
) => {
  const renderSet = new Set<string>();
  const childrenSchema = app.spec.components.filter((c) => {
    return c.traits.find(
      (t) =>
        t.type === "core/v1/slot" &&
        (t.properties as SlotTraitProps).container.id === component.id &&
        (t.properties as SlotTraitProps).container.slot === slot
    );
  });

  const _childrenSchema = childrenSchema.map((child) => {
    const id = generateId(child);

    renderSet.add(id);

    return {
      ...child,
      id,
    };
  });
  const slots =
    slotsElements[slot]?.(generateProps(), fallback, slotKey) || fallback;

  return _childrenSchema.length
    ? _childrenSchema.map((child) => {
        return (
          <ImplWrapper
            key={child.id}
            component={child}
            app={app}
            services={services}
            childrenMap={{}}
            isInModule
            evalListItem
            slotContext={{
              renderSet,
              slotKey: formatSlotKey(component.id, slot, slotKey),
            }}
          />
        );
      })
    : fallback;
};
