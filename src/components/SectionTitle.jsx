const SectionTitle = ({ text }) => {
  return (
    <div className='border-b border-base-300 pb-2'>
      <h2 className='text-xl md:text-2xl lg:text-2xl font-medium tracking-wider capitalize'>{text}</h2>
    </div>
  );
};
export default SectionTitle;
