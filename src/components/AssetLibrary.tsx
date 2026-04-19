import { useMemo, useState } from "react";
import { Boxes, Search, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { AssetCategory, AssetItem } from "@/types/studio";

const categories: Array<AssetCategory | "All"> = [
  "All",
  "Characters",
  "Environments",
  "Props",
  "Styles",
];

export function AssetLibrary({
  assets,
  selectedAssetId,
}: {
  assets: AssetItem[];
  selectedAssetId?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AssetCategory | "All">("All");

  const filtered = useMemo(() => {
    return assets.filter((asset) => {
      const matchesCategory = category === "All" || asset.category === category;
      const haystack = `${asset.name} ${asset.description} ${asset.tags.join(" ")}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [assets, category, query]);

  return (
    <Card className="relative min-h-0 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Smart Asset Library</CardTitle>
            <CardDescription>
              Search cinematic characters, environments, props, and premium styles.
            </CardDescription>
          </div>
          <Badge variant="cyan" className="gap-1">
            <Boxes className="h-3.5 w-3.5" />
            {assets.length} linked
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-foreground/35" />
          <Input
            className="pl-11"
            placeholder="Search bamboo forests, panda rigs, grade presets..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((entry) => (
            <button
              key={entry}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] transition",
                category === entry
                  ? "border-cyan/35 bg-cyan/12 text-cyan-bright"
                  : "border-border/70 bg-white/5 text-foreground/55 hover:border-cyan/25 hover:text-cyan-bright",
              )}
              onClick={() => setCategory(entry)}
            >
              {entry}
            </button>
          ))}
        </div>

        <ScrollArea className="min-h-0 flex-1 pr-1">
          <div className="space-y-3">
            {filtered.map((asset) => (
              <motion.article
                key={asset.id}
                className={cn(
                  "group rounded-[24px] border border-border/70 bg-white/4 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-cyan/35 hover:bg-cyan/6",
                  selectedAssetId === asset.id && "border-gold/35 bg-gold/8 shadow-gold",
                )}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 480, damping: 26 }}
              >
                <div className="mb-4 h-24 rounded-[20px] border border-white/5 bg-gradient-to-br from-cyan/12 via-transparent to-gold/12 p-4">
                  <div className="flex h-full items-end justify-between">
                    <Badge variant={asset.accent === "gold" ? "gold" : "cyan"}>
                      {asset.category}
                    </Badge>
                    {asset.status === "ready" ? (
                      <Sparkles className="h-5 w-5 text-cyan-bright" />
                    ) : (
                      <Wand2 className="h-5 w-5 text-gold-bright" />
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground/92">
                      {asset.name}
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-foreground/55">
                      {asset.description}
                    </p>
                  </div>
                  <Badge variant="ghost">{asset.status}</Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {asset.tags.map((tag) => (
                    <Badge key={tag} variant="ghost">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
