
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getInterviewDetails, getInitialInterviewQuestion } from '../services/mockApi.ts';
import { Interview, ProctoringEvent } from '../types.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { SparklesIcon, LogOutIcon, ShieldCheckIcon, ClockIcon, FaceSmileIcon, FaceFrownIcon, ChatBubbleLeftRightIcon, SpinnerIcon } from '../components/icons.tsx';
import ai from '../services/geminiService.ts';
import { useNotification } from '../contexts/NotificationContext.tsx';

// Declare the JitsiMeetExternalAPI to TypeScript, as it's loaded from a script tag.
declare var JitsiMeetExternalAPI: any;

const eventDetails: Record<ProctoringEvent['type'], { title: string; icon: string; }> = {
    tab_switch: { title: 'Tab Switch Detected', icon: '🖥️' },
    paste_content: { title: 'Paste Detected', icon: '📋' },
    face_detection: { title: 'Face Anomaly', icon: '👥' },
    noise_detection: { title: 'Noise Detected', icon: '🔊' }
};

const severityColors: Record<ProctoringEvent['severity'] & string, string> = {
    low: 'border-yellow-500',
    medium: 'border-orange-500',
    high: 'border-red-500',
};

type Sentiment = 'Positive' | 'Neutral' | 'Negative';

const LiveInterviewPage: React.FC = () => {
    const { interviewId } = useParams<{ interviewId: string }>();
    const navigate = useNavigate();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [sentiment, setSentiment] = useState<Sentiment>('Neutral');
    const [currentAiTip, setCurrentAiTip] = useState('');
    const [interviewEvents, setInterviewEvents] = useState<ProctoringEvent[]>([]);
    
    const interviewStartTime = useRef<number>(Date.now());
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const jitsiApiRef = useRef<any>(null);
    const { addNotification } = useNotification();

    useEffect(() => {
        const fetchInterview = async () => {
            if (!interviewId) {
                navigate('/interviews');
                return;
            }
            try {
                const data = await getInterviewDetails(interviewId);
                if (data) {
                    setInterview(data);
                    const initialQuestion = await getInitialInterviewQuestion(data.role);
                    setCurrentAiTip(initialQuestion);
                } else {
                    setError("Interview not found.");
                    setLoading(false);
                }
            } catch (err) {
                setError("Failed to load interview details.");
                setLoading(false);
            }
        };

        fetchInterview();
        
        const sentimentInterval = setInterval(() => {
            const sentiments: Sentiment[] = ['Positive', 'Neutral', 'Negative'];
            setSentiment(sentiments[Math.floor(Math.random() * sentiments.length)]);
        }, 15000); // Change sentiment every 15 seconds

        return () => {
            clearInterval(sentimentInterval);
        };
    }, [interviewId, navigate]);
    
    useEffect(() => {
        const getTimestamp = () => Date.now() - interviewStartTime.current;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                const newEvent: ProctoringEvent = { type: 'tab_switch', timestamp: getTimestamp(), severity: 'medium' };
                setInterviewEvents(prev => [newEvent, ...prev]);
            }
        };
        
        const eventInterval = setInterval(() => {
            const randomEvent = Math.random();
            if (randomEvent < 0.1) { // 10% chance every 20 seconds
                 const newEvent: ProctoringEvent = {
                    type: 'face_detection',
                    timestamp: getTimestamp(),
                    severity: 'high',
                    details: 'Multiple faces detected'
                };
                setInterviewEvents(prev => [newEvent, ...prev]);
            }
        }, 20000);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(eventInterval);
        };
    }, []);

    useEffect(() => {
        // This effect handles the Jitsi API setup and cleanup
        if (!interview || !jitsiContainerRef.current) {
            return;
        }

        if (typeof JitsiMeetExternalAPI === 'undefined') {
            setError("Jitsi API could not be loaded. Please check your connection and refresh.");
            setLoading(false);
            return;
        }

        const domain = 'meet.jit.si';
        const options = {
            roomName: `evaluify-interview-${interviewId}-${interview.candidateName.replace(/\s/g, '-')}`,
            width: '100%',
            height: '100%',
            parentNode: jitsiContainerRef.current,
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: false,
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [ 'microphone', 'camera', 'desktop', 'fullscreen', 'hangup', 'chat', 'raisehand', 'tileview', 'settings' ],
                SHOW_CHROME_EXTENSION_BANNER: false,
            },
            userInfo: { displayName: interview.interviewerName }
        };

        try {
            const api = new JitsiMeetExternalAPI(domain, options);
            jitsiApiRef.current = api;
            setLoading(false); 
        } catch (jitsiError) {
             console.error("Jitsi initialization failed:", jitsiError);
             setError("Failed to start the video conference.");
             setLoading(false);
        }

        return () => {
            jitsiApiRef.current?.dispose();
        };
    }, [interview, interviewId]);
    
    const handleLeave = () => {
        jitsiApiRef.current?.executeCommand('hangup');
        navigate('/interviews');
    };
    
    const formatTimestamp = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleGenerateFollowUp = async () => {
        if (!interview || isAiLoading) return;
        setIsAiLoading(true);
        try {
            const prompt = `You are an expert interviewer. The candidate is applying for the role of "${interview.role}". The last question asked was "${currentAiTip}". Provide one concise, relevant follow-up question.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setCurrentAiTip(response.text);
        } catch (err) {
            console.error("Gemini error:", err);
            addNotification("Could not generate a follow-up question.", "error");
        } finally {
            setIsAiLoading(false);
        }
    };


    const SentimentDisplay = () => {
        const sentimentConfig: Record<Sentiment, { icon: React.FC<any>, text: string, color: string }> = {
            Positive: { icon: FaceSmileIcon, text: 'Positive', color: 'text-green-400' },
            Neutral: { icon: ChatBubbleLeftRightIcon, text: 'Neutral', color: 'text-yellow-400' },
            Negative: { icon: FaceFrownIcon, text: 'Negative', color: 'text-red-400' },
        };
        const config = sentimentConfig[sentiment];
        const Icon = config.icon;
        return (
             <div className="bg-slate-800 p-4 rounded-xl">
                <h3 className="font-bold text-lg flex items-center mb-2">Sentiment Analysis</h3>
                <div className={`flex items-center justify-center p-3 rounded-lg bg-slate-700/50 ${config.color}`}>
                    <Icon className="w-8 h-8 mr-3"/>
                    <span className="text-xl font-semibold">{config.text}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col p-4">
            <header className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">{interview?.role} Interview</h1>
                    <p className="text-slate-400">Candidate: {interview?.candidateName} | Interviewer: {interview?.interviewerName}</p>
                </div>
                 {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm">{error}</div>}
            </header>
            
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
                    {loading && <LoadingSpinner />}
                    <div ref={jitsiContainerRef} className="h-full w-full" />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl flex-1 flex flex-col">
                        <h3 className="font-bold text-lg flex items-center mb-2"><SparklesIcon className="w-5 h-5 me-2 text-purple-400"/> AI Assistant</h3>
                        <div className="bg-purple-500/20 text-purple-300 p-3 rounded-lg text-sm italic flex-1 flex items-center justify-center min-h-[100px]">
                           {isAiLoading ? <SpinnerIcon /> : <p>"{currentAiTip}"</p>}
                        </div>
                        <button onClick={handleGenerateFollowUp} disabled={isAiLoading} className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50 flex items-center justify-center">
                            {isAiLoading ? <SpinnerIcon className="w-5 h-5"/> : <><ChatBubbleLeftRightIcon className="w-5 h-5 mr-2"/> Suggest Follow-up</>}
                        </button>
                    </div>
                    <SentimentDisplay />
                     <div className="bg-slate-800 p-4 rounded-xl flex-1 flex flex-col">
                        <h3 className="font-bold text-lg flex items-center mb-2"><ShieldCheckIcon className="w-5 h-5 me-2 text-yellow-400"/> Proctoring Log</h3>
                        <div className="space-y-2 overflow-y-auto h-40 pr-2">
                             {interviewEvents.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center pt-8">No events detected yet.</p>
                            ) : (
                                interviewEvents.map((event, index) => {
                                    const details = eventDetails[event.type];
                                    const color = severityColors[event.severity || 'low'];
                                    return (
                                        <div key={index} className={`p-2 rounded-md border-l-4 ${color} bg-slate-700/50 text-xs`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold">{details.icon} {details.title}</span>
                                                <span className="font-mono flex items-center"><ClockIcon className="w-3 h-3 me-1"/>{formatTimestamp(event.timestamp)}</span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                    <button onClick={handleLeave} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2">
                        <LogOutIcon className="w-5 h-5" />
                        End & Leave Interview
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LiveInterviewPage;
