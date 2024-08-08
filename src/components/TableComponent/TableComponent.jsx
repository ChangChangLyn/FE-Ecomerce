import { Table } from "antd";
import React from "react";
import Loading from "../../components/LoadingComponent/Loading";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data = [],
    isLoading = false,
    columns = [],
  } = props;
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    getCheckboxPops: (record) => ({
      disable: record.name === "Disable user",
      name: record.name,
    }),
  };

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Table
          rowSelection={{ type: selectionType, ...rowSelection }}
          columns={columns}
          dataSource={data}
          {...props}
        />
      </Loading>
    </div>
  );
};

export default TableComponent;
