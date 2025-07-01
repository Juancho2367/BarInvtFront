import { translations } from '../translations/es';

export const useTranslation = () => {
  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce((acc, [key, val]) => {
        return acc.replace(`{${key}}`, String(val));
      }, value);
    }
    
    return value;
  };

  return { t };
}; 