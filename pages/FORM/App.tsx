import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { Loading, ProgramTitle } from "@core/components/common";
import * as React from "react";
import { useCallback } from "react";
import { AXFIRevert, AXFIWriteForm } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n, useUnmountEffect } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { FormSet } from "./FormSet";
import { use$FORM$Store } from "./use$FORM$Store";

interface Props {}
function App({}: Props) {
  const { t } = useI18n();
  const init = use$FORM$Store((s) => s.init);
  const reset = use$FORM$Store((s) => s.reset);
  const destroy = use$FORM$Store((s) => s.destroy);
  const saveSpinning = use$FORM$Store((s) => s.saveSpinning);
  const callSaveApi = use$FORM$Store((s) => s.callSaveApi);

  const [form] = Form.useForm();
  const handleSave = useCallback(async () => {
    try {
      await form.validateFields();

      await callSaveApi();
      await reset();
    } catch (err) {
      console.log(err);
    }
  }, [callSaveApi, form, reset]);

  useDidMountEffect(() => {
    init();
  });

  useUnmountEffect(() => {
    destroy();
  });

  return (
    <Container>
      <Header>
        <ProgramTitle icon={<AXFIWriteForm />} title={t.pages.example.form.title}>
          <Button icon={<AXFIRevert />} onClick={reset} size='small' type={"ghost"}>
            {t.button.reset}
          </Button>
        </ProgramTitle>
        <ButtonGroup compact>
          <Button onClick={reset}>{t.button.reset}</Button>
          <Button type={"primary"} loading={saveSpinning} onClick={handleSave}>
            저장하기
          </Button>
        </ButtonGroup>
      </Header>

      <FormSet form={form} />

      <Loading active={saveSpinning} />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export default App;
