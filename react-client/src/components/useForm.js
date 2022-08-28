import { useState } from 'react';

const useForm = (callback, initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    event.persist();
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let missing = checkMissing(values);
    if (missing) {
      setErrors(missing);
      return;
    }
    
    setErrors({});
    if (!callback()) {
      setValues(initialValues);
    }
  };

  const checkMissing = (values) => {
    let missing = {};
    let containsMissing = false;

    for (const field in values) {
      if (values[field] === '') {
        missing[field] = `Please enter a valid ${field}.`;
        containsMissing = true;
      }
    }

    if (containsMissing) return missing;

    return null;
  };

  return [ values, handleChange, handleSubmit, errors, setValues ];
};

export default useForm;
