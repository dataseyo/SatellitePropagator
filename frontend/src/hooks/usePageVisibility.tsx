import { useState, useEffect } from 'react';

const usePageVisibility = () => {
  const [visible, setVisible] = useState(!document.hidden);

  useEffect(() => {
    function handleVisibilityChange() {
        setVisible(document.visibilityState === 'visible');
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return visible;
}

export default usePageVisibility