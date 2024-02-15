import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { format } from "../utils/formatSeconds.js";

// eslint-disable-next-line react/prop-types
const Duration = ({ className, seconds }) => {
    return (
        <time dateTime={`P${Math.round(seconds)}S`} className={className}>
            {format(seconds)}
        </time>
    );
};

export default function Player() {
    const [urlInput, setUrlInput] = useState(
        "https://zh2-13-hls7-pvr.zahs.tv/HD_eurosport1_de/1707901796800/1707907198400/m.m3u8?z32=MF2WI2LPL5RW6ZDFMNZT2YLBMMTGG43JMQ6TCN2CGNBDERJZGU3TSRRVIE3TELJSIUZDAMSCGQ4TERKFGM2DCOJSEZSXMZLOOQ6TCJTTNFTT2NBWL5RDAMBQG5SDMZBZG5RWIMRSMU2GEZLGMNTGGNZZGUYDOOJUMUZTMJTWHUYA"
    );

    const [settings, setSettings] = useState({
        url: "",
        pip: false,
        playing: true,
        controls: true,
        light: false,
        volume: 0.8,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false,
    });

    const {
        playing,
        light,
        pip,
        played,
        volume,
        controls,
        muted,
        loop,
        loaded,
        url,
        playbackRate,
        duration,
    } = settings;

    const player = useRef(null);

    const load = (url) => {
        setSettings((prevState) => ({
            ...prevState,
            url,
            played: 0,
            loaded: 0,
            pip: false,
        }));
    };

    const handlePlayPause = () => {
        setSettings((prevState) => ({
            ...prevState,
            playing: !prevState.playing,
        }));
    };

    const handleStop = () => {
        setSettings((prevState) => ({
            ...prevState,
            url: null,
            playing: false,
        }));
    };

    const handleToggleControls = () => {
        const { url } = settings;
        setSettings((prevState) => ({
            ...prevState,
            controls: !prevState.controls,
            url: null,
        }));
        load(url);
    };

    const handleToggleLight = () => {
        setSettings((prevState) => ({ ...prevState, light: !prevState.light }));
    };

    const handleToggleLoop = () => {
        setSettings((prevState) => ({ ...prevState, loop: !prevState.loop }));
    };

    const handleVolumeChange = (e) => {
        const value = parseFloat(e.target.value);
        setSettings((prevState) => ({ ...prevState, volume: value }));
    };

    const handleToggleMuted = () => {
        setSettings((prevState) => ({ ...prevState, muted: !prevState.muted }));
    };

    const handleSetPlaybackRate = (e) => {
        const value = parseFloat(e.target.value);
        setSettings((prevState) => ({ ...prevState, playbackRate: value }));
    };

    const handleOnPlaybackRateChange = (speed) => {
        setSettings((prevState) => ({
            ...prevState,
            playbackRate: parseFloat(speed),
        }));
    };

    const handleTogglePIP = () => {
        setSettings((prevState) => ({ ...prevState, pip: !prevState.pip }));
    };

    const handlePlay = () => {
        console.log("onPlay");
        setSettings((prevState) => ({ ...prevState, playing: true }));
    };

    const handleEnablePIP = () => {
        console.log("onEnablePIP");
        setSettings((prevState) => ({ ...prevState, pip: true }));
    };

    const handleDisablePIP = () => {
        console.log("onDisablePIP");
        setSettings((prevState) => ({ ...prevState, pip: false }));
    };

    const handlePause = () => {
        console.log("onPause");
        setSettings((prevState) => ({ ...prevState, playing: false }));
    };

    const handleSeekMouseDown = () => {
        setSettings((prevState) => ({ ...prevState, seeking: true }));
    };

    const handleSeekChange = (e) => {
        const value = parseFloat(e.target.value);
        setSettings((prevState) => ({ ...prevState, played: value }));
    };

    const handleSeekMouseUp = (e) => {
        setSettings((prevState) => ({ ...prevState, seeking: false }));
        player.current.seekTo(parseFloat(e.target.value));
    };

    const handleProgress = (state) => {
        console.log("onProgress", state);
        if (!state.seeking) {
            setSettings((prevState) => ({ ...prevState, ...state }));
        }
    };

    const handleEnded = () => {
        console.log("onEnded");
        setSettings((prevState) => ({ ...prevState, playing: prevState.loop }));
    };

    const handleDuration = (duration) => {
        console.log("onDuration", duration);
        setSettings((prevState) => ({ ...prevState, duration }));
    };

    const handleClickFullscreen = () => {
        screenfull.request(document.querySelector(".react-player"));
    };

    return (
        <div className="app">
            <section className="section">
                <div className="player-wrapper flex place-content-center py-4">
                    <ReactPlayer
                        ref={player}
                        className="react-player"
                        width="60%"
                        height="60%"
                        url={settings.url}
                        pip={settings.pip}
                        playing={settings.playing}
                        controls={settings.controls}
                        light={settings.light}
                        loop={settings.loop}
                        playbackRate={settings.playbackRate}
                        volume={settings.volume}
                        muted={settings.muted}
                        onReady={() => console.log("onReady")}
                        onStart={() => console.log("onStart")}
                        onPlay={handlePlay}
                        onEnablePIP={handleEnablePIP}
                        onDisablePIP={handleDisablePIP}
                        onPause={handlePause}
                        onBuffer={() => console.log("onBuffer")}
                        onPlaybackRateChange={handleOnPlaybackRateChange}
                        onSeek={(e) => console.log("onSeek", e)}
                        onEnded={handleEnded}
                        onError={(e) => console.log("onError", e)}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        onPlaybackQualityChange={(e) =>
                            console.log("onPlaybackQualityChange", e)
                        }
                    />
                </div>
                <table>
                    <tbody>
                        <tr>
                            <th>Controls</th>
                            <td>
                                <button onClick={handleStop}>Stop</button>
                                <button onClick={handlePlayPause}>
                                    {playing ? "Pause" : "Play"}
                                </button>
                                <button onClick={handleClickFullscreen}>
                                    Fullscreen
                                </button>
                                {light && (
                                    <button
                                        onClick={() => player.showPreview()}
                                    >
                                        Show preview
                                    </button>
                                )}
                                {ReactPlayer.canEnablePIP(url) && (
                                    <button onClick={handleTogglePIP}>
                                        {pip ? "Disable PiP" : "Enable PiP"}
                                    </button>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>Speed</th>
                            <td>
                                <button
                                    onClick={handleSetPlaybackRate}
                                    value={1}
                                >
                                    1x
                                </button>
                                <button
                                    onClick={handleSetPlaybackRate}
                                    value={1.5}
                                >
                                    1.5x
                                </button>
                                <button
                                    onClick={handleSetPlaybackRate}
                                    value={2}
                                >
                                    2x
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th>Seek</th>
                            <td>
                                <input
                                    type="range"
                                    min={0}
                                    max={0.999999}
                                    step="any"
                                    value={played}
                                    onMouseDown={handleSeekMouseDown}
                                    onChange={handleSeekChange}
                                    onMouseUp={handleSeekMouseUp}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Volume</th>
                            <td>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step="any"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="controls">Controls</label>
                            </th>
                            <td>
                                <input
                                    id="controls"
                                    type="checkbox"
                                    checked={controls}
                                    onChange={handleToggleControls}
                                />
                                <em>&nbsp; Requires player reload</em>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="muted">Muted</label>
                            </th>
                            <td>
                                <input
                                    id="muted"
                                    type="checkbox"
                                    checked={muted}
                                    onChange={handleToggleMuted}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="loop">Loop</label>
                            </th>
                            <td>
                                <input
                                    id="loop"
                                    type="checkbox"
                                    checked={loop}
                                    onChange={handleToggleLoop}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="light">Light mode</label>
                            </th>
                            <td>
                                <input
                                    id="light"
                                    type="checkbox"
                                    checked={light}
                                    onChange={handleToggleLight}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Played</th>
                            <td>
                                <progress max={1} value={played} />
                            </td>
                        </tr>
                        <tr>
                            <th>Loaded</th>
                            <td>
                                <progress max={1} value={loaded} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section className="section">
                <table>
                    <tbody>
                        <tr>
                            <th>Custom URL</th>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Enter URL"
                                    value={urlInput}
                                    onChange={(e) =>
                                        setUrlInput(e.target.value)
                                    }
                                />
                                <button
                                    onClick={() =>
                                        setSettings({
                                            ...settings,
                                            url: urlInput,
                                        })
                                    }
                                >
                                    Load
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h2>State</h2>

                <table>
                    <tbody>
                        <tr>
                            <th>url</th>
                            <td className={!url ? "faded" : ""}>
                                {(url instanceof Array ? "Multiple" : url) ||
                                    "null"}
                            </td>
                        </tr>
                        <tr>
                            <th>playing</th>
                            <td>{playing ? "true" : "false"}</td>
                        </tr>
                        <tr>
                            <th>volume</th>
                            <td>{volume.toFixed(3)}</td>
                        </tr>
                        <tr>
                            <th>speed</th>
                            <td>{playbackRate}</td>
                        </tr>
                        <tr>
                            <th>played</th>
                            <td>{played.toFixed(3)}</td>
                        </tr>
                        <tr>
                            <th>loaded</th>
                            <td>{loaded.toFixed(3)}</td>
                        </tr>
                        <tr>
                            <th>duration</th>
                            <td>
                                <Duration seconds={duration} />
                            </td>
                        </tr>
                        <tr>
                            <th>elapsed</th>
                            <td>
                                <Duration seconds={duration * played} />
                            </td>
                        </tr>
                        <tr>
                            <th>remaining</th>
                            <td>
                                <Duration seconds={duration * (1 - played)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}
