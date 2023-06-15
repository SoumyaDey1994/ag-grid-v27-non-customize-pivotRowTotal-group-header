import React, { useState, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-enterprise/dist/styles/ag-grid.css';
import 'ag-grid-enterprise/dist/styles/ag-theme-alpine.css';

const App = () => {
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Country',
      field: 'country',
      width: 120,
      rowGroup: true,
      enableRowGroup: true,
    },
    {
      headerName: 'Year',
      field: 'year',
      width: 90,
      pivot: true,
      enablePivot: true,
    },
    { headerName: 'Sport', field: 'sport', width: 110 },
    { headerName: 'Gold', field: 'gold', width: 100, aggFunc: 'sum' },
    { headerName: 'Silver', field: 'silver', width: 100, aggFunc: 'sum' },
    { headerName: 'Bronze', field: 'bronze', width: 100, aggFunc: 'sum' },
  ]);

  const [rowData, setRowData] = useState([]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 300,
    };
  }, []);

  const onGridReady = useCallback(() => {
    fetch(
      'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json'
    )
      .then((response) => response.json())
      .then((data) => {
        setRowData(data);
      });
  }, []);

  const onProcessSecondaryColGroupDef = (columnGroup) => {
    if (columnGroup.groupId.startsWith('PivotRowTotal_')) {
      columnGroup.headerName = 'Summary';
    }
  };
  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        onGridReady={onGridReady}
        animateRows={true}
        suppressExpandablePivotGroups={true}
        suppressAggFuncInHeader={true}
        pivotMode={true}
        pivotRowTotals="after"
        processSecondaryColGroupDef={onProcessSecondaryColGroupDef}
      ></AgGridReact>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
