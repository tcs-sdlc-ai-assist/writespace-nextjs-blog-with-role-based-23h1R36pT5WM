"use client";

import PropTypes from "prop-types";

export function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg transition-transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide opacity-80">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
};

StatCard.defaultProps = {
  icon: null,
};

export default StatCard;