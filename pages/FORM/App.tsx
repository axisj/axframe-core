import { AXFIRevert, AXFIWriteForm } from "@axframe/icon";
import { Loading, ProgramTitle } from "@core/components/common";
import { useBtnI18n, useI18n, useUnmountEffect } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { useCallback } from "react";
import { PageLayout } from "styles/pageStyled";
import { errorHandling, formErrorHandling } from "utils/errorHandling";
import { FormSet } from "./FormSet";
import { use$FORM$Store } from "./use$FORM$Store";

interface Props {}

function App({}: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const init = use$FORM$Store((s) => s.init);
  const reset = use$FORM$Store((s) => s.reset);
  const destroy = use$FORM$Store((s) => s.destroy);
  const saveSpinning = use$FORM$Store((s) => s.saveSpinning);
  const callSaveApi = use$FORM$Store((s) => s.callSaveApi);
  const programFn = use$FORM$Store((s) => s.programFn);

  const [form] = Form.useForm();
  const handleSave = useCallback(async () => {
    try {
      await form.validateFields();
    } catch (e) {
      await formErrorHandling(form);
      return;
    }

    try {
      await callSaveApi();
      await reset();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callSaveApi, form, reset]);

  useDidMountEffect(() => {
    (async () => {
      try {
        await init();
      } catch (e: any) {
        await errorHandling(e);
      }
    })();
  });

  useUnmountEffect(() => {
    destroy();
  });

  return (
    <Container>
      <Header>
        <ProgramTitle icon={<AXFIWriteForm />}>
          <Button icon={<AXFIRevert />} onClick={reset} size='small' type={"text"}>
            {btnT("초기화")}
          </Button>
        </ProgramTitle>
        <ButtonGroup compact>
          {programFn?.fn02 && (
            <Button type={"primary"} loading={saveSpinning} onClick={handleSave}>
              {btnT("저장")}
            </Button>
          )}
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
