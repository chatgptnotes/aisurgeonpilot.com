import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Printer, Loader2, FileText, Mic, Download, RefreshCw } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useToast } from '@/hooks/use-toast';

interface PatientData {
  id: string;
  visit_id?: string;
  patient_id?: string;
  patients?: {
    id: string;
    name: string;
    gender?: string;
    age?: number;
    date_of_birth?: string;
    patients_id?: string;
    address?: string;
    phone?: string;
    corporate?: string;
  };
  visit_type?: string;
  appointment_with?: string;
  diagnosis?: string;
  reason_for_visit?: string;
  created_at?: string;
}

interface OpdAdmissionNotesData {
  diagnosis: string;
  relevance_complaints: string;
  vital_bp: string;
  rx: string;
  advice: string;
  pathology_rbs: string;
  pathology_xray: string;
  pathology_ct_mri_usg: string;
  stitches_removal: string;
  dressing: string;
  speciality_injectable: string;
  doctor_signature: string;
  review: string;
}

const OpdAdmissionNotes = () => {
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Voice agent conversation state
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationStatus, setConversationStatus] = useState<'idle' | 'listening' | 'active' | 'completed'>('idle');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isProcessingSummary, setIsProcessingSummary] = useState(false);

  // Form state
  const [formData, setFormData] = useState<OpdAdmissionNotesData>({
    diagnosis: '',
    relevance_complaints: '',
    vital_bp: '',
    rx: '',
    advice: '',
    pathology_rbs: '',
    pathology_xray: '',
    pathology_ct_mri_usg: '',
    stitches_removal: '',
    dressing: '',
    speciality_injectable: '',
    doctor_signature: '',
    review: 'N/A',
  });

  // Debounce form data for auto-save
  const [debouncedFormData] = useDebounce(formData, 1500);

  // Load ElevenLabs ConvAI script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';

    script.onload = () => {
      setScriptLoaded(true);
      console.log('ElevenLabs ConvAI script loaded successfully');

      // Wait for the widget to initialize and then add event listeners
      setTimeout(() => {
        // Check if ElevenLabs ConvAI widget is available
        const convaiWidget = document.querySelector('elevenlabs-convai');

        if (convaiWidget) {
          console.log('ConvAI widget found, setting up event listeners');

          // Listen for conversation events on the widget itself
          convaiWidget.addEventListener('conversationStarted', (event: any) => {
            console.log('Conversation started:', event.detail);
            setConversationId(event.detail?.conversationId || Date.now().toString());
            setConversationStatus('listening');
            toast({
              title: "ANOHRA Activated",
              description: "Voice assistant is now listening to the conversation.",
            });
          });

          convaiWidget.addEventListener('conversationEnded', (event: any) => {
            console.log('Conversation ended:', event.detail);
            setConversationStatus('completed');
            toast({
              title: "Conversation Complete",
              description: "Use 'Capture Summary' to extract ANOHRA's notes.",
            });
          });

          convaiWidget.addEventListener('agentSpeaking', () => {
            setConversationStatus('active');
          });

          convaiWidget.addEventListener('userSpeaking', () => {
            setConversationStatus('listening');
          });

          // Alternative: Check for global ElevenLabs events
          if (window.ElevenLabs) {
            console.log('ElevenLabs SDK available');
          }
        } else {
          console.log('ConvAI widget not found, will retry...');
          // Retry after another delay
          setTimeout(() => {
            const retryWidget = document.querySelector('elevenlabs-convai');
            if (retryWidget) {
              console.log('ConvAI widget found on retry');
              // Add the same event listeners here
            }
          }, 2000);
        }
      }, 1000);
    };

    script.onerror = () => {
      console.error('Failed to load ElevenLabs ConvAI script');
      toast({
        title: "Voice Assistant Error",
        description: "Failed to load voice assistant. Please refresh the page.",
        variant: "destructive",
      });
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [toast]);

  // Fetch patient and visit data
  useEffect(() => {
    const fetchData = async () => {
      if (!visitId) {
        toast({
          title: "Error",
          description: "Visit ID is missing",
          variant: "destructive",
        });
        navigate(-1);
        return;
      }

      try {
        // Fetch visit data with patient details
        const { data: visitData, error: visitError } = await supabase
          .from('visits')
          .select(`
            *,
            patients!inner (
              id,
              name,
              gender,
              age,
              date_of_birth,
              patients_id,
              address,
              phone,
              corporate
            )
          `)
          .eq('visit_id', visitId)
          .single();

        if (visitError) {
          console.error('Error fetching visit data:', visitError);
          throw visitError;
        }

        setPatientData(visitData);

        // Load existing OPD admission notes if available
        if (visitData.opd_admission_notes) {
          setFormData(visitData.opd_admission_notes as OpdAdmissionNotesData);
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        toast({
          title: "Error",
          description: "Failed to load patient data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visitId, navigate, toast]);

  // Auto-save when debounced data changes
  useEffect(() => {
    const saveData = async () => {
      if (!visitId || !patientData || loading) return;

      // Check if there's actual data to save (not all empty)
      const hasData = Object.values(debouncedFormData).some(val => val.trim() !== '');
      if (!hasData) return;

      setSaving(true);

      try {
        const { error } = await supabase
          .from('visits')
          .update({
            opd_admission_notes: debouncedFormData,
            updated_at: new Date().toISOString()
          })
          .eq('visit_id', visitId);

        if (error) {
          console.error('Error saving OPD admission notes:', error);
          toast({
            title: "Save Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setLastSaved(new Date());
        }
      } catch (error) {
        console.error('Exception while saving:', error);
      } finally {
        setSaving(false);
      }
    };

    saveData();
  }, [debouncedFormData, visitId, patientData, loading, toast]);

  const handleInputChange = (field: keyof OpdAdmissionNotesData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleManualSave = async () => {
    if (!visitId) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('visits')
        .update({
          opd_admission_notes: formData,
          updated_at: new Date().toISOString()
        })
        .eq('visit_id', visitId);

      if (error) {
        toast({
          title: "Save Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setLastSaved(new Date());
        toast({
          title: "Saved",
          description: "OPD admission notes saved successfully",
        });
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: "Error",
        description: "Failed to save OPD admission notes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Function to fetch conversation data from ElevenLabs
  const fetchConversationData = async (conversationId: string) => {
    try {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

      if (!apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      console.log('Fetching conversation data for ID:', conversationId);
      console.log('Using API Key:', apiKey ? 'API Key is set' : 'API Key is missing');

      // Try multiple possible API endpoints
      const endpoints = [
        `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
        `https://api.elevenlabs.io/v1/conversations/${conversationId}`,
        `https://api.elevenlabs.io/v1/convai/conversation/${conversationId}`,
      ];

      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log('Trying endpoint:', endpoint);

          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'xi-api-key': apiKey,
              'Content-Type': 'application/json',
            },
          });

          console.log('Response status:', response.status);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));

          if (response.ok) {
            const conversationData = await response.json();
            console.log('Conversation data received:', conversationData);
            return conversationData;
          } else {
            const errorText = await response.text();
            console.error(`API Error for ${endpoint}:`, response.status, errorText);
            lastError = `${endpoint}: ${response.status} - ${errorText}`;
          }
        } catch (endpointError) {
          console.error(`Network error for ${endpoint}:`, endpointError);
          lastError = `${endpoint}: ${endpointError.message}`;
        }
      }

      throw new Error(`All API endpoints failed. Last error: ${lastError}`);
    } catch (error) {
      console.error('Error fetching conversation data:', error);
      throw error;
    }
  };

  // Function to parse AI summary and populate form fields
  const parseAndPopulateSummary = (summary: string) => {
    try {
      // Parse the AI-generated summary and extract relevant sections
      const sections = {
        diagnosis: '',
        complaints: '',
        vitals: '',
        advice: '',
        rx: '',
        procedures: '',
        pathology_rbs: '',
        pathology_xray: '',
        pathology_ct_mri_usg: '',
        dressing: '',
        stitch_removal: '',
        doctor_signature: '',
      };

      // Simple parsing logic - you can enhance this based on ANOHRA's output format
      const lines = summary.split('\n').map(line => line.trim()).filter(Boolean);

      let currentSection = '';
      let currentContent = '';

      for (const line of lines) {
        if (line.toLowerCase().includes('diagnosis') || line.toLowerCase().includes('condition')) {
          if (currentSection && currentContent) {
            sections[currentSection] = currentContent.trim();
          }
          currentSection = 'diagnosis';
          currentContent = line.replace(/^[^:]*:?\s*/, '');
        } else if (line.toLowerCase().includes('complaint') || line.toLowerCase().includes('symptom')) {
          if (currentSection && currentContent) {
            sections[currentSection] = currentContent.trim();
          }
          currentSection = 'complaints';
          currentContent = line.replace(/^[^:]*:?\s*/, '');
        } else if (line.toLowerCase().includes('vital') || line.toLowerCase().includes('bp') || line.toLowerCase().includes('blood pressure')) {
          if (currentSection && currentContent) {
            sections[currentSection] = currentContent.trim();
          }
          currentSection = 'vitals';
          currentContent = line.replace(/^[^:]*:?\s*/, '');
        } else if (line.toLowerCase().includes('advice') || line.toLowerCase().includes('recommendation')) {
          if (currentSection && currentContent) {
            sections[currentSection] = currentContent.trim();
          }
          currentSection = 'advice';
          currentContent = line.replace(/^[^:]*:?\s*/, '');
        } else if (line.toLowerCase().includes('prescription') || line.toLowerCase().includes('medication') || line.toLowerCase().includes('rx')) {
          if (currentSection && currentContent) {
            sections[currentSection] = currentContent.trim();
          }
          currentSection = 'rx';
          currentContent = line.replace(/^[^:]*:?\s*/, '');
        } else if (line.toLowerCase().includes('procedure')) {
          if (currentSection && currentContent) {
            sections[currentSection] = currentContent.trim();
          }
          currentSection = 'procedures';
          currentContent = line.replace(/^[^:]*:?\s*/, '');
        } else if (currentSection) {
          currentContent += ' ' + line;
        }
      }

      // Handle the last section
      if (currentSection && currentContent) {
        sections[currentSection] = currentContent.trim();
      }

      // Update form data with parsed sections
      setFormData(prev => ({
        ...prev,
        diagnosis: sections.diagnosis || prev.diagnosis,
        relevance_complaints: sections.complaints || prev.relevance_complaints,
        vital_bp: sections.vitals || prev.vital_bp,
        advice: sections.advice || prev.advice,
        rx: sections.rx || prev.rx,
        speciality_injectable: sections.procedures || prev.speciality_injectable,
      }));

      toast({
        title: "Summary Applied",
        description: "ANOHRA's summary has been populated into the form fields.",
      });

    } catch (error) {
      console.error('Error parsing summary:', error);
      toast({
        title: "Parsing Error",
        description: "Failed to parse ANOHRA's summary. Please review manually.",
        variant: "destructive",
      });
    }
  };

  // Function to handle conversation completion
  const handleConversationComplete = async () => {
    if (!conversationId) {
      toast({
        title: "No Conversation",
        description: "No conversation ID available to fetch summary.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingSummary(true);

    try {
      // Wait a moment for the conversation to be processed on ElevenLabs servers
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('Fetching conversation data for ID:', conversationId);
      const conversationData = await fetchConversationData(conversationId);

      console.log('Full conversation data:', conversationData);

      // Look for the AI summary in different possible locations
      let summaryContent = '';

      if (conversationData) {
        // Check for messages array
        if (conversationData.messages && Array.isArray(conversationData.messages)) {
          // Find the last assistant message that contains a summary
          const assistantMessages = conversationData.messages.filter(
            (msg: any) => msg.role === 'assistant' && msg.content
          );

          if (assistantMessages.length > 0) {
            const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
            summaryContent = lastAssistantMessage.content;
            console.log('Found assistant message:', summaryContent);
          }
        }

        // Alternative: Check for transcript or summary fields
        if (!summaryContent && conversationData.transcript) {
          summaryContent = conversationData.transcript;
          console.log('Found transcript:', summaryContent);
        }

        if (!summaryContent && conversationData.summary) {
          summaryContent = conversationData.summary;
          console.log('Found summary field:', summaryContent);
        }

        // Extract summary from conversation text if needed
        if (!summaryContent && conversationData.conversation_text) {
          // Look for structured summary in the conversation text
          const conversationText = conversationData.conversation_text;
          const summaryMatch = conversationText.match(/(?:summary|opd summary|consultation summary)[:\s]*([\s\S]*)/i);
          if (summaryMatch) {
            summaryContent = summaryMatch[1].trim();
            console.log('Extracted summary from conversation text:', summaryContent);
          } else {
            summaryContent = conversationText;
          }
        }
      }

      if (summaryContent) {
        setAiSummary(summaryContent);
        parseAndPopulateSummary(summaryContent);

        toast({
          title: "Summary Captured",
          description: "ANOHRA's summary has been extracted and populated into the form.",
        });
      } else {
        console.warn('No summary content found in conversation data');
        toast({
          title: "No Summary Found",
          description: "Could not extract summary from conversation. The conversation may still be processing.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error processing conversation:', error);
      toast({
        title: "Processing Error",
        description: `Failed to retrieve ANOHRA's summary: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessingSummary(false);
    }
  };

  // Function to manually trigger summary capture
  const captureCurrentSummary = () => {
    if (conversationId) {
      handleConversationComplete();
    } else {
      // If no conversation ID, try to simulate or provide manual input
      toast({
        title: "No Active Conversation",
        description: "Start a conversation with ANOHRA first, or use the manual summary input.",
        variant: "destructive",
      });
    }
  };

  // Test function to simulate a conversation (for development/testing)
  const simulateConversation = () => {
    const mockSummary = `
CONSULTATION SUMMARY

DIAGNOSIS: Hypertension with Type 2 Diabetes Mellitus
Patient presents with elevated blood pressure readings and blood glucose levels.

COMPLAINTS:
Patient reports frequent headaches, fatigue, and excessive thirst for the past 2 weeks.
Also experiencing blurred vision occasionally.

VITALS:
BP: 150/95 mmHg
Pulse: 88/min
Temperature: 98.6°F
Weight: 75 kg

PRESCRIPTION:
1. Amlodipine 5mg - Once daily after breakfast
2. Metformin 500mg - Twice daily before meals
3. Aspirin 75mg - Once daily after dinner

ADVICE:
- Regular blood pressure monitoring
- Diabetic diet with reduced carbohydrates
- Daily 30-minute walk
- Follow-up after 2 weeks

PROCEDURES:
Blood glucose testing performed
Blood pressure monitoring
    `;

    setAiSummary(mockSummary);
    setConversationId('simulated-' + Date.now());
    setConversationStatus('completed');
    parseAndPopulateSummary(mockSummary);

    toast({
      title: "Test Summary Applied",
      description: "Simulated ANOHRA summary has been populated for testing.",
    });
  };

  // Function to manually input conversation ID
  const handleManualConversationId = () => {
    const conversationIdInput = prompt('Enter the conversation ID to fetch summary from:');
    if (conversationIdInput && conversationIdInput.trim()) {
      setConversationId(conversationIdInput.trim());
      setConversationStatus('completed');
      handleConversationComplete();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Patient data not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {saving && (
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </div>
          )}
          {conversationStatus !== 'idle' && (
            <Button
              onClick={captureCurrentSummary}
              disabled={isProcessingSummary || !conversationId}
              variant="outline"
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
            >
              {isProcessingSummary ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Capture ANOHRA Summary
                </>
              )}
            </Button>
          )}
          <Button
            onClick={handleManualSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Now
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 print:bg-white">
          {/* Voice Agent Widget - Hidden in print */}
          <div className="print:hidden mb-4 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${scriptLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-75 ${scriptLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                </div>
                <Mic className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">ANOHRA Voice Assistant</h3>
                  <p className="text-xs text-gray-600">
                    {scriptLoaded ? 'Ready to assist with consultation documentation' : 'Loading voice assistant...'}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Say "ANOHRA" to activate
              </div>
            </div>

            {/* Conversation Status */}
            <div className="bg-blue-50 p-3 rounded-lg mb-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-blue-800">Conversation Status:</h4>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  conversationStatus === 'idle' ? 'bg-gray-200 text-gray-700' :
                  conversationStatus === 'listening' ? 'bg-yellow-200 text-yellow-800' :
                  conversationStatus === 'active' ? 'bg-green-200 text-green-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {conversationStatus === 'idle' && 'Ready'}
                  {conversationStatus === 'listening' && 'Listening...'}
                  {conversationStatus === 'active' && 'Active'}
                  {conversationStatus === 'completed' && 'Completed'}
                </div>
              </div>

              {conversationStatus === 'idle' && (
                <ol className="text-xs text-blue-700 space-y-1">
                  <li>1. Start your patient consultation normally</li>
                  <li>2. ANOHRA listens silently to the conversation</li>
                  <li>3. When finished, say "ANOHRA" to activate</li>
                  <li>4. Answer ANOHRA's 3 clarifying questions</li>
                  <li>5. Use "Capture Summary" to populate notes</li>
                </ol>
              )}

              {conversationStatus === 'completed' && aiSummary && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-green-700 font-medium">✓ Summary Generated</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={captureCurrentSummary}
                      disabled={isProcessingSummary}
                      className="h-6 px-2 text-xs"
                    >
                      {isProcessingSummary ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3 mr-1" />
                          Capture Summary
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-white p-2 rounded border text-xs text-gray-700 max-h-20 overflow-y-auto">
                    {aiSummary.substring(0, 150)}...
                  </div>
                </div>
              )}

              {/* Debug/Testing Controls */}
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-800 font-medium mb-2">Debug Controls:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={simulateConversation}
                    className="h-6 px-2 text-xs bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700"
                  >
                    Test Summary
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleManualConversationId}
                    className="h-6 px-2 text-xs bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                  >
                    Manual ID Input
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const envVars = {
                        VITE_ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY ? 'Set' : 'Missing',
                        VITE_ELEVENLABS_AGENT_ID: import.meta.env.VITE_ELEVENLABS_AGENT_ID ? 'Set' : 'Missing',
                      };
                      console.log('Environment Variables:', envVars);
                      console.log('Current state:', {
                        conversationId,
                        conversationStatus,
                        scriptLoaded,
                        aiSummary: aiSummary.substring(0, 100)
                      });
                      toast({
                        title: "Debug Info Logged",
                        description: "Check browser console for environment and state details.",
                      });
                    }}
                    className="h-6 px-2 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                  >
                    Debug Info
                  </Button>
                </div>
              </div>
            </div>

            {/* ElevenLabs Voice Widget */}
            <div className="flex justify-center bg-gray-50 p-3 rounded-lg">
              {scriptLoaded ? (
                <elevenlabs-convai agent-id={import.meta.env.VITE_ELEVENLABS_AGENT_ID}></elevenlabs-convai>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-xs">Loading voice assistant...</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl font-bold text-blue-900">
                  NOTES
                </CardTitle>
                {/* Pulsating mic icon next to header */}
                <div className="flex items-center gap-2 print:hidden">
                  <div className="relative">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <Mic className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Visit ID: {patientData.visit_id} | Date: {formatDate(patientData.created_at)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Patient Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg print:border print:border-gray-300">
            <div>
              <Label className="text-xs font-semibold text-gray-600">Name</Label>
              <p className="text-sm font-medium mt-1">{patientData.patients?.name || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-600">Age/Sex</Label>
              <p className="text-sm font-medium mt-1">
                {patientData.patients?.age || 'N/A'} / {patientData.patients?.gender || 'N/A'}
              </p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-600">Reg. No</Label>
              <p className="text-sm font-medium mt-1">{patientData.patients?.patients_id || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-600">Visit ID</Label>
              <p className="text-sm font-medium mt-1">{patientData.visit_id || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-600">Date</Label>
              <p className="text-sm font-medium mt-1">{formatDate(patientData.created_at)}</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-600">Address</Label>
              <p className="text-sm font-medium mt-1">{patientData.patients?.address || 'nagpur'}</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-600">Name of Consultant</Label>
              <p className="text-sm font-medium mt-1">{patientData.appointment_with || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-600">Corporate</Label>
              <p className="text-sm font-medium mt-1">{patientData.patients?.corporate || 'private'}</p>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-gray-800">Diagnosis</Label>
            <Textarea
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              placeholder="Enter detailed diagnosis notes, symptoms, examination findings..."
              className="min-h-[100px] resize-vertical print:border-gray-400"
            />
          </div>

          {/* Complaints */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-gray-800">Complaints</Label>
            <Textarea
              value={formData.relevance_complaints}
              onChange={(e) => handleInputChange('relevance_complaints', e.target.value)}
              placeholder="Enter complaints..."
              className="min-h-[80px] resize-vertical print:border-gray-400"
            />
          </div>

          {/* Two Column Layout for Vital and RX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-two-column">
            {/* Left Column: Vital, Advice, Pathology */}
            <div className="space-y-6">
              {/* Vitals */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800">Vitals</Label>
                <Input
                  value={formData.vital_bp}
                  onChange={(e) => handleInputChange('vital_bp', e.target.value)}
                  placeholder="e.g., BP: 120/80 mmHg, Pulse: 72/min, Temp: 98.6°F"
                  className="print:border-gray-400"
                />
              </div>

              {/* Advice */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800">Advice</Label>
                <Textarea
                  value={formData.advice}
                  onChange={(e) => handleInputChange('advice', e.target.value)}
                  placeholder="Enter medical advice..."
                  className="min-h-[100px] resize-vertical print:border-gray-400"
                />
              </div>

              {/* Pathology */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-800">Pathology</Label>
                <div className="space-y-3 pl-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">1. RBS</Label>
                    <Input
                      value={formData.pathology_rbs}
                      onChange={(e) => handleInputChange('pathology_rbs', e.target.value)}
                      placeholder="Random Blood Sugar value"
                      className="mt-1 print:border-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">2. X-Ray</Label>
                    <Input
                      value={formData.pathology_xray}
                      onChange={(e) => handleInputChange('pathology_xray', e.target.value)}
                      placeholder="X-Ray details"
                      className="mt-1 print:border-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">3. CT/MRI/USG</Label>
                    <Input
                      value={formData.pathology_ct_mri_usg}
                      onChange={(e) => handleInputChange('pathology_ct_mri_usg', e.target.value)}
                      placeholder="CT/MRI/USG details"
                      className="mt-1 print:border-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Stitch Removal */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800">Stitch Removal</Label>
                <Input
                  value={formData.stitches_removal}
                  onChange={(e) => handleInputChange('stitches_removal', e.target.value)}
                  placeholder="Stitch removal details"
                  className="print:border-gray-400"
                />
              </div>

              {/* Dressing */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800">Dressing</Label>
                <Input
                  value={formData.dressing}
                  onChange={(e) => handleInputChange('dressing', e.target.value)}
                  placeholder="Dressing details"
                  className="print:border-gray-400"
                />
              </div>

              {/* Procedures */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-gray-800">Procedures</Label>
                <Input
                  value={formData.speciality_injectable}
                  onChange={(e) => handleInputChange('speciality_injectable', e.target.value)}
                  placeholder="Procedures performed"
                  className="print:border-gray-400"
                />
              </div>
            </div>

            {/* Right Column: RX */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-gray-800">RX</Label>
              <Textarea
                value={formData.rx}
                onChange={(e) => handleInputChange('rx', e.target.value)}
                placeholder="Enter prescription details..."
                className="min-h-[500px] resize-vertical print:border-gray-400"
              />
            </div>
          </div>

          {/* Footer Information */}
          <div className="border-t-2 border-gray-300 pt-2 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-1">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Signature:</Label>
                  <div className="border-b-2 border-gray-400 h-6 mt-1 print:h-4"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Name of Doctor:</Label>
                  <Input
                    value={formData.doctor_signature}
                    onChange={(e) => handleInputChange('doctor_signature', e.target.value)}
                    placeholder="Enter doctor name..."
                    className="print:border-none print:bg-transparent"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Review:</p>
                  <Input
                    value={formData.review}
                    onChange={(e) => handleInputChange('review', e.target.value)}
                    className="print:border-none print:bg-transparent"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div>
                  <p className="text-xs font-semibold text-gray-600">Date And Time:</p>
                  <p className="text-sm font-medium">
                    {formatDate(new Date().toISOString())} {new Date().toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Date:</p>
                  <p className="text-sm font-medium">{formatDate(new Date().toISOString())}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Time:</p>
                  <p className="text-sm font-medium">
                    {new Date().toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              font-size: 8pt;
            }

            @page {
              size: A4;
              margin: 0.4cm 0.5cm;
            }

            /* Hide screen elements */
            button, .print\\:hidden {
              display: none !important;
            }

            /* Page container */
            .container {
              max-width: 100%;
              padding: 0;
            }

            /* Card styling */
            .shadow-lg {
              box-shadow: none !important;
              border: 2px solid #000 !important;
              border-radius: 0 !important;
            }

            /* Header */
            .bg-gradient-to-r {
              background: white !important;
              border-bottom: 2px solid #000;
              padding: 4px !important;
            }

            /* Hide icon in print */
            .bg-gradient-to-r svg {
              display: none !important;
            }

            /* Patient info box */
            .bg-gray-50 {
              background: white !important;
              border: 2px solid #000 !important;
              padding: 4px !important;
              margin-bottom: 4px;
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 2px 10px !important;
            }

            /* Patient info items */
            .bg-gray-50 > div {
              display: block !important;
            }

            .bg-gray-50 > div label {
              font-size: 6pt !important;
              font-weight: 600 !important;
              color: #333 !important;
              display: block !important;
              margin-bottom: 0px !important;
            }

            .bg-gray-50 > div p {
              font-size: 7pt !important;
              color: #000 !important;
              margin: 0 !important;
            }

            /* Section labels */
            label {
              font-weight: 600 !important;
              color: #000 !important;
              font-size: 7pt !important;
            }

            /* Textareas for print - Compact but readable */
            textarea {
              border: 1px solid #000 !important;
              min-height: 28px !important;
              max-height: 32px !important;
              background: white !important;
              padding: 2px 4px !important;
              font-size: 7pt !important;
              line-height: 1.3 !important;
              overflow: hidden !important;
            }

            /* Input fields */
            input {
              border: 1px solid #000 !important;
              padding: 1px 3px !important;
              background: white !important;
              font-size: 7pt !important;
            }

            /* Footer section - Clear separator */
            .border-t-2 {
              border-top: 2px solid #000 !important;
              margin-top: 4px !important;
              padding-top: 3px !important;
            }

            /* Signature line - Minimal but visible */
            .border-b-2 {
              border-bottom: 1px solid #000 !important;
              height: 6px !important;
            }

            /* Footer h-6 override */
            .h-6 {
              height: 6px !important;
            }

            /* Text sizing for print */
            .text-sm {
              font-size: 7pt !important;
            }

            .text-xs {
              font-size: 5pt !important;
            }

            /* Footer specific labels */
            .border-t-2 .text-xs {
              font-size: 5pt !important;
            }

            /* Footer specific text */
            .border-t-2 .text-sm {
              font-size: 6pt !important;
            }

            /* Card content padding */
            .p-6 {
              padding: 3px !important;
            }

            /* Two Column Layout - Critical for print */
            .print-two-column {
              display: grid !important;
              grid-template-columns: 45% 1px 54% !important;
              gap: 6px !important;
              position: relative;
              margin-top: 3px !important;
              margin-bottom: 3px !important;
            }

            /* Left column styling */
            .print-two-column > div:first-child {
              padding-right: 6px !important;
            }

            /* Add vertical separator between columns - Bold visible line */
            .print-two-column::after {
              content: '' !important;
              position: absolute !important;
              left: calc(45% + 3px) !important;
              top: 0 !important;
              bottom: 0 !important;
              width: 2px !important;
              background: #000 !important;
              border-left: 2px solid #000 !important;
              z-index: 10 !important;
            }

            /* Right column styling */
            .print-two-column > div:last-child {
              padding-left: 6px !important;
            }

            /* Ensure RX textarea matches left column height */
            .print-two-column textarea {
              min-height: 250px !important;
              max-height: 270px !important;
              height: auto !important;
              line-height: 1.4 !important;
            }

            /* Footer section - 3 columns with clear separation */
            .grid-cols-3 {
              display: grid !important;
              grid-template-columns: 1fr 1fr 1fr !important;
              gap: 8px !important;
            }

            /* Footer input in print */
            .print\\:border-none {
              border: none !important;
            }

            .print\\:bg-transparent {
              background: transparent !important;
            }

            /* Remove default margins and spacing - Optimized */
            .space-y-6 > * + * {
              margin-top: 3px !important;
            }

            .space-y-2 > * + * {
              margin-top: 2px !important;
            }

            .space-y-3 > * + * {
              margin-top: 2px !important;
            }

            .space-y-1 > * + * {
              margin-top: 1px !important;
            }

            /* Overall content spacing */
            .space-y-6 {
              gap: 3px !important;
            }

            /* Header title compact */
            .bg-gradient-to-r {
              padding: 3px !important;
            }

            /* Card title text size */
            .text-2xl {
              font-size: 11pt !important;
              font-weight: bold !important;
            }

            /* Header subtitle */
            .text-sm.text-gray-600 {
              font-size: 7pt !important;
            }

            /* Pathology section compact */
            .pl-4 {
              padding-left: 8px !important;
            }

            /* Overall layout improvements */
            .rounded-lg {
              border-radius: 0 !important;
            }

            /* Ensure proper page breaks */
            .print-two-column {
              page-break-inside: avoid !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default OpdAdmissionNotes;
