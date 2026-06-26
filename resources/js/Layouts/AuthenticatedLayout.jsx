import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { HomeIcon, TruckIcon, RectangleGroupIcon, ClipboardDocumentListIcon, UserGroupIcon, CheckCircleIcon, BuildingLibraryIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const getNavigationLinks = () => {
        const links = [];
        if (user.role === 'admin') {
            links.push({ name: 'Dasbor Admin', href: route('admin.dashboard'), active: route().current('admin.dashboard'), icon: HomeIcon });
            links.push({ name: 'Cabang Dapur (SPPG)', href: route('admin.sppg-units.index'), active: route().current('admin.sppg-units.*'), icon: BuildingStorefrontIcon });
            links.push({ name: 'Data Supplier', href: route('admin.suppliers.index'), active: route().current('admin.suppliers.*'), icon: TruckIcon });
            links.push({ name: 'Karyawan', href: route('admin.users.index'), active: route().current('admin.users.*'), icon: UserGroupIcon });
            links.push({ name: 'Sekolah Mitra', href: route('admin.schools.index'), active: route().current('admin.schools.*'), icon: BuildingLibraryIcon });
            links.push({ name: 'Persetujuan (PO)', href: route('admin.approvals.index'), active: route().current('admin.approvals.*'), icon: CheckCircleIcon });
        } else if (user.role === 'kitchen_manager') {
            links.push({ name: 'Dasbor Dapur', href: route('kitchen.dashboard'), active: route().current('kitchen.dashboard'), icon: HomeIcon });
            links.push({ name: 'Inventaris', href: route('kitchen.inventory.index'), active: route().current('kitchen.inventory.*'), icon: RectangleGroupIcon });
            links.push({ name: 'Stok Masuk (PO)', href: route('kitchen.stok-masuk.index'), active: route().current('kitchen.stok-masuk.*'), icon: TruckIcon });
            links.push({ name: 'Jadwal Menu', href: route('kitchen.schedules.index'), active: route().current('kitchen.schedules.*'), icon: ClipboardDocumentListIcon });
            links.push({ name: 'Penugasan Kurir', href: route('kitchen.assignments.index'), active: route().current('kitchen.assignments.*'), icon: TruckIcon });
        } else if (user.role === 'driver') {
            links.push({ name: 'Dasbor Kurir', href: route('driver.dashboard'), active: route().current('driver.dashboard'), icon: TruckIcon });
        } else {
            links.push({ name: 'Dasbor', href: route('dashboard'), active: route().current('dashboard'), icon: HomeIcon });
        }
        return links;
    };

    return (
        <div className="min-h-screen bg-gray-900 flex text-gray-200 font-sans">
            {/* Sidebar Desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col bg-gray-900 border-r border-gray-800">
                <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-emerald-500" />
                        <span className="ml-3 text-xl font-bold tracking-wider text-gray-100">MBG System</span>
                    </div>
                    <div className="mt-8 flex-1 flex flex-col">
                        <nav className="flex-1 px-3 pb-4 space-y-1">
                            {getNavigationLinks().map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${
                                        item.active ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                                >
                                    <item.icon
                                        className={`${
                                            item.active ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-300'
                                        } mr-3 flex-shrink-0 h-6 w-6`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-950">
                <nav className="bg-gray-900 border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="shrink-0 flex items-center md:hidden">
                                    <Link href="/">
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-emerald-500" />
                                    </Link>
                                </div>
                            </div>

                            <div className="hidden sm:flex sm:items-center sm:ms-6">
                                <div className="ms-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-300 bg-gray-800 hover:text-gray-100 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.name} ({user.role})

                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content contentClasses="bg-gray-800 border border-gray-700">
                                            <Dropdown.Link href={route('profile.edit')} className="text-gray-300 hover:bg-gray-700 hover:text-white">Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-gray-300 hover:bg-gray-700 hover:text-white">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800 focus:outline-none focus:bg-gray-800 focus:text-gray-300 transition duration-150 ease-in-out"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-gray-900 border-b border-gray-800'}>
                        <div className="pt-2 pb-3 space-y-1">
                            {getNavigationLinks().map((item) => (
                                <ResponsiveNavLink key={item.name} href={item.href} active={item.active} className="text-gray-300 hover:text-white hover:bg-gray-800">
                                    {item.name}
                                </ResponsiveNavLink>
                            ))}
                        </div>

                        <div className="pt-4 pb-1 border-t border-gray-800">
                            <div className="px-4">
                                <div className="font-medium text-base text-gray-200">{user.name}</div>
                                <div className="font-medium text-sm text-gray-500">{user.email}</div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')} className="text-gray-300 hover:text-white hover:bg-gray-800">Profile</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-gray-300 hover:text-white hover:bg-gray-800">
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="bg-gray-900 border-b border-gray-800">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
