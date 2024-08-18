import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import {db} from '../../../firebase';
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { PodcastEpisode, Link } from 'app/App';
import { MouseEventHandler, ChangeEvent } from "react";
import { Player } from "./Player";
import { isMobile, isTablet, isDesktop } from 'react-device-detect'

const MainPage: React.FC = () => {

    const [podcast_episodes, setPodcastEpisodes] = useState<PodcastEpisode[]>([]);

    const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode>({id: "", title: "", description: "", path_to_audio: "", links: []});

    const [isWindowSmallSize, setIsWindowSmallSize] = useState<Boolean>(false);

    const [description, setDescription] = useState<String>("")

    const [currentMode, setCurrentMode] = useState<number>(0)

    const [emailLink, setEmailLink] = useState<string>("")

    const mode_collections = ["podcasts", "podcasts_2obj", "podcasts_funny"]
    const mode_descriptions = ["description", "description_2obj", "description_funny"]

    const playerRef = useRef();

    const fetchPodcasts = async () => {
        await getDocs(collection(db, mode_collections[currentMode]))
            .then((querySnapshot)=>{               
                const newData = querySnapshot.docs
                    .map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            title: data.title as string,
                            description: data.description as string,
                            path_to_audio: data.path_to_audio as string,
                            links: data.links
                        }
                    });
                setPodcastEpisodes(newData);
                setActiveEpisode({id: "", title: "", description: "", path_to_audio: "", links: []})
            });

    }

    const fetchContent = async () => {
        await getDoc(doc(db, "utils", "utils")).then((snapshot) => {
            const data = snapshot.data()
            if(!data) return
            setDescription(data[mode_descriptions[currentMode]] as string)
            setEmailLink(data.mailing_list_link)
        })
    }

    useEffect(() => {
        if(isMobile || isTablet || window.innerWidth < 500){
            setIsWindowSmallSize(true)
        }
        fetchContent();
        fetchPodcasts();
        window.addEventListener('resize', onWindowResize)
    }, [currentMode])
    
    const onWindowResize = () => {
        if(isMobile || isTablet || window.innerWidth < 500) {
            setIsWindowSmallSize(true)
        } else {
            setIsWindowSmallSize(false)
        }
    }

    console.log(podcast_episodes);

    function handePodcastClick(event: React.MouseEvent<HTMLParagraphElement>)  {
        const episode_id = (event.target as HTMLParagraphElement).id;
        console.log(episode_id);

        const episode = podcast_episodes.find(i => i.id === episode_id)
        if(!episode) return;

        setActiveEpisode(episode)
    }

    function handleModeChange(event: ChangeEvent<HTMLSelectElement>) {
        const newMode = Number(event.target.value)
        setCurrentMode(newMode)

    }

    return (<div className={!isWindowSmallSize ? "w-1/2 h-1/2 mx-auto" : "w-full h-full mx-auto"}>
                <div className="flex  flex-col w-full h-full shadow-2xl subpixel-antialiased rounded-md h-full bg-white mx-auto">

                    <div className="flex flex-col w-full rounded-t bg-gray-100 border-b text-center text-black" id="headerTerminal">
                        <div className="flex items-center h-6">
                            <div className="flex ml-2 items-center text-center border-red-900 bg-red-500 shadow-inner rounded-full w-3 h-3" id="closebtn">
                            </div>
                            <div className="ml-2 border-yellow-900 bg-yellow-500 shadow-inner rounded-full w-3 h-3" id="minbtn">
                            </div>
                            <div className="ml-2 border-green-900 bg-green-500 shadow-inner rounded-full w-3 h-3" id="maxbtn">
                            </div>
                            <div className="mx-auto pr-16" id="terminaltitle">
                            <p className="text-center text-sm"><b className="text-gray-600">Untitled</b><b className="text-gray-400"> –– </b><span className="text-gray-400">Edited</span></p>
                            </div>
                        </div>

                        <link rel="stylesheet" href="https://unpkg.com/flowbite@1.4.4/dist/flowbite.min.css" />

                        <div className="flex ml-2.5 mt-1.5 mb-1.5">
                            <select id="category" onChange={handleModeChange} className="bg-transparent border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-40 py-0.5 px-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="0">3 objects</option>
                                <option value="1">2 objects</option>
                                <option value="2">funny findings</option>
                            </select>

                            <select id="authors" className="ml-2.5 bg-transparent border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-24 py-0.5 px-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected>авторы</option>
                                <option value="ann">аня</option>
                                <option value="iana">яна</option>
                                <option value="vadim">вадим</option>
                            </select>

                            <div className="ml-2.5 m-auto h-4 w-5 bg-black border border-gray-300 rounded"></div>

                        </div>

                        <script src="https://unpkg.com/flowbite@1.4.0/dist/flowbite.js"></script>
                    </div>

                    

                    <div className="flex flex-col w-full overflow-y-auto pl-1 pt-1 h-full" id="console">
                        <p className="text-black font-mono text-xs">{description}</p>
                        <br></br>
                        {
                            podcast_episodes.map((episode) => {
                                return <>
                                    <p onClick={handePodcastClick} id={episode.id} className="text-blue-800 font-mono text-xs underline">{episode.title}</p>
                                    { activeEpisode && activeEpisode.id === episode.id && <>
                                        <br></br>
                                        <Player source={episode.path_to_audio} ref={playerRef}></Player>
                                        <br></br>
                                        { episode.links.length != 0 && <div className="ml-5">
                                        <p className="text-slate-500 font-mono text-xs">ссылки на материалы:</p>
                                        {
                                            episode.links.map((link) => {
                                                return <p className="text-slate-500 font-mono text-xs">- <a className="underline" href={link.link}  target="_blank">{link.title}</a></p>
                                            })
                                        }
                                        </div>}
                                    </>}
                                    <br></br>
                                </>
                            })
                        }
                        <br></br>
                        {emailLink !== "" && <a className="text-slate-500 font-mono text-xs underline" href={emailLink}  target="_blank">подписывайтесь на рассылку, чтобы не пропускать новые эпизоды!</a>}
                    </div>
                </div> 
            </div>);
};

export default MainPage;
