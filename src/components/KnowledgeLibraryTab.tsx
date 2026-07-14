import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  Search,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";

import { knowledgeArticles } from "../data/knowledgeArticles";
import { convertToHinglish } from "../utils/hinglish";

interface KnowledgeLibraryTabProps {
  language?: string;
}

interface CanonicalTrait {
  traitId: string;
  moolank: number;
  traitName: string;
  version: string;
  status: string;
  classification: string;
  canonicalDefinition: string;
  appSafeSummary: string;
  balancedExpression: string[];
  shadowExpression: string[];
  primaryTriggers: string[];
  appCard: {
    strength: string;
    shadow: string;
    growthKey: string;
  };
  confidence: {
    numerologyTraditionSupport: string;
    supportForConditionalRushedDecisions: string;
    scientificEvidenceLinkingConstructToMoolank: string;
  };
  safetyNote: string;
}

type ArticleCategory = "all" | "basics" | "planets" | "chakras" | "philosophy" | "habits";

const categories: Array<{ id: ArticleCategory; label: string }> = [
  { id: "all", label: "All Wisdom" },
  { id: "basics", label: "Numerology Basics" },
  { id: "planets", label: "Cosmic Planets" },
  { id: "chakras", label: "The Chakra System" },
  { id: "philosophy", label: "Vedic Philosophy" },
  { id: "habits", label: "Habit & Breath Science" }
];

