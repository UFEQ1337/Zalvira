import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/ui/icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo i informacja o firmie */}
          <div className="lg:col-span-2">
            <Logo className="h-8 w-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 mb-6 max-w-md">
              {siteConfig.name} oferuje szeroki wybór gier kasynowych online, w
              tym sloty, gry stołowe i kasyno na żywo. Gramy odpowiedzialnie i
              bezpiecznie.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <span className="sr-only">Facebook</span>
                <Icons.facebook className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <span className="sr-only">Twitter</span>
                <Icons.twitter className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <span className="sr-only">Instagram</span>
                <Icons.instagram className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <span className="sr-only">YouTube</span>
                <Icons.youtube className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Linki w stopce */}
          {siteConfig.footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wider uppercase mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dolny pasek z licencją i informacjami o płatnościach */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>
                © {currentYear} {siteConfig.name}. Wszelkie prawa zastrzeżone.
              </p>
              <p className="mt-1">
                Gra hazardowa jest rozrywką dla osób pełnoletnich i może
                uzależniać. Graj odpowiedzialnie.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Akceptujemy:
              </span>
              <div className="flex space-x-3">
                <Icons.visa className="h-6 w-8 text-gray-400" />
                <Icons.mastercard className="h-6 w-8 text-gray-400" />
                <Icons.paypal className="h-6 w-8 text-gray-400" />
                <Icons.bitcoin className="h-6 w-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Certyfikaty i licencje */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="bg-slate-200 dark:bg-slate-800 rounded-md p-2 flex items-center space-x-2">
              <Icons.shield className="h-5 w-5 text-green-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                SSL Secured
              </span>
            </div>
            <div className="bg-slate-200 dark:bg-slate-800 rounded-md p-2 flex items-center space-x-2">
              <Icons.check className="h-5 w-5 text-green-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Licencja MGA
              </span>
            </div>
            <div className="bg-slate-200 dark:bg-slate-800 rounded-md p-2 flex items-center space-x-2">
              <Icons.lock className="h-5 w-5 text-green-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Bezpieczne Płatności
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
