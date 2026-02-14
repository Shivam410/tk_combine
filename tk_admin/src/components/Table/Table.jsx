import "./Table.scss";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

const Table = ({ rowData, columnDefs, tableLink }) => {
  const navigate = useNavigate();

  const handleRowClick = (event) => {
    const id = event.data.id;
    const bannertitle = event.data.bannerTitle;
    // navigate(`/home-banner/${bannerId}`);

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
      <div
        className="ag-theme-alpine admin-table"
        style={{ height: "100vh", width: "100%" }}
      >
        <AgGridReact
          pagination={true}
          rowData={rowData}
          columnDefs={columnDefs.map((col) => ({
            ...col,
            cellRendererFramework: col.cellRenderer, // Use React Component Renderer
          }))}
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
