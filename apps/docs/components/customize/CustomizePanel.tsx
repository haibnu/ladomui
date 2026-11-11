"use client";

import { useEffect, useState } from "react";
import { IconCheck } from "@ladom/icons";
import { Button, ColorInput, Drawer, FormField, Segment, Switch } from "@ladom/ui";
import { CodeBlock } from "../docs/CodeBlock";
import { useLocale } from "../useLocale";
import { setOpen, setTheme, useCustomize } from "./store";
import {
  agentPrompt,
  contrast,
  DEFAULT_THEME,
  installCommand,
  lowContrast,
  PRESETS,
  type Density,
} from "./theme";
import styles from "./customize.module.css";

// A labelled Ladom UI ColorInput: a swatch that opens the picker and the hex code beside it.
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <FormField label={label}>
      <ColorInput size="small" value={value} onValueChange={onChange} pickerLabel={label} />
    </FormField>
  );
}

/** The Customize drawer: brand color, density, Advanced surfaces, and how to install the theme. */
export function CustomizePanel() {
  const { lang, t } = useLocale();
  const c = t.customize;
  const { theme, open } = useCustomize();
  // Advanced starts open when the saved theme uses it; after that the reader opens and closes it.
  const [advanced, setAdvanced] = useState(false);
  useEffect(() => {
    if (open && (theme.secondary || theme.tertiary)) setAdvanced(true);
    // Only when the panel opens, not on every color change.
  }, [open]);

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      title={c.title}
      description={c.description}
      footer={
        <>
          <Button
            variant="ghost"
            tone="secondary"
            onClick={() => setTheme(DEFAULT_THEME)}
          >
            {c.reset}
          </Button>
          <Button onClick={() => setOpen(false)}>{c.done}</Button>
        </>
      }
    >
      <div className={styles.panel}>
        <section className={styles.section}>
          <h3 className={styles.heading}>{c.brand}</h3>
          <div className={styles.swatches} role="group" aria-label={c.brand}>
            {PRESETS.map((hex) => (
              <button
                key={hex}
                type="button"
                className={styles.swatch}
                style={{
                  background: hex,
                  color: contrast(hex, "#ffffff") >= 3 ? "#ffffff" : "#1c1a09",
                }}
                aria-label={c.swatch(hex)}
                aria-pressed={theme.brand === hex}
                onClick={() => setTheme({ brand: hex })}
              >
                {theme.brand === hex && <IconCheck size={16} />}
              </button>
            ))}
          </div>
          <ColorField
            label={c.custom}
            value={theme.brand}
            onChange={(brand) => setTheme({ brand })}
          />
          {lowContrast(theme.brand) && (
            <p className={styles.note}>{c.contrastNote}</p>
          )}
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>{c.density}</h3>
          <Segment
            size="small"
            fluid
            value={theme.density}
            onChange={(density) => setTheme({ density: density as Density })}
            options={[
              { value: "comfort", label: c.comfort },
              { value: "narrow", label: c.narrow },
            ]}
          />
        </section>

        <details
          className={styles.advanced}
          open={advanced}
          onToggle={(e) => setAdvanced(e.currentTarget.open)}
        >
          <summary className={styles.heading}>{c.advanced}</summary>
          {/* <details> does not lay its content out as flex items, so the gap lives on this wrapper. */}
          <div className={styles.section}>
            <p className={styles.note}>{c.advancedNote}</p>
            {(["secondary", "tertiary"] as const).map((name) => {
              const value = theme[name];
              return (
                <div key={name} className={styles.override}>
                  <Switch
                    label={`${c[name]}${value ? "" : ` · ${c.figmaDefault}`}`}
                    checked={Boolean(value)}
                    onChange={(e) =>
                      setTheme({
                        [name]: e.target.checked
                          ? name === "secondary"
                            ? "#e7e2d8"
                            : "#ffffff"
                          : null,
                      })
                    }
                  />
                  {value && (
                    <ColorField
                      label={c[name]}
                      value={value}
                      onChange={(hex) => setTheme({ [name]: hex })}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </details>

        <section className={styles.section}>
          <h3 className={styles.heading}>{c.install}</h3>
          <p className={styles.label}>{c.command}</p>
          <CodeBlock code={installCommand(theme)} />
          <p className={styles.label}>{c.prompt}</p>
          <CodeBlock
            className={styles.prompt}
            code={agentPrompt(theme, lang)}
          />
        </section>
      </div>
    </Drawer>
  );
}
