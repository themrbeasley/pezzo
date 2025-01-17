import { Breadcrumb, Button, Col, Row, Space, Tabs, Typography } from "antd";
import {
  EditOutlined,
  HistoryOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { PromptHistoryView } from "../../../components/prompts/views/PromptHistoryView";
import { PromptEditView } from "../../../components/prompts/views/PromptEditView";
import { css } from "@emotion/css";
import { DeletePromptConfirmationModal } from "../../../components/prompts/DeletePromptConfirmationModal";
import { useCurrentPrompt } from "../../../lib/providers/CurrentPromptContext";
import { useNavigate, useParams } from "react-router-dom";

const TabLabel = styled.div`
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
`;

const BreadcrumbTitle = styled.span`
  cursor: pointer;
`;

export const PromptPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { setCurrentPromptId, prompt, integration } = useCurrentPrompt();
  const [activeView, setActiveView] = useState("edit");
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);

  useEffect(() => {
    if (params.promptId) {
      setCurrentPromptId(params.promptId as string, "latest");
    }
  }, [params.promptId]);
  const tabs = [
    {
      label: (
        <TabLabel>
          <EditOutlined /> Edit
        </TabLabel>
      ),
      key: "edit",
    },
    {
      label: (
        <TabLabel>
          <HistoryOutlined /> History
        </TabLabel>
      ),
      key: "history",
    },
  ];

  return (
    prompt && (
      <>
        <DeletePromptConfirmationModal
          open={isDeleteConfirmationModalOpen}
          onClose={() => setIsDeleteConfirmationModalOpen(false)}
          onConfirm={() => setIsDeleteConfirmationModalOpen(false)}
        />
        <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
          <Col span={16}>
            <Breadcrumb
              style={{ marginBottom: 12 }}
              items={[
                {
                  title: <BreadcrumbTitle>Prompts</BreadcrumbTitle>,
                  onClick: () => navigate("/prompts"),
                },
                {
                  title: (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={integration.iconBase64}
                        style={{ borderRadius: 2, height: 18 }}
                      />
                      <Typography.Text
                        style={{ display: "inline-block", marginLeft: 6 }}
                      >
                        {prompt.name}
                      </Typography.Text>
                    </div>
                  ),
                  key: "prompt",
                },
              ]}
            />
          </Col>
          <Col
            span={8}
            className={css`
              display: flex;
              justify-content: flex-end;
            `}
          >
            <Space wrap>
              {/* <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => setIsDeleteConfirmationModalOpen(true)}
              >
                Delete
              </Button> */}
            </Space>
          </Col>
        </Row>
        <Tabs
          items={tabs}
          onChange={(selectedView) => setActiveView(selectedView)}
        ></Tabs>

        {activeView === "history" && <PromptHistoryView />}
        {activeView === "edit" && <PromptEditView />}
      </>
    )
  );
};
