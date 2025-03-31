import Link from "next/link";
import { usePathname } from 'next/navigation'

import { ReactNode } from "react";

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={`px-5 py-2 ${isActive ? "bg-teal-600 rounded-lg text-white font-bold" : "text-gray-600 font-medium"}`}>
            {children}
        </Link>
    );
};

const Navbar = () => {
    return (
        <nav className="flex justify-center p-4">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/dashboard/appointments">Customer Appointments</NavLink>
            <NavLink href="/dashboard/schedule">Staff Schedule</NavLink>
            <NavLink href="/dashboard/settings">Settings</NavLink>
        </nav>
    );
};

export default Navbar;