export default function KnowledgeLibraryTab({ language }: KnowledgeLibraryTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ArticleCategory>("all");
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [selectedMoolank, setSelectedMoolank] = useState(1);
  const [canonicalTrait, setCanonicalTrait] = useState<CanonicalTrait | null>(null);
  const [canonicalLoading, setCanonicalLoading] = useState(false);
  const [canonicalError, setCanonicalError] = useState<string | null>(null);

  const localize = (text: string): string => {
    return language === "hinglish" ? convertToHinglish(text) : text;
  };

  useEffect(() => {
    const controller = new AbortController();

    if (selectedMoolank !== 1) {
      setCanonicalTrait(null);
      setCanonicalError(null);
      setCanonicalLoading(false);
      return () => controller.abort();
    }

    const loadCanonicalKnowledge = async () => {
      setCanonicalLoading(true);
      setCanonicalError(null);

      try {
        const response = await fetch(
          "/knowledge/moolank-1/ID-016-impulse-control.v1.2.json",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Knowledge file could not be loaded (${response.status}).`);
        }

        const data = (await response.json()) as CanonicalTrait;
        setCanonicalTrait(data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Canonical knowledge loading failed:", error);
          setCanonicalError("Verified knowledge is temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setCanonicalLoading(false);
        }
      }
    };

    loadCanonicalKnowledge();
    return () => controller.abort();
  }, [selectedMoolank]);

  const translatedArticles = useMemo(() => {
    if (language !== "hinglish") return knowledgeArticles;

    return knowledgeArticles.map((article) => ({
      ...article,
      title: convertToHinglish(article.title),
      excerpt: convertToHinglish(article.excerpt),
      content: convertToHinglish(article.content)
    }));
  }, [language]);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return translatedArticles.filter((article) => {
      const matchesCategory = activeCategory === "all" || article.category === activeCategory;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.excerpt.toLowerCase().includes(normalizedQuery) ||
        article.content.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, translatedArticles]);

  return (
    <div
      id="knowledge-library-container"
      className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-md glow-purple"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 text-gold px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <BookMarked size={12} />
            <span>{localize("Wisdom Library")}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-light text-white tracking-tight">
            {localize("The Codex of")} <span className="text-gold italic font-medium">{localize("Verified Knowledge")}</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            {localize("Canonical research records are separated from traditional articles so the app can distinguish reviewed knowledge from general spiritual material.")}
          </p>
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={localize("Search the library...")}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all placeholder-slate-500"
          />
        </div>
      </div>

      <section className="space-y-4" aria-labelledby="canonical-knowledge-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-emerald-400" />
              <h4 id="canonical-knowledge-heading" className="font-serif text-lg text-white">
                {localize("Canonical Knowledge")}
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {localize("Only reviewed and versioned traits appear in this section.")}
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-400">
            <span>{localize("Moolank")}</span>
            <select
              value={selectedMoolank}
              onChange={(event) => setSelectedMoolank(Number(event.target.value))}
              className="bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold"
            >
              {Array.from({ length: 9 }, (_, index) => index + 1).map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </label>
        </div>

        {canonicalLoading && (
          <div className="rounded-2xl border border-white/5 bg-neutral-950/40 p-6 text-xs text-slate-400 animate-pulse">
            {localize("Loading verified knowledge...")}
          </div>
        )}

        {canonicalError && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 flex gap-3 text-sm text-rose-200">
            <AlertTriangle size={18} className="shrink-0" />
            <span>{localize(canonicalError)}</span>
          </div>
        )}

        {!canonicalLoading && !canonicalError && selectedMoolank !== 1 && (
          <div className="rounded-2xl border border-white/5 bg-neutral-950/40 p-6 space-y-2">
            <p className="text-sm text-white font-medium">
              {localize(`Moolank ${selectedMoolank} canonical records are not imported yet.`)}
            </p>
            <p className="text-xs text-slate-400">
              {localize("The app will show them only after their research, evidence review, and canonical version are completed.")}
            </p>
          </div>
        )}

        {canonicalTrait && selectedMoolank === canonicalTrait.moolank && (
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/10 to-neutral-950/50 p-5 md:p-6 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    {canonicalTrait.status} v{canonicalTrait.version}
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-gold">
                    {canonicalTrait.traitId}
                  </span>
                </div>
                <h5 className="text-xl font-serif text-white mt-3">
                  {localize(`Moolank ${canonicalTrait.moolank}: ${canonicalTrait.traitName}`)}
                </h5>
                <p className="text-xs text-slate-400 mt-1 capitalize">
                  {canonicalTrait.classification.replaceAll("-", " ")}
                </p>
              </div>
              <ShieldCheck size={28} className="text-emerald-400/80" />
            </div>

            <p className="text-sm leading-relaxed text-slate-200">
              {localize(canonicalTrait.appSafeSummary)}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-emerald-500/15 bg-emerald-950/10 p-4">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <Check size={13} /> {localize("Strength")}
                </span>
                <p className="text-xs text-slate-200 mt-2 leading-relaxed">{localize(canonicalTrait.appCard.strength)}</p>
              </div>
              <div className="rounded-xl border border-rose-500/15 bg-rose-950/10 p-4">
                <span className="text-[10px] uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                  <X size={13} /> {localize("Conditional Shadow")}
                </span>
                <p className="text-xs text-slate-200 mt-2 leading-relaxed">{localize(canonicalTrait.appCard.shadow)}</p>
              </div>
              <div className="rounded-xl border border-amber-500/15 bg-amber-950/10 p-4">
                <span className="text-[10px] uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                  <Sparkles size={13} /> {localize("Growth Key")}
                </span>
                <p className="text-xs text-slate-200 mt-2 leading-relaxed">{localize(canonicalTrait.appCard.growthKey)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h6 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">{localize("Balanced Expression")}</h6>
                <ul className="space-y-1.5">
                  {canonicalTrait.balancedExpression.slice(0, 4).map((item) => (
                    <li key={item} className="text-xs text-slate-300 flex gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>{localize(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">{localize("Watch For")}</h6>
                <ul className="space-y-1.5">
                  {canonicalTrait.shadowExpression.slice(0, 4).map((item) => (
                    <li key={item} className="text-xs text-slate-300 flex gap-2">
                      <span className="text-rose-400">•</span>
                      <span>{localize(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300">{localize("Evidence note:")}</strong>{" "}
              {localize(`Tradition support is ${canonicalTrait.confidence.numerologyTraditionSupport}; a scientific link between this trait and Moolank is ${canonicalTrait.confidence.scientificEvidenceLinkingConstructToMoolank}.`)}
              <br />
              {localize(canonicalTrait.safetyNote)}
            </div>
          </motion.article>
        )}
      </section>

      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-t border-white/5 pt-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`relative px-4 py-2 rounded-xl text-xs font-display font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeCategory === category.id ? "text-gold" : "text-slate-400 hover:text-white"
            }`}
          >
            {activeCategory === category.id && (
              <motion.div
                layoutId="active-library-category"
                className="absolute inset-0 bg-amber-500/10 border border-amber-500/25 rounded-xl"
              />
            )}
            <span className="relative z-10">{localize(category.label)}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => {
            const isExpanded = expandedArticleId === article.id;

            return (
              <motion.div
                key={article.id}
                layout="position"
                className="bg-neutral-950/40 hover:bg-neutral-950/60 border border-white/5 hover:border-gold/25 rounded-2xl transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                  className="w-full text-left p-5 md:p-6 flex justify-between items-start gap-4 cursor-pointer"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold font-mono text-gold bg-amber-500/10 border border-gold/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{article.readingTime}</span>
                    </div>
                    <h4 className="text-base font-serif font-semibold text-white tracking-tight">{article.title}</h4>
                    {!isExpanded && <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{article.excerpt}</p>}
                  </div>
                  <div className={`p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-gold" : ""}`}>
                    <ChevronDown size={14} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-white/5"
                    >
                      <div className="p-6 md:p-8 text-sm leading-relaxed text-slate-300 whitespace-pre-line bg-white/[0.01]">
                        {article.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <BookOpen size={24} className="mx-auto text-slate-600" />
            <p className="text-xs">{localize(`No articles found for “${searchQuery}”.`)}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
