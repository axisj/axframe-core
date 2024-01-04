import { AXFIRevert } from "@axframe/icon";
import { ProgramTitle } from "@core/components/common";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { useBtnI18n, useI18n, useUnmountEffect } from "hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import styled from "@emotion/styled";
import { Button, Form, Tabs } from "antd";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { PanelIndex } from "./PanelIndex";
import { PanelType, use$STATS$Store } from "./use$STATS$Store";

interface Props {}

function App({}: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const init = use$STATS$Store((s) => s.init);
  const reset = use$STATS$Store((s) => s.reset);
  const destroy = use$STATS$Store((s) => s.destroy);
  const callListApi = use$STATS$Store((s) => s.callListApi);
  const listRequestValue = use$STATS$Store((s) => s.listRequestValue);
  const setRequestValue = use$STATS$Store((s) => s.setRequestValue);
  const spinning = use$STATS$Store((s) => s.spinning);
  const activeTabKey = use$STATS$Store((s) => s.activeTabKey);
  const setActiveTabKey = use$STATS$Store((s) => s.setActiveTabKey);
  const programFn = use$STATS$Store((s) => s.programFn);

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
      await callListApi();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi]);

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
      <Header>
        <ProgramTitle>
          <Button icon={<AXFIRevert />} onClick={handleReset} size='small' type={"text"}>
            {btnT("초기화")}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact>{programFn?.fn01 && <Button onClick={handleSearch}>{t("검색")}</Button>}</ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value, changedValues) => setRequestValue(value, changedValues)}
          onSearch={handleSearch}
          spinning={spinning}
          disableFilter
        />
      </PageSearchBar>

      <PageTabBar>
        <Tabs
          items={[
            {
              key: "pg1",
              label: t("통계1"),
            },
            {
              key: "pg2",
              label: t("통계2"),
            },
          ]}
          onChange={(key) => setActiveTabKey(key as PanelType)}
          activeKey={activeTabKey}
        />
      </PageTabBar>

      <PanelIndex contentType={activeTabKey} />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const PageTabBar = styled(PageLayout.PageTabBar)``;

export default App;
