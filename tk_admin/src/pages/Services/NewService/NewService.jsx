import AddingServices from "../../../components/AddingServices/AddingServices";

const NewService = () => {
  return (
    <div className="service">
      <div className="service1-content">
        <AddingServices title="Create Service" isCreate={true} />
      </div>
    </div>
  );
};

export default NewService;
