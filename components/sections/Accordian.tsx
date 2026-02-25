import React, { createContext, useContext, useState } from "react";

type AccordionContextType = {
  openItem: string | null;
  setOpenItem: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

type AccordionProps = {
  children: React.ReactNode;
  defaultOpen?: string;
};

export const Accordion = ({ children, defaultOpen }: AccordionProps) => {
  const [openItem, setOpenItemState] = useState<string | null>(
    defaultOpen || null
  );

  const setOpenItem = (id: string) => {
    setOpenItemState((prev) => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className="w-full rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur-sm divide-y divide-neutral-200">
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

type AccordionItemProps = {
  id: string; // e.g. "01", "02"
  title: string;
  description?: string; // short inline description under title
  children: React.ReactNode; // full body content
};

export const AccordionItem = ({
  id,
  title,
  description,
  children,
}: AccordionItemProps) => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("AccordionItem must be used inside Accordion");
  }

  const { openItem, setOpenItem } = context;
  const isOpen = openItem === id;
  const panelId = `accordion-panel-${id}`;
  const buttonId = `accordion-trigger-${id}`;

  return (
    <div className="bg-transparent">
      <button
        id={buttonId}
        type="button"
        onClick={() => setOpenItem(id)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full py-5 px-5 flex items-start gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <span className="text-xs font-mono text-neutral-400 pt-1">{id}</span>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-900">{title}</p>
              {description && (
                <p className="mt-1 text-xs text-neutral-500">{description}</p>
              )}
            </div>
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            >
              <svg
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  d="M6 8l4 4 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 pl-14 pr-5 text-sm text-neutral-600 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};