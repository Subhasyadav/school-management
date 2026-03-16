import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

const Breadcrumb: React.FC = () => {
  const pages = [
    { name: 'Dashboard', href: '#', current: true },
  ];

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
            <HomeIcon className="w-4 h-4 mr-2" />
            Home
          </a>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              <a
                href={page.href}
                className={`ml-1 text-sm font-medium md:ml-2 ${
                  page.current ? 'text-gray-500' : 'text-gray-700 hover:text-blue-600'
                }`}
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};