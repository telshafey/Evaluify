import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getInterviewDetails } from '../services/mockApi';
import { Interview } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { SparklesIcon, PaperAirplaneIcon, LogOutIcon } from '../components/icons';

// Declare the JitsiMeetExternalAPI to TypeScript, as it's loaded from a script tag.
declare var JitsiMeetExternalAPI: any;

const aiTips = [
    "Ask about their experience with state management in React.",
    "Probe their understanding of asynchronous JavaScript.",
    "Present a hypothetical debugging scenario.",
    "Inquire about their approach to CSS architecture.",
    "Ask them to explain a complex project they've worked on."
];

const LiveInterviewPage: React.FC = () => {
    const { interviewId } = useParams<{ interviewId: string }>();
    const navigate = useNavigate();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentAiTip, setCurrentAiTip] = useState(aiTips[0]);

    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const jitsiApiRef = useRef<any>(null);

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
        
        const tipInterval = setInterval(() => {
            setCurrentAiTip(aiTips[Math.floor(Math.random() * aiTips.length)]);
        }, 15000); // Change tip every 15 seconds

        return () => {
            clearInterval(tipInterval);
            // The Jitsi cleanup is handled in the next useEffect
        };
    }, [interviewId, navigate]);

    useEffect(() => {
        // This effect handles the Jitsi API setup and cleanup
        if (!interview || !jitsiContainerRef.current) {
            return;
        }

        // Check if the Jitsi API script is loaded
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
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'desktop', 'fullscreen',
                    'hangup', 'chat', 'raisehand', 'tileview', 'settings'
                ],
                SHOW_CHROME_EXTENSION_BANNER: false,
            },
            userInfo: {
                displayName: interview.interviewerName,
            }
        };

        try {
            const api = new JitsiMeetExternalAPI(domain, options);
            jitsiApiRef.current = api;
            setLoading(false); // Jitsi is now loading, so we can hide our spinner
        } catch (jitsiError) {
             console.error("Jitsi initialization failed:", jitsiError);
             setError("Failed to start the video conference.");
             setLoading(false);
        }

        return () => {
            // Cleanup: dispose of the Jitsi meeting when the component unmounts
            jitsiApiRef.current?.dispose();
        };
    }, [interview, interviewId]);
    
    const handleLeave = () => {
        jitsiApiRef.current?.executeCommand('hangup');
        navigate('/interviews');
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
                {/* Main Jitsi Container */}
                <div className="lg:col-span-3 bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
                    {loading && <LoadingSpinner />}
                    <div ref={jitsiContainerRef} className="h-full w-full" />
                </div>

                {/* Side Panel */}
                <div className="flex flex-col gap-4">
                    {/* AI Assistant */}
                    <div className="bg-slate-800 p-4 rounded-xl flex-1 flex flex-col">
                        <h3 className="font-bold text-lg flex items-center mb-2"><SparklesIcon className="w-5 h-5 me-2 text-purple-400"/> AI Assistant</h3>
                        <div className="bg-purple-500/20 text-purple-300 p-3 rounded-lg text-sm italic flex-1 flex items-center justify-center">
                           <p>"{currentAiTip}"</p>
                        </div>
                    </div>
                     {/* Leave Button */}
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