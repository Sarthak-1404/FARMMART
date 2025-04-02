import React from 'react';
import UserMenu from '../components/UserMenu';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector(state => state.user) || {};

  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px_auto] h-full">
        {/* Left for menu */}
        <div className="py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r">
          <UserMenu />
        </div>

        {/* Right for content */}
        <div className="bg-white h-full">
          <h2 className="text-xl font-bold mb-4">My Account</h2>
          <p>{user?.name || 'User'} {user?.isAdmin && <span className="text-red-500">(Admin)</span>}</p>
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
