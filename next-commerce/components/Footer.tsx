'use client';
import { useLang } from './LangProvider';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="aq-foot">
      <div className="aq-wrap aq-foot__row">
        <span>{t('السوق · منظومة هويل', 'alSooq · Hawil ecosystem')}</span>
        <span>{t('واجهة أوّلية للعرض. الأرقام المعلَّمة «توضيحي» ليست أرقاماً فعلية، وشعارات الشركاء تُضاف بعد الاتفاقات.',
          'Prototype for review. Figures marked “Illustrative” are not actuals; partner logos are added only after agreements.')}</span>
      </div>
    </footer>
  );
}
