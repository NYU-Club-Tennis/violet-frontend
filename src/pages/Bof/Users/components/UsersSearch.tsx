import React, { FC } from "react";
import { Input } from "antd";

const { Search } = Input;

interface UsersSearchProps {
  onSearch: (value: string) => void;
}

const UsersSearch: FC<UsersSearchProps> = ({ onSearch }) => {
  return (
    <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/30 p-6 mb-6">
      <Search
        placeholder="Search users by name or email..."
        onSearch={onSearch}
        style={{ width: 300 }}
        className="mb-4 [&_.ant-input]:bg-white/70 [&_.ant-input]:backdrop-blur-md [&_.ant-input]:border-white/30 [&_.ant-input]:rounded-xl [&_.ant-input]:focus:bg-white/90 [&_.ant-input]:focus:border-purple-500/50 [&_.ant-input]:focus:shadow-lg [&_.ant-input]:focus:shadow-purple-500/20"
      />
    </div>
  );
};

export default UsersSearch;
