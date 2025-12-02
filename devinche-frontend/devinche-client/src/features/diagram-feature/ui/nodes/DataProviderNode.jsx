const DataProviderNode = ({ data }) => {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-x-0 top-0 h-4 w-12 border border-black bg-white rounded-full mx-auto z-10"></div>
      <div className="absolute inset-x-0 top-2 h-14 w-12 border-x border-b border-black bg-white rounded-b-lg mx-auto"></div>
      <div className="relative z-30 text-xs" style={{ padding: 10 }}>{data.label}</div>
    </div>
  );
};

export default DataProviderNode;
