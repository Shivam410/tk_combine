import { useParams } from "react-router-dom";
import AddingServices from "../../../components/AddingServices/AddingServices";

const DynamicService = () => {
  const { id } = useParams();

  return (
    <div className="service">
      <div className="service1-content">
        <AddingServices title="Edit Service" serviceId={id} />
      </div>
    </div>
  );
};

export default DynamicService;
