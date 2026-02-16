import "./Loader.scss";

const Loader = ({loaderSize}) => {
  return (
    <div className={`loader ${loaderSize}`}>
      <div className="wrapper">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
      </div>
    </div>
  );
};

export default Loader;
