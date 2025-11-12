import { motion } from "framer-motion";

type FilterType = "all" | "websites" | "social" | "branding";

interface WorkFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  lang: "en" | "es";
}

export function WorkFilters({ activeFilter, onFilterChange, lang }: WorkFiltersProps) {
  const filters: { value: FilterType; label: { en: string; es: string } }[] = [
    { value: "all", label: { en: "All", es: "Todo" } },
    { value: "websites", label: { en: "Websites", es: "Sitios Web" } },
    { value: "social", label: { en: "Social Media", es: "Redes Sociales" } },
    { value: "branding", label: { en: "Branding", es: "Marca" } },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {filters.map((filter) => (
        <motion.button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
            activeFilter === filter.value
              ? "bg-foreground text-background shadow-medium"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {filter.label[lang]}
          {activeFilter === filter.value && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-foreground rounded-full -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
