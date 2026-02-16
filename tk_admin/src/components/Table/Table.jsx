import "./Table.scss";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

const Table = ({ rowData, columnDefs, tableLink }) => {
  const navigate = useNavigate();
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 130,
  };

  const handleRowClick = (event) => {
    const id = event.data.id;

    if (tableLink === "homeBanner") {
      navigate(`/home-banner/${id}`);
    } else if (tableLink === "portfolio") {
      navigate(`/portfolio/${id}`);
    } else if (tableLink === "teams") {
      navigate(`/team/${id}`);
    } else if (tableLink === "contact") {
      navigate(`/contact/${id}`);
    } else if (tableLink === "contact-2") {
      navigate(`/contact-2/${id}`);
    } else if (tableLink === "photoAlbum") {
      navigate(`/photoAlbum/${id}`);
    } else if (tableLink === "review") {
      navigate(`/review/${id}`);
    }
  };

  return (
    <div className="table">
      <div className="ag-theme-alpine admin-table">
        <AgGridReact
          pagination={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowHeight={60}
          paginationPageSize={10}
          domLayout="normal"
          onRowClicked={handleRowClick}
        />
      </div>
    </div>
  );
};

export default Table;
