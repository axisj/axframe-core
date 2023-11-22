import React from "react";
import styled from "@emotion/styled";
import { ProgramTitle } from "@core/components/common";
import { AXFIRevert } from "@axframe/icon";
import { Button, Form, Tabs } from "antd";
import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { useI18n, useUnmountEffect } from "@core/hooks";
import { PanelType, use$STATS$Store } from "./use$STATS$Store";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { PanelIndex } from "./PanelIndex";
import { errorHandling } from "utils/errorHandling";

interface Props {}

function App({}: Props) {
  const { t } = useI18n();
  const _t = t.example;

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
          placeholder: _t.label.area,
          name: "select1",
          type: SearchParamType.SELECT,
          options: _t.options.area,
        },
        {
          placeholder: _t.label.cnsltHow,
          name: "select2",
          type: SearchParamType.SELECT,
          options: _t.options.cnsltHow,
        },
        {
          placeholder: _t.label.cnsltDt,
          name: "timeRange",
          type: SearchParamType.DATE_RANGE,
        },
      ] as IParam[],
    [_t],
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
            {t.button.reset}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact>
          {programFn?.fn01 && <Button onClick={handleSearch}>{t.button.search}</Button>}
        </ButtonGroup>
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
              label: _t.title.stats_pg1,
            },
            {
              key: "pg2",
              label: _t.title.stats_pg2,
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
