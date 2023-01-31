import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
    useCelo,
  } from '@celo/react-celo';
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {

    let [componentInitialized, setComponentInitialized] = useState(false);
    let {
        initialised,
        address,
        connect,
        disconnect
    } = useCelo();

    useEffect(() => {
      if (initialised) {
        setComponentInitialized(true);
      }
    }, [initialised]);


    return (
      <Disclosure as="nav" className="bg-prosperity border-b border-black">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none focus:ring-1 focus:ring-inset focus:rounded-none focus:ring-black">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Image className="block h-8 w-auto lg:block" src="/logo.svg" width="24" height="24" alt="Celo Logo" />
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a
                      href="#"
                      className="inline-flex items-center border-b-2 border-black px-1 pt-1 text-sm font-medium text-gray-900"
                    >
                      Home
                    </a>
                    
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {componentInitialized && address ? (
                    <button
                      type="button"
                      className="inline-flex content-center place-items-center rounded-full border border-wood bg-black py-2 px-5 text-md font-medium text-snow hover:bg-forest"
                      onClick={disconnect}
                    >Disconnect</button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex content-center place-items-center rounded-full border border-wood bg-forest py-2 px-5 text-md font-medium text-snow hover:bg-black"
                      onClick={() =>
                        connect().catch((e) => console.log((e as Error).message))
                      }
                    >Connect</button>
                  )}
                </div>
              </div>
            </div>
  
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-4">
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block border-l-4 border-black py-2 pl-3 pr-4 text-base font-medium text-black"
                >
                  Home
                </Disclosure.Button>
                {/* Add here your custom menu elements */}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
  }