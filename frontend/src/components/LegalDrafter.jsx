import React, { useState, useRef } from 'react';
import axios from 'axios';
import { CheckCircle2 } from 'lucide-react';

import { EVIDENCE_PRESETS } from './LegalDrafter/DrafterConstants';
import { getPresetData, exportDraftToDoc, exportDraftToPdf, saveDraftToVault } from './LegalDrafter/DrafterUtils';
import { DrafterHeader, DrafterProgress } from './LegalDrafter/DrafterProgress';
import DrafterStep1 from './LegalDrafter/DrafterStep1';
import DrafterStep2 from './LegalDrafter/DrafterStep2';
import DrafterStep3 from './LegalDrafter/DrafterStep3';
import DrafterStep4 from './LegalDrafter/DrafterStep4';
import DrafterStep5 from './LegalDrafter/DrafterStep5';
import DraftContextPanel from './LegalDrafter/DraftContextPanel';
import './LegalDrafter/LegalDrafter.css';

export default function LegalDrafter({ language = 'English', onLanguageChange = () => { } }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  // Step management: 1 (Type & Category), 2 (Parties), 3 (Facts & Evidence), 4 (Review & Generate), 5 (Result)
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState('FIR Application');
  const [incidentCategory, setIncidentCategory] = useState('Cyber Fraud');

  // Complainant & Accused
  const [complainant, setComplainant] = useState({
    name: '',
    father_name: '',
    phone: '',
    address: '',
    police_station: ''
  });

  const [isAccusedUnknown, setIsAccusedUnknown] = useState(false);
  const [accused, setAccused] = useState({
    name: '',
    address: ''
  });

  // Incident Details
  const [incidentDatetime, setIncidentDatetime] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [facts, setFacts] = useState('');
  const [selectedEvidences, setSelectedEvidences] = useState([]);
  const [customEvidence, setCustomEvidence] = useState('');
  const [reliefSought, setReliefSought] = useState('');

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Generated draft state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [draftError, setDraftError] = useState(null);

  const loadPreset = (presetKey) => {
    const data = getPresetData(presetKey, isHindi);
    if (!data) return;
    setDocumentType(data.documentType);
    setIncidentCategory(data.incidentCategory);
    setComplainant(data.complainant);
    setIsAccusedUnknown(data.isAccusedUnknown);
    setAccused(data.accused);
    setIncidentDatetime(data.incidentDatetime);
    setIncidentLocation(data.incidentLocation);
    setFacts(data.facts);
    setSelectedEvidences(data.selectedEvidences);
    setCustomEvidence(data.customEvidence);
    setReliefSought(data.reliefSought);
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setDraftError(null);

    const evidenceList = selectedEvidences.map(id => {
      const item = EVIDENCE_PRESETS.find(p => p.id === id);
      return item ? (isHindi ? item.hi : item.en) : id;
    });
    if (customEvidence.trim()) {
      evidenceList.push(customEvidence.trim());
    }

    try {
      const response = await axios.post('http://localhost:8000/api/draft', {
        document_type: documentType,
        language: language,
        complainant: complainant,
        accused: {
          name: isAccusedUnknown ? (isHindi ? 'अज्ञात व्यक्ति' : 'Unknown Person(s)') : accused.name,
          address: isAccusedUnknown ? (isHindi ? 'अज्ञात (जांच का विषय)' : 'Unknown / Matter of Investigation') : accused.address
        },
        incident_category: incidentCategory,
        incident_datetime: incidentDatetime,
        incident_location: incidentLocation,
        facts: facts,
        evidence: evidenceList.join(', '),
        relief_sought: reliefSought
      });

      setGeneratedResult(response.data);
      setStep(5);
    } catch (err) {
      console.error('Drafting request error:', err);
      setDraftError(isHindi
        ? '[500 Internal Server Error] ड्राफ्ट जनरेट करने में त्रुटि हुई। कृपया जांचें कि बैकएंड सर्वर चल रहा है।'
        : '[500 Internal Server Error] Failed to generate draft. Please ensure the backend server is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult?.draft) return;
    navigator.clipboard.writeText(generatedResult.draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportDoc = () => exportDraftToDoc(documentType, generatedResult?.draft);
  const handleExportPdf = () => exportDraftToPdf(documentType, generatedResult?.draft, isHindi);
  const handleSaveToVault = () => saveDraftToVault(documentType, complainant.name, generatedResult?.draft, isHindi);

  const handleToggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isHindi ? 'आपका ब्राउज़र वॉयस इनपुट का समर्थन नहीं करता।' : 'Your browser does not support Voice Input. Please use Chrome/Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = isHindi ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setFacts(prev => prev + (prev ? ' ' : '') + finalTranscript);
      }
    };

    recognition.start();
  };

  return (
    <div className="legal-drafter animate-fade-in">
      <DrafterHeader
        language={language}
        onLanguageChange={onLanguageChange}
        isHindi={isHindi}
        onNewDraft={() => { setStep(1); setGeneratedResult(null); setDraftError(null); }}
      />

      {step < 5 && (
        <DrafterProgress
          step={step}
          setStep={setStep}
          isHindi={isHindi}
          onLoadPreset={loadPreset}
        />
      )}

      {step < 5 && <div className="drafter-workspace">
      <div className="drafter-config-column">
      {step === 1 && (
        <DrafterStep1
          documentType={documentType}
          setDocumentType={setDocumentType}
          incidentCategory={incidentCategory}
          setIncidentCategory={setIncidentCategory}
          setStep={setStep}
          isHindi={isHindi}
        />
      )}

      {step === 2 && (
        <DrafterStep2
          complainant={complainant}
          setComplainant={setComplainant}
          isAccusedUnknown={isAccusedUnknown}
          setIsAccusedUnknown={setIsAccusedUnknown}
          accused={accused}
          setAccused={setAccused}
          setStep={setStep}
          isHindi={isHindi}
        />
      )}

      {step === 3 && (
        <DrafterStep3
          incidentDatetime={incidentDatetime}
          setIncidentDatetime={setIncidentDatetime}
          incidentLocation={incidentLocation}
          setIncidentLocation={setIncidentLocation}
          facts={facts}
          setFacts={setFacts}
          selectedEvidences={selectedEvidences}
          setSelectedEvidences={setSelectedEvidences}
          customEvidence={customEvidence}
          setCustomEvidence={setCustomEvidence}
          reliefSought={reliefSought}
          setReliefSought={setReliefSought}
          isListening={isListening}
          handleToggleVoiceInput={handleToggleVoiceInput}
          setStep={setStep}
          isHindi={isHindi}
        />
      )}

      {step === 4 && (
        <DrafterStep4
          documentType={documentType}
          incidentCategory={incidentCategory}
          complainant={complainant}
          accused={accused}
          isAccusedUnknown={isAccusedUnknown}
          incidentDatetime={incidentDatetime}
          incidentLocation={incidentLocation}
          facts={facts}
          draftError={draftError}
          isGenerating={isGenerating}
          handleGenerateDraft={handleGenerateDraft}
          setStep={setStep}
          isHindi={isHindi}
        />
      )}
      </div>
      <DraftContextPanel
        step={step}
        documentType={documentType}
        incidentCategory={incidentCategory}
        complainant={complainant}
        incidentDatetime={incidentDatetime}
        incidentLocation={incidentLocation}
        facts={facts}
        selectedEvidences={selectedEvidences}
        reliefSought={reliefSought}
        isHindi={isHindi}
      />
      </div>}

      {step === 5 && generatedResult && (
        <DrafterStep5
          generatedResult={generatedResult}
          documentType={documentType}
          copied={copied}
          handleCopy={handleCopy}
          handlePrint={handlePrint}
          handleExportDoc={handleExportDoc}
          handleExportPdf={handleExportPdf}
          handleSaveToVault={handleSaveToVault}
          setStep={setStep}
          setGeneratedResult={setGeneratedResult}
          isHindi={isHindi}
        />
      )}

      {copied && (
        <div className="toast-container">
          <div className="toast-message">
            <CheckCircle2 size={18} color="#4ade80" />
            {isHindi ? 'ड्राफ्ट क्लिपबोर्ड पर कॉपी किया गया!' : 'Draft copied to clipboard!'}
          </div>
        </div>
      )}
    </div>
  );
}
