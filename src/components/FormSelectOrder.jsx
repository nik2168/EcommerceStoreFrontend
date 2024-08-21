const FormSelectOrder = ({ label, name, list, defaultValue, size, value, setValue }) => {
  
const changeValue = (e) => {
  const curVal = e.currentTarget.value;
  if(curVal === 'none'){
    setValue('')
  }
  else if(curVal === 'a-z' || curVal === 'low') setValue('1')
    else setValue('-1')
}

  return (
    <div className='form-control'>
      <label htmlFor={name} className='label'>
        <span className='label-text capitalize'>{label}</span>
      </label>
      <select
        name={name}
        id={name}
        className={`select select-bordered ${size}`}
        value={value}
        onChange={(e) => changeValue(e)}
        defaultValue={defaultValue}
      >
        {list?.map((item) => {
          return (
            <option key={item} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
};
export default FormSelectOrder;
