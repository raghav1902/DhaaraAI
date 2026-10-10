import {
  Sparkles,
  FileText,
  FileSearch,
  Shield,
  ArrowRightLeft,
  BookOpen,
  Lock,
  Calculator,
  Globe,
  Settings as SettingsIcon
} from 'lucide-react';

export const getNavSections = (isHindi) => [
  {
    title: isHindi ? 'विधिक कार्यक्षेत्र' : 'LEGAL WORKSPACES',
    items: [
      { id: 'chat', label: isHindi ? 'AI से पूछें' : 'Ask AI', shortLabel: isHindi ? 'AI पूछें' : 'Ask AI', icon: Sparkles },
      { id: 'drafting', label: isHindi ? 'विधिक ड्राफ्टिंग' : 'Legal Drafting', shortLabel: isHindi ? 'ड्राफ्टिंग' : 'Drafting', icon: FileText },
      { id: 'analyzer', label: isHindi ? 'अनुबंध समीक्षक' : 'Contract Audit', shortLabel: isHindi ? 'ऑडिट' : 'Analyzer', icon: FileSearch },
      { id: 'rights', label: isHindi ? 'नागरिक अधिकार & SOS' : 'Citizen Rights & SOS', shortLabel: isHindi ? 'अधिकार' : 'Rights', icon: Shield },
      { id: 'converter', label: isHindi ? 'BNS ↔ IPC' : 'BNS ↔ IPC', shortLabel: 'BNS/IPC', icon: ArrowRightLeft },
      { id: 'library', label: isHindi ? 'कानूनी लाइब्रेरी' : 'Legal Library', shortLabel: isHindi ? 'लाइब्रेरी' : 'Library', icon: BookOpen },
      { id: 'vault', label: isHindi ? 'सुरक्षित वॉल्ट' : 'Legal Vault', shortLabel: isHindi ? 'वॉल्ट' : 'Vault', icon: Lock },
    ]
  },
  {
    title: isHindi ? 'उपयोगिताएं और उपकरण' : 'UTILITIES & TOOLS',
    items: [
      { id: 'calculator', label: isHindi ? 'शुल्क कैलकुलेटर' : 'Fee Calculator', shortLabel: isHindi ? 'कैलकुलेटर' : 'Calculator', icon: Calculator },
      { id: 'cyber', label: isHindi ? 'साइबर स्कैनर' : 'Cyber Scanner', shortLabel: isHindi ? 'साइबर' : 'Cyber Scan', icon: Globe },
    ]
  },
  {
    title: isHindi ? 'सिस्टम' : 'SYSTEM',
    items: [
      { id: 'settings', label: isHindi ? 'सेटिंग्स' : 'Settings', shortLabel: isHindi ? 'सेटिंग्स' : 'Settings', icon: SettingsIcon },
    ]
  }
];
