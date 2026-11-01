'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLang } from './LangProvider';

export interface Step {
  id: string; ar: string; en: string; nextAr?: string; nextEn?: string;
  content: ReactNode;                       // panel; put an <h3 tabIndex={-1}> first so focus can move there
  validate?: () => string | null;           // return an error message to block "Next"
}

/** Generic multi-step flow. Native input validation runs first, then the step's own validate().
 *  All panels stay mounted (hidden) so typed values survive Back/Next. Focus moves to the new step heading. */
export function CheckoutSteps({ steps }: { steps: Step[] }) {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const [msg, setMsg] = useState('');
  const panels = useRef<(HTMLElement | null)[]>([]);
  const moved = useRef(false);

  const go = (d: 1 | -1) => {
    const to = i + d;
    if (to < 0 || to >= steps.length) return;
    if (d > 0) {
      const fields = panels.current[i]?.querySelectorAll<HTMLInputElement>('input,select,textarea') ?? [];
      for (const el of Array.from(fields)) if (!el.checkValidity()) { el.reportValidity(); return; }
      const err = steps[i].validate?.() ?? null;
      if (err) { setMsg(err); return; }
    }
    setMsg(''); moved.current = true; setI(to);
  };
  useEffect(() => { if (moved.current) panels.current[i]?.querySelector<HTMLElement>('h3')?.focus(); }, [i]);

  const s = steps[i];
  return (
    <div className="aq-card">
      <ol className="aq-steps" aria-label={t('خطوات الطلب', 'Steps')}>
        {steps.map((st, k) => (
          <li key={st.id} className="aq-step" aria-current={k === i ? 'step' : undefined} data-done={k < i ? '' : undefined}>{t(st.ar, st.en)}</li>
        ))}
      </ol>
      {steps.map((st, k) => (
        <section key={st.id} className="aq-panel" hidden={k !== i} ref={(el) => { panels.current[k] = el; }}>{st.content}</section>
      ))}
      <p role="alert" style={{ color: 'var(--aq-danger)', marginBlockStart: 'var(--aq-s-3)' }}>{msg}</p>
      {i < steps.length - 1 && (
        <div className="aq-actions">
          <button type="button" className="aq-btn aq-btn--ghost" style={{ visibility: i === 0 ? 'hidden' : 'visible' }} onClick={() => go(-1)}>{t('رجوع', 'Back')}</button>
          <button type="button" className="aq-btn aq-btn--primary" onClick={() => go(1)}>{t(s.nextAr ?? 'التالي', s.nextEn ?? 'Next')}</button>
        </div>
      )}
    </div>
  );
}
