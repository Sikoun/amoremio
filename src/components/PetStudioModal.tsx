'use client';

import React, { useState } from 'react';
import {
  CoupleData,
  PartnerId,
  PetType,
  PetCustomization,
  PetAccessoryHead,
  PetAccessoryNeck,
  PET_EMOJIS,
  PET_COLOR_PALETTES,
  HEAD_ACCESSORIES,
  NECK_ACCESSORIES,
} from '@/lib/types';
import { SinglePetPreview } from './graphics/CoupleMascot';
import { haptic } from '@/lib/haptics';
import { X, Check, Sparkles, RefreshCw, Heart } from 'lucide-react';

interface PetStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupleState: CoupleData;
  initialPartner?: PartnerId;
  onStateUpdated: (newState: CoupleData) => void;
}

type CategoryTab = 'species' | 'color' | 'head' | 'neck' | 'presets';

const SPECIES_LIST: { id: PetType; label: string; emoji: string; desc: string }[] = [
  { id: 'sealion', label: 'Sea Lion', emoji: '🦭', desc: 'Playful & cuddly' },
  { id: 'lion', label: 'Lion', emoji: '🦁', desc: 'Brave & warmhearted' },
  { id: 'bear', label: 'Teddy Bear', emoji: '🐻', desc: 'Gentle giant' },
  { id: 'bunny', label: 'Bunny', emoji: '🐰', desc: 'Soft & bouncy' },
  { id: 'cat', label: 'Kitten', emoji: '🐱', desc: 'Curious & sweet' },
  { id: 'fox', label: 'Fox', emoji: '🦊', desc: 'Clever & spunky' },
  { id: 'panda', label: 'Panda', emoji: '🐼', desc: 'Chubby & peaceful' },
  { id: 'penguin', label: 'Penguin', emoji: '🐧', desc: 'Dapper & loyal' },
];

interface StylePreset {
  id: string;
  name: string;
  icon: string;
  desc: string;
  head: PetAccessoryHead;
  neck: PetAccessoryNeck;
  colorId: string;
}

const PRESETS: StylePreset[] = [
  {
    id: 'royalty',
    name: 'Royal Prince',
    icon: '👑',
    desc: 'Golden crown with dapper bowtie',
    head: 'crown',
    neck: 'bowtie',
    colorId: 'default',
  },
  {
    id: 'sweetheart',
    name: 'Sweet Valentine',
    icon: '💖',
    desc: 'Sakura blossom with ruby heart locket',
    head: 'flower',
    neck: 'heart_locket',
    colorId: 'rose',
  },
  {
    id: 'cozy_winter',
    name: 'Cozy Winter',
    icon: '🧣',
    desc: 'Warm knit scarf with party hat',
    head: 'party_hat',
    neck: 'scarf',
    colorId: 'snow',
  },
  {
    id: 'cool_explorer',
    name: 'Cool Explorer',
    icon: '🕶️',
    desc: 'Wayfarer sunglasses with wild bandana',
    head: 'sunglasses',
    neck: 'bandana',
    colorId: 'peach',
  },
  {
    id: 'kawaii_sprout',
    name: 'Gentle Sprout',
    icon: '🌱',
    desc: 'Kawaii head sprout with gold bell',
    head: 'sprout',
    neck: 'bell',
    colorId: 'mint',
  },
  {
    id: 'angelic',
    name: 'Pure Angel',
    icon: '✨',
    desc: 'Glowing halo with heart locket',
    head: 'halo',
    neck: 'heart_locket',
    colorId: 'snow',
  },
];

