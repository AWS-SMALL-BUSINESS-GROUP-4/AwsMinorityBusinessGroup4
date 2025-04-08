import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

function PasswordInput({ placeholder, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-group">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        {...props}
      />
      <span className="icon"><FaLock /></span>
      <span
        className="toggle-password"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
}

export default PasswordInput;