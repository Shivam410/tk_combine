import { useParams } from "react-router-dom";
import AddingServices from "../../../components/AddingServices/AddingServices";

const ViewService = () => {
  const { id } = useParams();

  return (
    <div className="service">
      <div className="service1-content">
        <AddingServices title="View Service" serviceId={id} readOnly={true} />
      </div>
    </div>
  );
};

export default ViewService;
