
import React, { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState({
    alpha: "null",
    beta: "null",
    gamma: "null",
    absolute: false
  });

  const handle = e => {
    setOrientation({
      beta: e.beta,
      alpha: e.alpha,
      gamma: e.gamma,
      absolute: e.absolute
    });
  };

  useEffect(() => {
    window.addEventListener("deviceorientation", handle);

    return () => {
      window.removeEventListener("deviceorientation", handle);
    };
  }, []);

  return orientation;
};

const useFavicon = href => {
  const [favi, setFavi] = useState(href);

  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = favi;
    document.getElementsByTagName("head")[0].appendChild(link);
  }, [favi]);

  return setFavi;
}

const useGeolocation = () => {
  const [coords, setCoords] = useState({});
  const [error, setError] = useState("null");

  const onChange = ({ coords }) => {
    setCoords({
      lat: coords.latitude,
      long: coords.longitude
    });
  };

  const onError = (error) => {
    setError(error.message);
  };

  useEffect(() => {
    const geo = navigator.geolocation;

    if (!geo) {
      setError("not supported!");
    }

    const watcher = geo.watchPosition(onChange, onError);

    return () => geo.clearWatch(watcher);
  }, []);

  return { coords, error };
}

const useKeyPress = targetKey => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
    }
  }, []);

  return keyPressed;
}

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}

const useMousePosition = () => {
  const [x, setX] = useState();
  const [y, setY] = useState();

  const update = e => {
    setX(e.x);
    setY(e.y);
  }

  useEffect(() => {
    window.addEventListener("mousemove", update);

    return () => {
      window.removeEventListener("mousemove", update);
    }
  }, []);

  return { x, y };
}

const useOnline = () => {
  const [online, setOnline] = useState(navigator.onLine);

  const onlineHandler = () => {
    setOnline(true);
  }

  const offlineHandler = () => {
    setOnline(false);
  }

  useEffect(() => {
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    }
  }, []);

  return online;
}

const useLockScroll = () => {
  const [lock, setLock] = useState(false);

  const lockScroll = () => {
    setLock(true);
  }

  const unlockScroll = () => {
    setLock(false);
  }

  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    document.body.style.overflow = lock ? "hidden" : "";

    return () => (document.body.style.overflow = originalStyle);
  }, [lock]);

  return [lock, { lockScroll, unlockScroll }];
};

function App() {
  const { alpha, beta, gamma } = useDeviceOrientation();
  const setFavicon = useFavicon("https://nomadcoders.co/m.svg");
  const { coords: { lat, long }, error } = useGeolocation();
  const kPressed = useKeyPress("k");
  const iPressed = useKeyPress("i");
  const mPressed = useKeyPress("m");
  const cPressed = useKeyPress("c");
  const hPressed = useKeyPress("h");
  const [currentLS, setLS] = useLocalStorage("JWT", null);
  const { x, y } = useMousePosition();
  const isOnline = useOnline();
  const [isLocked, { lockScroll, unlockScroll }] = useLockScroll();

  return (
    <div className="App">
      <h1>Hello Hooks World!</h1>
      <div>
        <h2>useDeviceOrientation</h2>
        <ul>
          <li>Alpha: {alpha}</li>
          <li>Beta: {beta}</li>
          <li>Gamma: {gamma}</li>
        </ul>
      </div>

      <div>
        <h2>useFavicon</h2>
        <button onClick={() => setFavicon("https://www.google.com/s2/favicons?domain=google.com")}>Change Favicon</button>
      </div>

      <div>
        <h2>useGeolocation</h2>
        <ul>
          <li>Latitude: {lat}</li>
          <li>Longitude: {long}</li>
          <li>Geolocation Error: {error}</li>
        </ul>
      </div>

      <div>
        <h2>useKeyPress</h2>
        <ul>
          <li>Pressed 'k': {kPressed && "K"}</li>
          <li>Pressed 'i': {iPressed && "I"}</li>
          <li>Pressed 'm': {mPressed && "M"}</li>
          <li>Pressed 'c': {cPressed && "C"}</li>
          <li>Pressed 'h': {hPressed && "H"}</li>
          <li>Pressed 'i': {iPressed && "I"}</li>
        </ul>
      </div>

      <div>
        <h2>useLocalStorage</h2>
        <ul>
          <li>Current Value: {currentLS}</li>
          <button onClick={() => setLS("12345")}>Set value: 12345</button>
          <button onClick={() => setLS(null)}>Clear LS</button>
        </ul>
      </div>

      <div>
        <h2>useMousePosition</h2>
        <ul>
          <li>Mouse X: {x}</li>
          <li>Mouse Y: {y}</li>
        </ul>
      </div>

      <div>
        <h2>useOnline</h2>
        <p>Are we online? {isOnline ? "Yes" : "No"}</p>
      </div>

      <div>
        <h2>useLockScroll</h2>
        <p>Is Locked? {isLocked ? "Yes" : "No"}</p>
        <button onClick={() => lockScroll()}>Lock Scroll</button>
        <button onClick={() => unlockScroll()}>Unlock Scroll</button>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
