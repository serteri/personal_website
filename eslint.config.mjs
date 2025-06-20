import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next"; // <-- 1. YENİ: Next.js eklentisini import ediyoruz.

/** @type {import('eslint').Linter.Config} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // --- 2. YENİ: React ayarları eklendi ---
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        // 'React version not specified' uyarısını çözer.
        version: "detect"
      }
    }
  },

  // --- 3. YENİ: Next.js kuralları eklendi ---
  nextPlugin.configs.recommended,

  // Kendi özel kurallarınız (bu kalabilir)
  {
    "rules": {
      "react/react-in-jsx-scope": "off" // Modern Next.js'te React import etmek gerekmediği için bu kuralı kapatmak doğrudur.
    }
  },
];