export const PetStudioModal: React.FC<PetStudioModalProps> = ({
  isOpen,
  onClose,
  coupleState,
  initialPartner = 'partner1',
  onStateUpdated,
}) => {
  const [selectedPartner, setSelectedPartner] = useState<PartnerId>(initialPartner);
  const [activeTab, setActiveTab] = useState<CategoryTab>('species');
  const [isBouncing, setIsBouncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fallback helper to construct a valid PetCustomization
  const getCustomPet = (partner: PartnerId): PetCustomization => {
    const existing = coupleState[partner]?.customPet;
    const defaultSpecies: PetType = partner === 'partner1' ? 'sealion' : 'lion';
    const species = existing?.species || coupleState[partner]?.pet || defaultSpecies;
    return {
      species,
      colorShade: existing?.colorShade || 'default',
      headAccessory: existing?.headAccessory || (partner === 'partner1' ? 'sprout' : 'crown'),
      neckAccessory: existing?.neckAccessory || (partner === 'partner1' ? 'heart_locket' : 'bowtie'),
    };
  };

  const [p1Custom, setP1Custom] = useState<PetCustomization>(() => getCustomPet('partner1'));
  const [p2Custom, setP2Custom] = useState<PetCustomization>(() => getCustomPet('partner2'));

  if (!isOpen) return null;

  const currentCustom = selectedPartner === 'partner1' ? p1Custom : p2Custom;
  const partnerName = coupleState[selectedPartner]?.name || (selectedPartner === 'partner1' ? 'Gaspar' : 'Mi Amor');

  const updateCurrentCustom = (updater: (prev: PetCustomization) => PetCustomization) => {
    haptic.lightTap();
    if (selectedPartner === 'partner1') {
      setP1Custom(updater);
    } else {
      setP2Custom(updater);
    }
  };

  const handleSelectSpecies = (species: PetType) => {
    updateCurrentCustom((prev) => {
      // Check if current color exists for this species, else default
      const palettes = PET_COLOR_PALETTES[species] || [];
      const hasColor = palettes.some((p) => p.id === prev.colorShade);
      return {
        ...prev,
        species,
        colorShade: hasColor ? prev.colorShade : 'default',
      };
    });
  };

  const handleSelectColor = (colorId: string) => {
    updateCurrentCustom((prev) => ({
      ...prev,
      colorShade: colorId,
    }));
  };

  const handleSelectHead = (head: PetAccessoryHead) => {
    updateCurrentCustom((prev) => ({
      ...prev,
      headAccessory: head,
    }));
  };

  const handleSelectNeck = (neck: PetAccessoryNeck) => {
    updateCurrentCustom((prev) => ({
      ...prev,
      neckAccessory: neck,
    }));
  };

  const handleApplyPreset = (preset: StylePreset) => {
    haptic.celebration();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);

    updateCurrentCustom((prev) => {
      const palettes = PET_COLOR_PALETTES[prev.species] || [];
      const hasColor = palettes.some((p) => p.id === preset.colorId);
      return {
        ...prev,
        headAccessory: preset.head,
        neckAccessory: preset.neck,
        colorShade: hasColor ? preset.colorId : 'default',
      };
    });
  };

  const handleReset = () => {
    haptic.lightTap();
    if (selectedPartner === 'partner1') {
      setP1Custom({
        species: 'sealion',
        colorShade: 'default',
        headAccessory: 'sprout',
        neckAccessory: 'heart_locket',
      });
    } else {
      setP2Custom({
        species: 'lion',
        colorShade: 'default',
        headAccessory: 'crown',
        neckAccessory: 'bowtie',
      });
    }
  };

  const handleSave = async () => {
    haptic.celebration();
    setIsSaving(true);
    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner1CustomPet: p1Custom,
          partner2CustomPet: p2Custom,
          partner1Pet: p1Custom.species,
          partner2Pet: p2Custom.species,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        onStateUpdated(updated);
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to save pet customization:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const currentPalettes = PET_COLOR_PALETTES[currentCustom.species] || [];
  const activeColor = currentPalettes.find((p) => p.id === currentCustom.colorShade) || currentPalettes[0];
  const activeHead = HEAD_ACCESSORIES.find((h) => h.id === currentCustom.headAccessory);
  const activeNeck = NECK_ACCESSORIES.find((n) => n.id === currentCustom.neckAccessory);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg max-h-[95vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-rose-200/80 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
                Pet Studio & Character Creator
              </h2>
              <p className="text-[11px] text-rose-500 font-medium">
                Customize spirit animals for you & your love
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-rose-200 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition active:scale-95 shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Partner Switcher Tabs */}
        <div className="px-4 pt-3 pb-2 bg-rose-50/50 flex gap-2 border-b border-rose-100/60">
          <button
            onClick={() => {
              haptic.lightTap();
              setSelectedPartner('partner1');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs ${
              selectedPartner === 'partner1'
                ? 'bg-rose-500 text-white shadow-rose-500/25 ring-2 ring-rose-300'
                : 'bg-white text-rose-700 hover:bg-rose-100/60 border border-rose-200/60'
            }`}
          >
            <span>{PET_EMOJIS[p1Custom.species]}</span>
            <span>{coupleState.partner1.name}&apos;s Pet</span>
          </button>

          <button
            onClick={() => {
              haptic.lightTap();
              setSelectedPartner('partner2');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs ${
              selectedPartner === 'partner2'
                ? 'bg-rose-500 text-white shadow-rose-500/25 ring-2 ring-rose-300'
                : 'bg-white text-rose-700 hover:bg-rose-100/60 border border-rose-200/60'
            }`}
          >
            <span>{PET_EMOJIS[p2Custom.species]}</span>
            <span>{coupleState.partner2.name}&apos;s Pet</span>
          </button>
        </div>

        {/* Spotlight Showcase Pedestal */}
        <div className="relative bg-gradient-to-b from-rose-50/70 via-white to-pink-50/30 pt-3 pb-2 flex flex-col items-center justify-center border-b border-rose-100/80">
          {/* Ambient Spotlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-200/30 via-transparent to-transparent pointer-events-none" />

          {/* Interactive Single Pet Canvas */}
          <div
            onClick={() => {
              haptic.heartbeat();
              setIsBouncing(true);
              setTimeout(() => setIsBouncing(false), 500);
            }}
            role="button"
            tabIndex={0}
            title="Tap your mascot to cuddle!"
            className="cursor-pointer select-none transition-transform active:scale-95 relative"
          >
            <SinglePetPreview
              customPet={currentCustom}
              isBouncing={isBouncing}
            />
          </div>

          {/* Equipping Summary Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1 px-4 text-[10px] font-semibold text-rose-700">
            <span className="bg-rose-100/80 px-2 py-0.5 rounded-full border border-rose-200/80">
              {PET_EMOJIS[currentCustom.species]} {SPECIES_LIST.find((s) => s.id === currentCustom.species)?.label}
            </span>
            <span className="bg-rose-100/80 px-2 py-0.5 rounded-full border border-rose-200/80">
              🎨 {activeColor?.name || 'Default'}
            </span>
            {activeHead?.id !== 'none' && (
              <span className="bg-amber-100/80 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                {activeHead?.icon} {activeHead?.label}
              </span>
            )}
            {activeNeck?.id !== 'none' && (
              <span className="bg-pink-100/80 text-pink-800 px-2 py-0.5 rounded-full border border-pink-200">
                {activeNeck?.icon} {activeNeck?.label}
              </span>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-rose-100 bg-white px-2 py-1 gap-1 overflow-x-auto scrollbar-none text-xs font-bold">
          <button
            onClick={() => {
              haptic.lightTap();
              setActiveTab('species');
            }}
            className={`py-1.5 px-3 rounded-xl whitespace-nowrap transition ${
              activeTab === 'species'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            🐾 Species
          </button>
          <button
            onClick={() => {
              haptic.lightTap();
              setActiveTab('color');
            }}
            className={`py-1.5 px-3 rounded-xl whitespace-nowrap transition ${
              activeTab === 'color'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            🎨 Coat Color
          </button>
          <button
            onClick={() => {
              haptic.lightTap();
              setActiveTab('head');
            }}
            className={`py-1.5 px-3 rounded-xl whitespace-nowrap transition ${
              activeTab === 'head'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            👑 Headwear
          </button>
          <button
            onClick={() => {
              haptic.lightTap();
              setActiveTab('neck');
            }}
            className={`py-1.5 px-3 rounded-xl whitespace-nowrap transition ${
              activeTab === 'neck'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            🧣 Neckwear
          </button>
          <button
            onClick={() => {
              haptic.lightTap();
              setActiveTab('presets');
            }}
            className={`py-1.5 px-3 rounded-xl whitespace-nowrap transition ${
              activeTab === 'presets'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            ✨ Themes
          </button>
        </div>

        {/* Drawer Body for Active Category */}
        <div className="flex-1 overflow-y-auto p-4 min-h-[190px] max-h-[300px] bg-rose-50/20">
          {/* 1. SPECIES GRID */}
          {activeTab === 'species' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SPECIES_LIST.map((item) => {
                const isSelected = currentCustom.species === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSpecies(item.id)}
                    className={`p-2.5 rounded-2xl border text-left transition flex flex-col items-center justify-center text-center relative ${
                      isSelected
                        ? 'bg-white border-rose-500 ring-2 ring-rose-400 shadow-sm'
                        : 'bg-white/80 border-rose-100 hover:border-rose-200 hover:bg-white'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                    <span className="text-3xl mb-1">{item.emoji}</span>
                    <span className="font-bold text-xs text-rose-950">{item.label}</span>
                    <span className="text-[10px] text-rose-400">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. COLOR COAT PALETTE */}
          {activeTab === 'color' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {currentPalettes.map((palette) => {
                const isSelected = currentCustom.colorShade === palette.id;
                return (
                  <button
                    key={palette.id}
                    onClick={() => handleSelectColor(palette.id)}
                    className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-white border-rose-500 ring-2 ring-rose-400 shadow-sm'
                        : 'bg-white/80 border-rose-100 hover:border-rose-200 hover:bg-white'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border border-black/10 shadow-inner shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-rose-950 truncate">{palette.name}</p>
                      <p className="text-[10px] text-rose-400">
                        {isSelected ? '✓ Selected' : 'Tap to apply'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 3. HEADWEAR ACCESSORIES */}
          {activeTab === 'head' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {HEAD_ACCESSORIES.map((item) => {
                const isSelected = currentCustom.headAccessory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectHead(item.id)}
                    className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-white border-rose-500 ring-2 ring-rose-400 shadow-sm'
                        : 'bg-white/80 border-rose-100 hover:border-rose-200 hover:bg-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-xl shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-rose-950 truncate">{item.label}</p>
                      <p className="text-[10px] text-rose-400">
                        {isSelected ? '✓ Equipped' : 'Equip'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 4. NECKWEAR ACCESSORIES */}
          {activeTab === 'neck' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {NECK_ACCESSORIES.map((item) => {
                const isSelected = currentCustom.neckAccessory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectNeck(item.id)}
                    className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-white border-rose-500 ring-2 ring-rose-400 shadow-sm'
                        : 'bg-white/80 border-rose-100 hover:border-rose-200 hover:bg-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-xl shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-rose-950 truncate">{item.label}</p>
                      <p className="text-[10px] text-rose-400">
                        {isSelected ? '✓ Equipped' : 'Equip'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 5. QUICK THEMES & PRESETS */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className="p-3 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 hover:shadow-xs transition text-left flex items-start gap-3 active:scale-98"
                >
                  <span className="text-2xl p-2 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100 shrink-0">
                    {preset.icon}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-rose-950">{preset.name}</h4>
                    <p className="text-[11px] text-rose-500 mt-0.5 leading-snug">{preset.desc}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      Apply Look ✨
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-white border-t border-rose-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition active:scale-95 flex items-center gap-1.5"
            title="Reset to default mascot style"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold transition active:scale-95 shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Mascots Saved! 💕</span>
              </>
            ) : isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Style...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Save Mascot Styles ✨</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
