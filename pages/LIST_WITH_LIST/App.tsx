import React from "react";
import styled from "@emotion/styled";
import { ColResizer, ProgramTitle } from "@core/components/common";
import { AXFIRevert } from "@axframe/icon";
import { Button, Form } from "antd";

import { PageLayout } from "styles/pageStyled";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { useI18n, useUnmountEffect } from "@core/hooks";
import { use$LIST_WITH_LIST$Store } from "./use$LIST_WITH_LIST$Store";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { ListDataGrid } from "./ListDataGrid";
import { ChildListDataGrid } from "./ChildListDataGrid";
import { errorHandling } from "utils/errorHandling";

interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n();
  const _t = t.example;

  const init = use$LIST_WITH_LIST$Store((s) => s.init);
  const reset = use$LIST_WITH_LIST$Store((s) => s.reset);
  const destroy = use$LIST_WITH_LIST$Store((s) => s.destroy);
  const callListApi = use$LIST_WITH_LIST$Store((s) => s.callListApi);
  const callSaveApi = use$LIST_WITH_LIST$Store((s) => s.callSaveApi);
  const setFlexGrow = use$LIST_WITH_LIST$Store((s) => s.setFlexGrow);
  const listRequestValue = use$LIST_WITH_LIST$Store((s) => s.listRequestValue);
  const setRequestValue = use$LIST_WITH_LIST$Store((s) => s.setRequestValue);
  const spinning = use$LIST_WITH_LIST$Store((s) => s.spinning);
  const setListSelectedRowKey = use$LIST_WITH_LIST$Store((s) => s.setListSelectedRowKey);
  const flexGrow = use$LIST_WITH_LIST$Store((s) => s.flexGrow);
  const programFn = use$LIST_WITH_LIST$Store((s) => s.programFn);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

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
    (params: AXFDGClickParams<DtoItem>) => {
      if (params.item.id) setListSelectedRowKey(params.item.id, params.item);
    },
    [setListSelectedRowKey],
  );

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
          {programFn?.fn02 && (
            <Button
              type={"primary"}
              onClick={() => {
                callSaveApi();
              }}
            >
              {t.button.save}
            </Button>
          )}
        </ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value) => setRequestValue(value)}
          onSearch={handleSearch}
          spinning={spinning}
          disableFilter
        />
      </PageSearchBar>

      <Body ref={resizerContainerRef}>
        <Frame style={{ flex: flexGrow }}>
          <ListDataGrid onClick={onClickItem} />
        </Frame>
        <ColResizer containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
        <Frame style={{ flex: 2 - flexGrow }}>
          <ChildListDataGrid />
        </Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const Body = styled(PageLayout.FrameRow)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Frame = styled(PageLayout.FrameColumn)``;

export default App;
