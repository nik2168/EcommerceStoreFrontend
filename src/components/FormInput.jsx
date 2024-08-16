const FormInput = ({ label, name, type, defaultValue, size, value, setValue }) => {
  return (
    <div className='form-control'>
      <label htmlFor={name} className='label'>
        <span className='label-text capitalize'>{label}</span>
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        className={`input input-bordered ${size}`}
      />
    </div>
  );
};
export default FormInput;
