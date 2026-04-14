import React from 'react';
import PropTypes from 'prop-types';

export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-200 text-base select-none" title="Admin">
        👑
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-200 text-base select-none" title="User">
      📖
    </span>
  );
}

export default function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
};