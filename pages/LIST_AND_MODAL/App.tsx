import { AXFDGClickParams } from "@axframe/datagrid";
import { AXFIRevert } from "@axframe/icon";
import { ProgramTitle } from "@core/components/common";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { useBtnI18n, useI18n, useUnmountEffect } from "hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import { Button, Form, message } from "antd";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { openDetailModal } from "./DetailModal";
import { ListDataGrid } from "./ListDataGrid";
import { use$LIST_AND_MODAL$Store } from "./use$LIST_AND_MODAL$Store";

interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const init = use$LIST_AND_MODAL$Store((s) => s.init);
  const reset = use$LIST_AND_MODAL$Store((s) => s.reset);
  const destroy = use$LIST_AND_MODAL$Store((s) => s.destroy);
  const callListApi = use$LIST_AND_MODAL$Store((s) => s.callListApi);
  const listRequestValue = use$LIST_AND_MODAL$Store((s) => s.listRequestValue);
  const setListRequestValue = use$LIST_AND_MODAL$Store((s) => s.setListRequestValue);
  const listSpinning = use$LIST_AND_MODAL$Store((s) => s.listSpinning);
  const programFn = use$LIST_AND_MODAL$Store((s) => s.programFn);

  const [searchForm] = Form.useForm();

  const handleReset = React.useCallback(async () => {
    try {
      await reset();
      await callListApi();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi, reset]);

  const handleSearch = React.useCallback(async () => {
    try {
      await callListApi({
        pageNumber: 1,
      });
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi]);

  const onClickItem = React.useCallback(
    async (params: AXFDGClickParams<DtoItem>) => {
      try {
        const data = await openDetailModal({
          query: params.item,
        });

        messageApi.info(JSON.stringify(data ?? {}));
      } catch (err) {
        await errorHandling(err);
      }
    },
    [messageApi],
  );

  const params = React.useMemo(
    () =>
      [
        {
          placeholder: t("지역"),
          name: "select1",
          type: SearchParamType.SELECT,
          options: [
            { label: t("중구"), value: "중구" },
            { label: t("동구"), value: "동구" },
            { label: t("서구"), value: "서구" },
            { label: t("남구"), value: "남구" },
            { label: t("북구"), value: "북구" },
            { label: t("수성구"), value: "수성구" },
            { label: t("달서구"), value: "달서구" },
            { label: t("달성군"), value: "달성군" },
          ],
        },
        {
          placeholder: t("상담방법"),
          name: "select2",
          type: SearchParamType.SELECT,
          options: [
            { label: t("유선"), value: "유선" },
            { label: t("내방"), value: "내방" },
            { label: t("방문"), value: "방문" },
            { label: t("이동상담"), value: "이동상담" },
            { label: t("기타"), value: "기타" },
          ],
        },
        {
          placeholder: t("상담일자"),
          name: "timeRange",
          type: SearchParamType.DATE_RANGE,
        },
      ] as IParam[],
    [t],
  );

  useDidMountEffect(() => {
    (async () => {
      try {
        await init();
        await callListApi();
      } catch (e) {
        await errorHandling(e);
      }
    })();
  });

  useUnmountEffect(() => {
    destroy();
  });

  return (
    <Container stretch role={"page-container"}>
      {contextHolder}
      <Header>
        <ProgramTitle>
          <Button icon={<AXFIRevert />} onClick={handleReset} size='small' type={"text"}>
            {btnT("초기화")}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact>
          {programFn?.fn01 && <Button onClick={handleSearch}>{btnT("검색")}</Button>}

          <Button onClick={handleSearch}>{btnT("검색")}</Button>
        </ButtonGroup>
      </Header>

      <Body>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value, changedValues) => setListRequestValue(value, changedValues)}
          onSearch={handleSearch}
          spinning={listSpinning}
          disableFilter
        />

        <ListDataGrid onClick={onClickItem} />
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Body = styled(PageLayout.Body)``;

export default App;
