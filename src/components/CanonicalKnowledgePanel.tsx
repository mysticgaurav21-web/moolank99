import React, { useEffect, useState } from "react";
import { AlertTriangle, Check, ShieldCheck, Sparkles, X } from "lucide-react";
import { motion } from "motion/react";

import type { CanonicalTrait } from "../types";
import { convertToHinglish } from "../utils/hinglish";

interface CanonicalKnowledgePanelProps {
  language?: string;
}

interface CanonicalKnowledgeResponse {
  success: boolean;
  moolank: number;
  canonicalTraits: CanonicalTrait[];
  canonicalTraitCount: number;
  error?: string;
}

export default function CanonicalKnowledgePanel({ language }: CanonicalKnowledgePanelProps) {
  const [selectedMoolank, setSelectedMoolank] = useState(1);
  const [traits, setTraits] = useState<CanonicalTrait[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const localize = (text: string): string => {
    return language === "hinglish" ? convertToHinglish(text) : text;
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadTraits = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/knowledge/moolank/${selectedMoolank}`, {
          signal: controller.signal
        });
        const data = (await response.json()) as CanonicalKnowledgeResponse;

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Verified knowledge could not be loaded.");
        }

        setTraits(data.canonicalTraits);
      } catch (requestError) {
        if ((requestError as Error).name !== "AbortError") {
          console.error("Canonical knowledge request failed:", requestError);
          setError("Verified knowledge is temporarily unavailable.");
          setTraits([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadTraits();
    return () => controller.abort();
  }, [selectedMoolank]);

  return (
    <section className="space-y-4" aria-labelledby="canonical-knowledge-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <h4 id="canonical-knowledge-heading" className="font-serif text-lg text-white">
              {localize("Canonical Knowledge")}
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {localize("Reviewed and versioned research used by app readings and AI guidance.")}
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

      {loading && (
        <div className="rounded-2xl border border-white/5 bg-neutral-950/40 p-6 text-xs text-slate-400 animate-pulse">
          {localize("Loading verified knowledge...")}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 flex gap-3 text-sm text-rose-200">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{localize(error)}</span>
        </div>
      )}

      {!loading && !error && traits.length === 0 && (
        <div className="rounded-2xl border border-white/5 bg-neutral-950/40 p-6 space-y-2">
          <p className="text-sm text-white font-medium">
            {localize(`Moolank ${selectedMoolank} canonical records are not imported yet.`)}
          </p>
          <p className="text-xs text-slate-400">
            {localize("The app will display them only after research, evidence review, and canonical approval are complete.")}
          </p>
        </div>
      )}

      {!loading && !error && traits.map((trait) => (
        <motion.article
          key={`${trait.traitId}-${trait.version}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/10 to-neutral-950/50 p-5 md:p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  {trait.status} v{trait.version}
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-gold">
                  {trait.traitId}
                </span>
              </div>
              <h5 className="text-xl font-serif text-white mt-3">
                {localize(`Moolank ${trait.moolank}: ${trait.traitName}`)}
              </h5>
              <p className="text-xs text-slate-400 mt-1 capitalize">
                {localize(trait.classification.replaceAll("-", " "))}
              </p>
            </div>
            <ShieldCheck size={28} className="text-emerald-400/80" />
          </div>

          <p className="text-sm leading-relaxed text-slate-200">
            {localize(trait.appSafeSummary)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-emerald-500/15 bg-emerald-950/10 p-4">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Check size={13} /> {localize("Strength")}
              </span>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">{localize(trait.appCard.strength)}</p>
            </div>
            <div className="rounded-xl border border-rose-500/15 bg-rose-950/10 p-4">
              <span className="text-[10px] uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                <X size={13} /> {localize("Conditional Shadow")}
              </span>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">{localize(trait.appCard.shadow)}</p>
            </div>
            <div className="rounded-xl border border-amber-500/15 bg-amber-950/10 p-4">
              <span className="text-[10px] uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                <Sparkles size={13} /> {localize("Growth Key")}
              </span>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">{localize(trait.appCard.growthKey)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h6 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                {localize("Balanced Expression")}
              </h6>
              <ul className="space-y-1.5">
                {trait.balancedExpression.slice(0, 4).map((item) => (
                  <li key={item} className="text-xs text-slate-300 flex gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{localize(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                {localize("Watch For")}
              </h6>
              <ul className="space-y-1.5">
                {trait.shadowExpression.slice(0, 4).map((item) => (
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
            {localize(`Traditional support: ${trait.confidence.numerologyTraditionSupport ?? "not rated"}. Scientific link to Moolank: ${trait.confidence.scientificEvidenceLinkingConstructToMoolank ?? "not established"}.`)}
            <br />
            {localize(trait.safetyNote)}
          </div>
        </motion.article>
      ))}
    </section>
  );
}
