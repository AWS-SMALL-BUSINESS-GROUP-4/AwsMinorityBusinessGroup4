import React from 'react';

function Input({ type = 'text', placeholder, icon, ...props }) {
  return (
    <div className="input-group">
      <input type={type} placeholder={placeholder} {...props} />
      {icon && <span className="icon">{icon}</span>}
    </div>
  );
}

export default Input;