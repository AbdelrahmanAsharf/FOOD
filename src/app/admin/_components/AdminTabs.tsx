'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';

function AdminTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      title: 'Dashboard',
      href: '/admin',
    },
    {
      title: 'Categories',
      href: '/admin/categories',
    },
    {
      title: 'Menu Items',
      href: '/admin/menu-items',
    },
    {
      title: 'Users',
      href: '/admin/users',
    },
    {
      title: 'Orders',
      href: '/admin/orders',
    },
    {
      title: 'Branches',
      href: '/admin/branches',
    },
    {
      title: 'Extras',
      href: '/admin/extras',
    },
  ];

  const isActiveTab = (href: string) => pathname.startsWith(href);

  return (
    <nav className="mt-10">
      <ul className="flex items-center flex-wrap gap-4 justify-center">
        {tabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              className={`
                ${buttonVariants({ variant: isActiveTab(tab.href) ? 'default' : 'outline' })}
              `}
            >
              {tab.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AdminTabs;
