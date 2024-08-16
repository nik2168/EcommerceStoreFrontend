
const SubmitBtn = ({ text, handleClick, isSubmitting }) => {

  return (
    <button
      type='submit'
      className='btn btn-primary btn-block'
      disabled={isSubmitting}
      onClick={(e) => handleClick(e)}
    >
      {isSubmitting ? (
        <>
          <span className='loading loading-spinner'></span>
          logging in...
        </>
      ) : (
        text || 'submit'
      )}
    </button>
  );
};
export default SubmitBtn;
