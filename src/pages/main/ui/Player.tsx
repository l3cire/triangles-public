import { useState, useEffect, useRef, useLayoutEffect, RefObject, useMemo, forwardRef, useCallback } from "react";


export type PlayerState = {
    source: string,
    is_playing: boolean,
    duration: number,
    time: number
};

const useElementWidth = (ref: RefObject<HTMLDivElement>) => {
    const [width, setWidth] = useState(0)
  
    const elObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            if (entry.contentBoxSize) {
                setWidth(entry.contentRect.width)
            }
        }
    })
  
    useLayoutEffect(() => {
        if (!ref?.current) return
        elObserver.observe(ref.current)
        return () => {
            elObserver.disconnect()
        }
    }, [])

    return width
}

const getContext = () => {
    const fragment = document.createDocumentFragment()
    const canvas = document.createElement('canvas')
    fragment.appendChild(canvas)
    return canvas.getContext('2d')
}
  
const useFitCharacterNumber = (options: [RefObject<HTMLDivElement>, number, string, string]) => {
    const [ ref, maxWidth, start, fillChar ] = options
    return useMemo(() => {
        const context = getContext()
        if (context && ref.current?.textContent && maxWidth) {
            const computedStyles = window.getComputedStyle(ref.current)
            context.font = computedStyles.font ? computedStyles.font : `${computedStyles.fontSize}" "${computedStyles.fontFamily}`
            const textWidth = context.measureText(ref.current.textContent).width // width of text
            let fitLength = ref.current.textContent.length
            
            let n = 0
            while(context.measureText(start + fillChar.repeat(n)).width < maxWidth) n++;
            n;
            return n - 1;
        }
        return 0
    }, [ref, maxWidth, start, fillChar])
}

interface playerProps {source: string}

export const Player = forwardRef((props: playerProps, ref) => {

    const [state, updateState] = useState<PlayerState>({source: props.source, is_playing: false, duration: 1000, time: 0});


    const audioRef = useRef<HTMLAudioElement>(null)
    const progressBarRef = useRef<HTMLDivElement>(null)

    const progressBarWidth = useElementWidth(progressBarRef);
    const progressBarLength = useFitCharacterNumber([progressBarRef, progressBarWidth - 2, "|", "-"])

    const checkKeyPress = useCallback((event: KeyboardEvent) => {
        if(event.key === " ") {
            handlePlayPauseClick()
        } else if(event.key === "ArrowLeft") {
            setTime(Math.max(0, state.time - 10))
        } else if(event.key === "ArrowRight") {
            setTime(Math.min(state.duration, state.time + 10))
        }
    }, [state])

    useEffect(() => {
        document.addEventListener('keydown', checkKeyPress)
    }, [checkKeyPress])

    function pause() {
        if(!state.is_playing) return;
        let newState = { ...state }
        newState.is_playing = false;
        audioRef.current?.pause()
        updateState(newState);
    }

    function start() {
        if(state.is_playing) return;
        let newState = { ...state }
        newState.is_playing = true;
        audioRef.current?.play()
        updateState(newState);
    }

    function setTime(time: number) {
        let newState = { ...state }
        newState.time = time;
        if(audioRef.current){
            audioRef.current.currentTime = newState.time;
        }
        updateState(newState);
    }

    function handleProgressBarClick(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect()
        const progress = (event.clientX - rect.left) / (rect.right - rect.left)
        
        setTime(progress*state.duration)
    }

    function handlePlayPauseClick()  {
        if(state.is_playing) {
            pause()
        } else {
            console.log("playing")
            start()
        }
    }

    function handleAudioEnd() {
        const newState = {...state}
        newState.time = 0
        newState.is_playing = false
        updateState(newState)
    }

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            const newState  = {...state}
            //console.log("DURATION: ", audioRef.current.duration)
            newState.duration = audioRef.current.duration
            updateState(newState)
        }
    };

    const onTimeUpdate = () => {
        if(!audioRef.current) return;
        if(Math.floor(audioRef.current.currentTime) == Math.floor(state.time)) return;
        const newState = {...state}
        newState.time = audioRef.current.currentTime
        updateState(newState)
    }

    const formatSeconds = (time: number) => {
        let hours = Math.floor(time/3600)
        const minutes = Math.floor(time/60) - 60*hours
        const seconds = Math.floor(time) - 3600*hours - 60*minutes
        return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0")
    }



    //console.log("duration: ", state.duration)

    const progressBarLeftLength = Math.round(state.time*progressBarLength/state.duration);

    return (<div className="flex flex-col w-full items-center justify-center">
        <div ref={progressBarRef} className="w-2/3 bg-yellow" onClick={handleProgressBarClick}>{
            "-".repeat(progressBarLeftLength) + "|" + 
            "-".repeat(progressBarLength - progressBarLeftLength)}
        </div>
        <div className="flex items-center justify-center w-2/3">
            <div className="flex-1">
            <div className="inline-flex" role="group">
                <div className="mr-auto text-black font-mono" onClick={() => setTime(Math.max(0, state.time - 10))}>{"<"}</div>
                <div className="mr-auto text-black font-mono ml-2 mr-2" onClick={handlePlayPauseClick}>{(state.is_playing ? "#" : "!>")}</div>
                <div className="mr-auto text-black font-mono" onClick={() => setTime(Math.min(state.duration, state.time + 10))}>{">"}</div>
            </div>
            </div>
            <div className="text-black font-mono text-xs">{formatSeconds(state.time) + "/" + formatSeconds(state.duration)}</div>
            <div className="flex-1">
            </div>
        </div>
        <audio className="audio-element" ref={audioRef} onLoadedMetadata={onLoadedMetadata} onTimeUpdate={onTimeUpdate} onEnded={handleAudioEnd}>
            <source src={state.source}></source>
        </audio>
    </div>);
})