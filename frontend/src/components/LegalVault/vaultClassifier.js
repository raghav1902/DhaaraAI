import {
  Folder,
  FileText,
  FileSearch,
  Mail,
  FileCheck,
  Award
} from 'lucide-react';

export const VAULT_FOLDERS = [
  { id: 'all', label: 'All Documents', labelHi: 'सभी दस्तावेज़', icon: Folder },
  { id: 'petitions', label: 'Drafted Petitions', labelHi: 'ड्राफ्ट याचिकाएं व FIR', icon: FileText },
  { id: 'audits', label: 'Audited Contracts', labelHi: 'समीक्षित अनुबंध', icon: FileSearch },
  { id: 'notices', label: 'Client Notices', labelHi: 'विधिक नोटिस', icon: Mail },
  { id: 'agreements', label: 'Agreements & NDAs', labelHi: 'समझौते व अनुबंध', icon: FileCheck },
  { id: 'affidavits', label: 'Affidavits & Declarations', labelHi: 'शपथ पत्र व घोषणाएं', icon: Award }
];

export function autoClassifyDraft(draft) {
  if (draft.folder && draft.folder !== 'All Documents' && draft.folder !== 'Uncategorized') {
    return draft.folder;
  }

  const typeLower = (draft.type || '').toLowerCase();
  const titleLower = (draft.title || '').toLowerCase();
  const contentLower = (draft.content || '').toLowerCase();
  const corpus = `${typeLower} ${titleLower} ${contentLower}`;

  if (
    typeLower.includes('audit') ||
    titleLower.includes('audit') ||
    corpus.includes('contract risk audit') ||
    corpus.includes('overall risk:') ||
    corpus.includes('flagged red flags') ||
    corpus.includes('problematic clause') ||
    corpus.includes('risk score')
  ) {
    return 'Audited Contracts';
  }

  if (
    typeLower.includes('notice') ||
    titleLower.includes('notice') ||
    corpus.includes('legal notice') ||
    corpus.includes('demand notice') ||
    corpus.includes('section 138') ||
    corpus.includes('negotiable instruments') ||
    corpus.includes('cease and desist') ||
    corpus.includes('eviction notice') ||
    corpus.includes('show cause') ||
    corpus.includes('hereby call upon you')
  ) {
    return 'Client Notices';
  }

  if (
    typeLower.includes('agreement') ||
    typeLower.includes('nda') ||
    typeLower.includes('contract') ||
    typeLower.includes('lease') ||
    typeLower.includes('rent') ||
    typeLower.includes('mou') ||
    corpus.includes('non-disclosure') ||
    corpus.includes('service agreement') ||
    corpus.includes('employment agreement') ||
    corpus.includes('tenancy agreement') ||
    corpus.includes('lease deed') ||
    corpus.includes('partnership deed') ||
    corpus.includes('now this agreement witnesseth')
  ) {
    return 'Agreements & NDAs';
  }

  if (
    typeLower.includes('affidavit') ||
    typeLower.includes('declaration') ||
    typeLower.includes('power of attorney') ||
    typeLower.includes('indemnity bond') ||
    corpus.includes('affidavit') ||
    corpus.includes('solemnly affirm') ||
    corpus.includes('deponent') ||
    corpus.includes('power of attorney') ||
    corpus.includes('indemnity bond') ||
    corpus.includes('verification:')
  ) {
    return 'Affidavits & Declarations';
  }

  return 'Drafted Petitions';
}

export function generateRandomPasscode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let res = '';
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}
