import React, { useContext } from "react";
import { Type, Static } from "@sinclair/typebox";
import { WidgetProps } from "./AutoForm/widget";
import { resolveSubFields } from "./AutoForm/ObjectField";
import styled from "@emotion/styled";
import { KitContext } from "../atoms/kit-context";
import { CloseOutlined } from "@ant-design/icons";
import { Row, Collapse } from "antd";
import { Typo } from "../atoms/themes/CloudTower/styles/typo.style";
import { css } from "@emotion/css";
import Icon from "../atoms/themes/CloudTower/components/Icon/Icon";

const { Panel } = Collapse;

const GroupWrapperStyle = css`
  &.dovetail-ant-collapse {
    border: 1px solid #e4e9f2;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  &.dovetail-ant-collapse
    > .dovetail-ant-collapse-item.dovetail-ant-collapse-no-arrow
    > .dovetail-ant-collapse-header {
    padding: 0;
  }

  &.dovetail-ant-collapse > .dovetail-ant-collapse-item:last-child,
  .dovetail-ant-collapse
    > .dovetail-ant-collapse-item:last-child
    > .dovetail-ant-collapse-header {
    border-radius: 0 0 8px 8px;
  }

  & .dovetail-ant-collapse-content > .dovetail-ant-collapse-content-box {
    padding: 0;
  }

  &.dovetail-ant-collapse > .dovetail-ant-collapse-item {
    border-bottom: 0;
  }

  & .dovetail-ant-collapse-item:last-child > .dovetail-ant-collapse-content {
    border-radius: 0 0 8px 8px;
  }

  .arrow-icon {
    transition: transform 0.28s ease;
    transform: rotate(-180deg);
  }

  & .dovetail-ant-collapse-item-active {
    .arrow-icon {
      transform: rotate(0);
    }
  }

  &.dovetail-ant-collapse
    .dovetail-ant-collapse-item-disabled
    > .dovetail-ant-collapse-header {
    cursor: unset;
  }
`;
const GroupHeader = styled.div`
  height: 44px;
  line-height: 44px;
  padding: 0 12px;
  background: rgba(225, 230, 241, 0.6);
  display: flex;
  justify-content: space-between;
`;
const GroupTitle = styled.h5`
  color: rgba(44, 56, 82, 0.6);
  display: flex;
  align-items: center;
  margin-bottom: 0;
`;
const GroupBodyStyle = css`
  padding-bottom: 0;
  margin: 0;
`;

export const OptionsSpec = Type.Object({
  title: Type.Optional(
    Type.String({
      title: "Title",
    })
  ),
  collapsible: Type.Optional(
    Type.Boolean({
      title: "Collapsible",
    })
  ),
});

type GroupProps = WidgetProps<
  Record<string, any>,
  Static<typeof OptionsSpec>
> & {
  onRemove?: () => void;
};

const Group = (props: GroupProps) => {
  const { widgetOptions, onRemove } = props;
  const kit = useContext(KitContext);

  return (
    <Collapse className={GroupWrapperStyle} defaultActiveKey={["panel"]}>
      <Panel
        key="panel"
        header={
          <GroupHeader>
            <GroupTitle className={Typo.Label.l2_regular}>
              {widgetOptions?.collapsible ? (
                <Icon
                  className="arrow-icon"
                  type="1-caret-triangle-down-16"
                ></Icon>
              ) : null}
              {widgetOptions?.title}
            </GroupTitle>
            {onRemove ? (
              <span>
                <kit.Button size="small" type="text" onClick={onRemove}>
                  <CloseOutlined />
                </kit.Button>
              </span>
            ) : null}
          </GroupHeader>
        }
        showArrow={false}
        disabled={!widgetOptions?.collapsible}
      >
        <Row className={GroupBodyStyle} gutter={[24, 16]} style={{ margin: 0 }}>
          {resolveSubFields(props)}
        </Row>
      </Panel>
    </Collapse>
  );
};

export default Group;
