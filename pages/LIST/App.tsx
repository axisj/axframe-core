import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { ProgramTitle } from "@core/components/common";
import React from "react";
import { AXFIRevert } from "@axframe/icon";
import { PageLayout } from "styles/pageStyled";
import { useI18n } from "@core/hooks/useI18n";
import { use$LIST$Store } from "./use$LIST$Store";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { ListDataGrid } from "./ListDataGrid";
import { useLink, useUnmountEffect } from "hooks";
import { AXFDGClickParams } from "@axframe/datagrid";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { errorHandling } from "utils/errorHandling";
import { EXAMPLE_ROUTERS } from "@core/router/exampleRouter";

interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n();
  const _t = t.example;

  const { linkByRoute } = useLink();
  const init = use$LIST$Store((s) => s.init);
  const reset = use$LIST$Store((s) => s.reset);
  const destroy = use$LIST$Store((s) => s.destroy);
  const callListApi = use$LIST$Store((s) => s.callListApi);
  const listRequestValue = use$LIST$Store((s) => s.listRequestValue);
  const setListRequestValue = use$LIST$Store((s) => s.setListRequestValue);
  const spinning = use$LIST$Store((s) => s.listSpinning);
  const programFn = use$LIST$Store((s) => s.programFn);

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
      linkByRoute(EXAMPLE_ROUTERS.LIST_DETAIL.children.DETAIL, { id: params.item.id });
    },
    [linkByRoute],
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
        </ButtonGroup>
      </Header>

      <Body>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value, changedValues) => setListRequestValue(value, changedValues)}
          onSearch={handleSearch}
          spinning={spinning}
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
